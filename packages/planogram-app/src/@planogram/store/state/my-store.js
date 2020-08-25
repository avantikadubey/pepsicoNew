import { applyMiddleware, compose, combineReducers } from 'redux';
import { pogReducer, countReducer } from './reducers';
import { watchCounter, watchPog } from './sagas';
import createSagaMiddleware from 'redux-saga';
import * as actions from './actions';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

/**
 * Override the default store of the theme
 */
const enhancers = composeEnhancers(applyMiddleware(sagaMiddleware));
const reducers = combineReducers({
  demo: countReducer,
  pog: pogReducer
});

// Initialize the saga middleware
const middlewares = {
  saga: sagaMiddleware
};

const watchers = [watchCounter, watchPog];

/**
 * Initialize the store based on any actions that needs to be triggered
 * @param {*} store 
 */
const initStore = (store) => {
  // store.dispatch(actions.loadPlanogramTypes());
  // store.dispatch(actions.loadPlanogramsForConfiguration());
  store.dispatch(actions.loadChainsAndStores());
};
export { reducers, enhancers, watchers, middlewares, initStore };
