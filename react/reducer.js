import actions from './actions/actionNames.js'

const initialState = {
  query: { text: "", size: 100, sort: "created_at", sort_dir: "desc", user: "", api: []},
  results: [],
  d3Apis: [],
  //aggregations: {}
}

function rootReduce(state = initialState, action) {
	switch (action.type) {
    case actions.SET_QUERY:
      return {
        ...state,
        // we don't overwrite the whole query, just the parts that are updated
        query: { ...state.query, ...action.query},
      };
		case actions.REQUEST_SEARCH:
      //console.log("ACTION REQUEST SEARCH", action)
      return {
        ...state,
        // we don't overwrite the whole query, just the parts that are updated
        query: { ...state.query, ...action.query},
        results: [],
        //aggregations: {},
        loading: true
      };
		case actions.RECEIVE_SEARCH:
      //console.log("ACTION RECEIVE SEARCH", action)
			return {
				...state,
        loading: false,
        results: action.data.hits.hits, // TODO: null check this
        totalResults: action.data.hits.total,
        //aggregations: action.data.aggregations
			}
    case actions.REQUEST_PAGE:
      //console.log("ACTION REQUEST PAGE", action)
      return {
        ...state,
        // we don't overwrite the whole query, just the parts that are updated
        loading: true
      };
    case actions.RECEIVE_SCREENSHOTS:
      //console.log("RECEIVE_SCREENSHOTS", action)
		return {
		  ...state,
          screenshots: action.data
	}
    case actions.RECEIVE_PAGE:
      //console.log("ACTION RECEIVE PAGE", action)
      var moreResults = action.data.hits.hits; // TODO: null check this
			return {
				...state,
        loading: false,
        results: state.results.concat(moreResults)
			}
    case actions.RECEIVE_AGGREGATE_D3_API:
      //console.log("RECEIVE", action.data)
      return  {
        ...state,
        d3Apis: action.data.aggregations.all_api.buckets
      }
    case actions.REQUEST_AGGREGATE_D3_API:
      return {
        ...state
      }
    default:
			return state;
	}
}

export default rootReduce
