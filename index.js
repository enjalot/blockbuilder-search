
module.exports = function(conf, app) {
  var elasticsearch = require('elasticsearch');
  var client = new elasticsearch.Client(conf);

  var fs = require('fs')
  var express = require('express')
  app.use('/public-search', express.static(__dirname + '/public'));

  var template = fs.readFileSync(__dirname + "/views/search.html").toString()

  function searchPage(req, res, next) {
    console.log("search page")
    // TODO: there is probably a more canonical way to do this
    return res.send(template);
  }
  function searchAPI(req, res, next) {
    // Assumes express body-parser
    //var query = req.body;
    var query = req.query;
    if(typeof(query.api) === "string") {
      query.api = [query.api]
    }

    searchES(client, query, function(err, results) {
      if(err) return res.send(err);
      res.send(results);
    })
  }

  function aggregateD3API(req, res, next) {
    getAllAPIFunctions(client, function(err, results) {
      if(err) return res.send(err);
      res.send(results)
    })
  }

  return {
    page: searchPage,
    api: searchAPI,
    aggregateD3API: aggregateD3API
  }
}

/*
  Expects an elasticsearch client to be supplied, and a query with the structure:
  {
    text: "awesome data"
    user: "enjalot"
    api: ["d3.nest", "d3.layout.pack"]
    sort: "updated_at", "created_at"
    sort_dir: "desc", "asc"

  }
  */
function searchES(es, submittedQuery, callback) {
  // Powers the search by calling elasticsearch on behalf of the user
  // TODO: analytics (store query into ES as well!)
  var queryTerm = {};
  var query = {};

  var text = submittedQuery.text;
  var recent;
  var user = submittedQuery.user;
  var api = submittedQuery.api || [];
  console.log("API", api)
  var dateRange = submittedQuery.dateRange;
  if(text) {
    // This is the "best field" query structure described in the docs:
    // https://www.elastic.co/guide/en/elasticsearch/guide/current/_tuning_best_fields_queries.html
    queryTerm.dis_max = {
      "queries": [
        { "match": { "description": text }},
        { "match": { "readme":  text }},
        { "match": { "code": text }}
      ],
      "tie_breaker": 0.1
    }
  } else {
    recent = true;
    queryTerm.match_all = {};
  }
  // TODO: rethink this, we want potentially want to filter by these
  /* else if(method === "api") {
    // We assume the user knows what the possible API functions are
    // and we are doing an exact match
    queryTerm.match = {
      "api": text
    }
  } else if(method === "filename") {
    // We want to support things like *.csv or flare*
    // so we use wildcard
    queryTerm.wildcard = {
      "filenames": text
    }
  }*/
  if(user || api.length || dateRange) {
    var textQuery = JSON.parse(JSON.stringify(queryTerm)); // {{0_0}}
    queryTerm = {}
    // https://www.elastic.co/guide/en/elasticsearch/guide/current/_most_important_queries_and_filters.html#_bool_filter
    var must = [];
    if(user) {
      must.push({ "match": { "userId": user }})
    }
    if(api) {
      api.forEach(function(fn) {
        must.push({ "match": { "api": fn }})
      })
    }
    /*
    if(dateRange) {
      must.push({ "range": { "created_at": { "gte": dateRange[0]}}})
      must.push({ "range": { "created_at": { "lte": dateRange[1]}}})
    }
    */
    queryTerm.filtered = {
      "query": textQuery,
      "filter": {
        "bool": {
          "must": must
        }
      }
    }
  }

  /*
    an ES search looks like:
    {
      query: { ... },
      aggs: { ... },
      size: 100
    }
  */
  query.query = queryTerm;

  // If this is a pagination request, don't request aggregations
  if(!submittedQuery.from) {
    /* TODO: enable this when we actually use it
    query.aggs = {
      "users": {
        "terms" : { "field": "userId" }
      },
      "latest": {
        "max": {"field": "created_at" }
      },
      "earliest": {
        "min": {"field": "created_at" }
      }
    }
    */
  } else {
    query.from = submittedQuery.from;
  }
  query.size = submittedQuery.size;

  console.log("submitted", JSON.stringify(submittedQuery))
  console.log("QUERY", JSON.stringify(query))
  // For now we are only paying attention to the sort order if this is a "recent" query
  // this is so that we don't override the relevance score for other pages.
  // TODO:
  if(recent && submittedQuery.sort && submittedQuery.sort_dir) {
    query.sort = {}
    query.sort[submittedQuery.sort] = { order: submittedQuery.sort_dir }
  }

  es.search({
    index: "blockbuilder",
    type: "blocks",
    body: query
  }, callback);
}

function getAllAPIFunctions(es, callback) {
  var query = {
    "size": 0,
    "aggs": {
      "all_api": {
        "terms": {
          "field": "api",
          "size": 0
        }
      }
    }
  }
  es.search({
    index: "blockbuilder",
    type: "blocks",
    body: query
  }, callback);
}
