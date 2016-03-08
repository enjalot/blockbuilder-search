import actions from './actionNames.js';
import qs from 'querystring'
import d3 from 'd3'


export default {
    // Data loading
    getSearch,
    getPage,
    setQuery,
    getAggregateD3API
    // UI controls
}

function injectScreenshots(response, callback){
  var gists = response.hits.hits;
  var gistsWithoutThumb = gists.filter(function(d){ return !d._source.thumb; })
  var gistsWithoutThumbIds = gistsWithoutThumb.map(function(d, i){ return d._id; });;
  if(gistsWithoutThumbIds.length > 0){
    d3.json("http://69.164.216.89:8080")
      .post(JSON.stringify({"gists":gistsWithoutThumbIds}), function(error, data) {
        if(error){
          console.error('Invalid response from screenshot API.', 'Error: ' + JSON.stringify(error), 'Reponse: ' + JSON.stringify(data));
          return callback.call(this, response);
        }
        gistsWithoutThumb.forEach(function(d){ return d._source.thumbBase64 = data[d._id]; });
        callback.call(this, response);
      });
  }
  else {
    callback.call(this, response);
  }
}

// Query elasticsearch
function getSearch(query) {
  return dispatch => {
    dispatch(requestSearch(query));
    d3.json('http://blockbuilder.org/api/search?' + qs.stringify(query), function(err, response) {
        if(err || !response.hits || !response.hits.hits){
          console.error('Invalid response from search API.', 'Error: ' + err, 'Reponse: ' + JSON.stringify(response));
          return dispatch(receiveSearch(response));
        }
      injectScreenshots(response, function(responseWithScreenshots){
        dispatch(receiveSearch(responseWithScreenshots));
      });
    })
  };
}

// Support pagination (don't clear results of previous query)
function getPage(query, from) {
  var q = {...query, from: from}
  return dispatch => {
    dispatch(requestPage(q));
    d3.json('http://blockbuilder.org/api/search?' + qs.stringify(q), function(err, response) {
        injectScreenshots(response, function(responseWithScreenshots){
          dispatch(receivePage(responseWithScreenshots));
        });
      })
  };
}

// Support pagination (don't clear results of previous query)
function getAggregateD3API() {
  return dispatch => {
    dispatch(requestAggregateD3API());
    d3.json('http://blockbuilder.org/api/aggregateD3API', function(err, response) {
        dispatch(receiveAggregateD3API(response))
      })
  };
}

function setQuery(query) {
  return {
    type: actions.SET_QUERY,
    query: query
  };
}

function requestSearch(query) {
  return {
    type: actions.REQUEST_SEARCH,
    query: query
  };
}

function receiveSearch(response) {
  return {
    type: actions.RECEIVE_SEARCH,
    data: response
  };
}

function requestPage(query) {
  return {
    type: actions.REQUEST_PAGE,
    query: query
  };
}

function receivePage(response) {
  return {
    type: actions.RECEIVE_PAGE,
    data: response
  };
}
function requestAggregateD3API() {
  return {
    type: actions.REQUEST_AGGREGATE_D3_API,
  };
}

function receiveAggregateD3API(response) {
  return {
    type: actions.RECEIVE_AGGREGATE_D3_API,
    data: response
  };
}
