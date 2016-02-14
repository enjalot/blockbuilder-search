import actions from './actions/actionNames.js'

const initialState = {
}

function rootReduce(state = initialState, action) {
	switch (action.type) {
		case actions.REQUEST_SEARCH:
      console.log("ACTION REQUEST SEARCH", action)
		case actions.RECEIVE_SEARCH:
      console.log("ACTION RECEIVE SEARCH", action)
      return state;
      /*
			return {
				...state
			}
      */
    default:
			return state;
	}
}

export default rootReduce
