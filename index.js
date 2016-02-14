
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
    var query = req.body;
    searchES(client, query, function(err, results) {
      if(err) return res.send(err);
      res.send(results);
    })
  }
  return {
    page: searchPage,
    api: searchAPI
  }
}

/*
  Expects an elasticsearch client to be supplied, and a query with the structure:
  {
    method: "text", "api", filename"
    text: "awesome data"
    user: "enjalot"
    sort: "updated_at", "created_at"
    sort_dir: "desc", "asc"

  }
  */
function searchES(es, submittedQuery, callback) {
  // Powers the search by calling elasticsearch on behalf of the user
  // TODO: analytics (store query into ES as well!)
  var queryTerm = {};
  var query = {};

  var method = submittedQuery.method;
  var text = submittedQuery.text;
  var user = submittedQuery.user;
  var dateRange = submittedQuery.dateRange;
  if(method === "text") {
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
  } else if(method === "api") {
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
  }
  if(user || dateRange) {
    var textQuery = JSON.parse(JSON.stringify(queryTerm)); // {{0_0}}
    queryTerm = {}
    // https://www.elastic.co/guide/en/elasticsearch/guide/current/_most_important_queries_and_filters.html#_bool_filter
    var must = [];
    if(user) {
      must.push({ "match": { "userId": user }})
    }
    if(dateRange) {
      must.push({ "range": { "updated_at": { "gte": dateRange[0]}}})
      must.push({ "range": { "updated_at": { "lte": dateRange[1]}}})
    }
    queryTerm.filtered = {
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
  } else {
    query.from = submittedQuery.from;
  }
  query.size = submittedQuery.size;

  console.log("submitted", JSON.stringify(submittedQuery))
  console.log("QUERY", JSON.stringify(query))
  if(submittedQuery.sort && submittedQuery.sort_dir) {
    // TODO: handle sorting properly
  }

  es.search({
    index: "blockbuilder",
    type: "blocks",
    body: query
  }, callback);
}
