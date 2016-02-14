
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
  }
  */
function searchES(es, submittedQuery, callback) {
  // Powers the search by calling elasticsearch on behalf of the user
  // TODO: analytics (store query into ES as well!)
  var query = {};

  var method = submittedQuery.method;
  var text = submittedQuery.text;
  var user = submittedQuery.user;
  var dateRange = submittedQuery.dateRange;
  if(method === "text") {
    // This is the "best field" query structure described in the docs:
    // https://www.elastic.co/guide/en/elasticsearch/guide/current/_tuning_best_fields_queries.html
    query.dis_max = {
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
    query.match = {
      "api": text
    }
  } else if(method === "filename") {
    // We want to support things like *.csv or flare*
    // so we use wildcard
    query.wildcard = {
      "filenames": text
    }
  }
  if(user || dateRange) {
    var textQuery = JSON.parse(JSON.stringify(query)); // {{0_0}}
    query = {}
    // https://www.elastic.co/guide/en/elasticsearch/guide/current/_most_important_queries_and_filters.html#_bool_filter
    var must = [];
    if(user) {
      must.push({ "match": { "userId": user }})
    }
    if(dateRange) {
      must.push({ "range": { "updated_at": { "gte": dateRange[0]}}})
      must.push({ "range": { "updated_at": { "lte": dateRange[1]}}})
    }
    query.filtered = {
      "filter": {
        "bool": {
          "must": must
        }
      }
    }
  }

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

  es.search(query, callback);
}
