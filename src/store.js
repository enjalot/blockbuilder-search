import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducer.js'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
  const middlewares = [thunk];

  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(...middlewares)
    ),
  );

  return store;
}

const store = configureStore();
export default store;
