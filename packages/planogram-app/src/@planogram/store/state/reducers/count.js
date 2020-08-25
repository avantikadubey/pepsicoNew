import * as actionTypes from '../actions/action-types';
import { updateObject } from '../utility';

const initialState = { count: 50, loading: false, error: null };

const countingStart = (state) => {
  return updateObject(state, { error: null, loading: true });
};

const countingSuccess = (state) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};

const countingFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INCREMENT:
      return updateObject(state, { count: state.count + 1 });
    case actionTypes.DECREMENT:
      return updateObject(state, { count: state.count - 1 });
    case actionTypes.COUNTING_ASYNC_START:
      return countingStart(state);
    case actionTypes.COUNTING_ASYNC_SUCCESS:
      return countingSuccess(state);
    case actionTypes.COUNTING_ASYNC_FAILURE:
      return countingFail(state, action);
    default:
      return state;
  }
};

export default reducer;
