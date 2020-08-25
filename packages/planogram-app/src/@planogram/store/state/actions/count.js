import * as actionTypes from './action-types';


export const countingStart = () => {
  return {
      type: actionTypes.COUNTING_ASYNC_START
  };
};

export const countingSuccess = () => {
  return {
      type: actionTypes.COUNTING_ASYNC_SUCCESS,
      error: null
  };
};

export const countingFailure = (error) => {
  return {
      type: actionTypes.COUNTING_ASYNC_FAILURE,
      error
  };
};

export const increment = () => {
  return {
    type: actionTypes.INCREMENT
  };
};

export const incrementAsync = () => {
  return {
    type: actionTypes.INCREMENT_ASYNC
  };
};

export const decrement = () => {
  return {
    type: actionTypes.DECREMENT
  };
};

export const decrementAsync = () => {
  return {
    type: actionTypes.DECREMENT_ASYNC
  };
};
