import { createStore as reduxCreateStore } from 'redux';
import { reducers, enhancers, watchers, middlewares } from './my-store';

let targetReducers = null;

if (reducers !== null) {
  targetReducers = reducers;
} else {
  const initialState = { count: 100 };
  targetReducers = (state = initialState, action) => {
    if (action.type === `INCREMENT`) {
      return Object.assign({}, state, {
        count: state.count + 1,
      });
    }
    return state;
  };
}

const createStore = () => {
  let store = null;
  if (enhancers !== null) {
    store = reduxCreateStore(targetReducers, enhancers);
  } else {
    store = reduxCreateStore(targetReducers);
  }
  if (watchers !== null && watchers.length > 0) {
    if (middlewares !== null && middlewares.saga !== null) {
      watchers.forEach(watcher => {
        middlewares.saga
          .run(watcher)
          .toPromise()
          .catch(e => {
            console.log(e);
          });
      });
    }
  }
  return store;
};

export default createStore;
