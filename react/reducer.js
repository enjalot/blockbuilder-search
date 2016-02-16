import actions from './actions/actionNames.js'

const initialState = {
  query: { method: "text", text: "", size: 100, sort: "created_at", sort_dir: "desc"},
  results: [],
  aggregations: {}
}

function rootReduce(state = initialState, action) {
	switch (action.type) {
		case actions.REQUEST_SEARCH:
      console.log("ACTION REQUEST SEARCH", action)
      return {
        ...state,
        // we don't overwrite the whole query, just the parts that are updated
        query: { ...state.query, ...action.query},
        results: [],
        aggregations: {},
        loading: true
      };
		case actions.RECEIVE_SEARCH:
      console.log("ACTION RECEIVE SEARCH", action)
			return {
				...state,
        loading: false,
        results: action.data.hits.hits, // TODO: null check this
        totalResults: action.data.hits.total,
        aggregations: action.data.aggregations
			}
    case actions.REQUEST_PAGE:
      console.log("ACTION REQUEST PAGE", action)
      return {
        ...state,
        // we don't overwrite the whole query, just the parts that are updated
        loading: true
      };
    case actions.RECEIVE_PAGE:
      console.log("ACTION RECEIVE PAGE", action)
      var moreResults = action.data.hits.hits; // TODO: null check this
			return {
				...state,
        loading: false,
        results: state.results.concat(moreResults)
			}
    default:
			return state;
	}
}

export default rootReduce
