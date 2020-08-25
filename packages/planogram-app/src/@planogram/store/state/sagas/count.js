import { put, call } from 'redux-saga/effects';
import * as actions from '../actions';
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const checkSuccess = () => {
  const result = Math.random() * 100;
  // console.log(result);
  if (result <= 50) {
    return false;
  }
  return true;
};
// Our worker Saga: will perform the async increment task
export function* incrementSaga() {
  yield put(actions.countingStart());
  yield delay(1000);
  const result = yield call(checkSuccess);
  if (result) {
    yield put(actions.increment());
    yield put(actions.countingSuccess());
  } else {
    yield put(actions.countingFailure('Unable to increment'));
  }
}

export function* decrementSaga() {
  yield put(actions.countingStart());
  yield delay(1000);
  const result = yield call(checkSuccess);
  if (result) {
    yield put(actions.decrement());
    yield put(actions.countingSuccess());
  } else {
    yield put(actions.countingFailure('Unable to decrement'));
  }
}
