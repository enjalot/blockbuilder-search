import actions from './actions/actionNames.js'

const initialState = {
  query: { method: "text", text: "", size: 100, sort: "updated_at", sort_dir: "desc"},
  results: [],
  aggregations: {}
}

function rootReduce(state = initialState, action) {
	switch (action.type) {
		case actions.REQUEST_SEARCH:
      console.log("ACTION REQUEST SEARCH", action)
      return state;
		case actions.RECEIVE_SEARCH:
      console.log("ACTION RECEIVE SEARCH", action)
			return {
				...state,
        results: action.data.hits.hits, // TODO: null check this
        aggregations: action.data.aggregations
			}
    case actions.RECEIVE_PAGE:
      console.log("ACTION RECEIVE PAGE", action)
      var moreResults = action.data.hits.hits; // TODO: null check this
			return {
				...state,
        results: state.results.concat(moreResults)
			}
    default:
			return state;
	}
}

export default rootReduce
