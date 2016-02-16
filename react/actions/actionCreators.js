import actions from './actionNames.js';
import d3 from 'd3'


export default {
    // Data loading
    getSearch,
    getPage
    // UI controls
}

// Query elasticsearch
function getSearch(query) {
  return dispatch => {
    dispatch(requestSearch(query));
    d3.json('/api/search')
      .header("Content-Type", "application/json")
      .post(JSON.stringify(query), function(err, response) {
        dispatch(receiveSearch(response))
      })
    };
}

// Support pagination (don't clear results of previous query)
function getPage(query, from) {
  var q = {...query, from: from}
  return dispatch => {
    dispatch(requestPage(q));
    d3.json('/api/search')
      .header("Content-Type", "application/json")
      .post(JSON.stringify(q), function(err, response) {
        dispatch(receivePage(response))
      })
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
