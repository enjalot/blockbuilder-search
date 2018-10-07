import qs from 'querystring'
import d3 from 'd3'
import actions from './actionNames.js'

export default {
  // Data loading
  getSearch,
  getPage,
  getScreenshotList,
  setQuery,
  getAggregateD3API,
  getAggregateD3Modules
  // UI controls
}

// Query elasticsearch
function getSearch(query) {
  return dispatch => {
    dispatch(requestSearch(query))
    d3.json(`/api/search?${qs.stringify(query)}`, (err, response) => {
      dispatch(receiveSearch(response))
    })
  }
}

// Support pagination (don't clear results of previous query)
function getPage(query, from) {
  const q = { ...query, from }
  return dispatch => {
    dispatch(requestPage(q))
    d3.json(`/api/search?${qs.stringify(q)}`, (err, response) => {
      dispatch(receivePage(response))
    })
  }
}

function getScreenshotList() {
  return dispatch => {
    d3.json(
      'https://christopheviau.com/block_screenshot/screenshot_list.json',
      (err, response) => {
        dispatch(receiveScreenshotList(response))
      }
    )
  }
}

// Support pagination (don't clear results of previous query)
function getAggregateD3API() {
  return dispatch => {
    dispatch(requestAggregateD3API())
    d3.json('/api/aggregateD3API', (err, response) => {
      dispatch(receiveAggregateD3API(response))
    })
  }
}
// Support pagination (don't clear results of previous query)
function getAggregateD3Modules() {
  return dispatch => {
    dispatch(requestAggregateD3Modules())
    d3.json('/api/aggregateD3Modules', (err, response) => {
      dispatch(receiveAggregateD3Modules(response))
    })
  }
}

function setQuery(query) {
  return {
    type: actions.SET_QUERY,
    query
  }
}

function requestSearch(query) {
  return {
    type: actions.REQUEST_SEARCH,
    query
  }
}

function receiveSearch(response) {
  return {
    type: actions.RECEIVE_SEARCH,
    data: response
  }
}

function requestPage(query) {
  return {
    type: actions.REQUEST_PAGE,
    query
  }
}

function receivePage(response) {
  return {
    type: actions.RECEIVE_PAGE,
    data: response
  }
}

function receiveScreenshotList(response) {
  return {
    type: actions.RECEIVE_SCREENSHOTS,
    data: response
  }
}

function requestAggregateD3API() {
  return {
    type: actions.REQUEST_AGGREGATE_D3_API
  }
}

function receiveAggregateD3API(response) {
  return {
    type: actions.RECEIVE_AGGREGATE_D3_API,
    data: response
  }
}

function requestAggregateD3Modules() {
  return {
    type: actions.REQUEST_AGGREGATE_D3_MODULES
  }
}

function receiveAggregateD3Modules(response) {
  return {
    type: actions.RECEIVE_AGGREGATE_D3_MODULES,
    data: response
  }
}