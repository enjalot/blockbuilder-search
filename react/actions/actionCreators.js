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

// Query elasticsearch
function getSearch(query) {
  return dispatch => {
    dispatch(requestSearch(query));
    d3.json('/api/search?' + qs.stringify(query), function(err, response) {
        dispatch(receiveSearch(response))
      })
  };
}

// Support pagination (don't clear results of previous query)
function getPage(query, from) {
  var q = {...query, from: from}
  return dispatch => {
    dispatch(requestPage(q));
    d3.json('/api/search?' + qs.stringify(q), function(err, response) {
        dispatch(receivePage(response))
      })
  };
}

// Support pagination (don't clear results of previous query)
function getAggregateD3API() {
  return dispatch => {
    dispatch(requestAggregateD3API());
    d3.json('/api/aggregateD3API', function(err, response) {
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
