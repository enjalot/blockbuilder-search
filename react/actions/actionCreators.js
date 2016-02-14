import actions from './actionNames.js';
import d3 from 'd3'


export default {
    // Data loading
    getSearch,
    // UI controls
}

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
