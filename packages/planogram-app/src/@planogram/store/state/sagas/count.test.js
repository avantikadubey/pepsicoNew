import { incrementSaga, decrementSaga, checkSuccess, delay } from './count';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import {
  increment,
  decrement,
  countingStart,
  countingFailure,
  countingSuccess,
  decrementAsync,
  incrementAsync
} from '../actions';


describe('count saga', () => {
  it('should increment the state', () => {
    return (
      expectSaga(incrementSaga, true)
        // Assert that the `put` will eventually happen.
        .put(countingStart())
        .dispatch(decrement())
        .dispatch(countingSuccess())
        // Start the test. Returns a Promise.
        .run()
    );
  });
/*   it('should decrement the state', () => {
    testSaga(decrementSaga,true)
      .next()
      .put(countingStart())
      .next()
      .next(delay,1000)
      .next()
      .next(checkSuccess,true)
      .put(decrement())
      .next()
      .put(countingSuccess())
      .next()
      .isDone();
  }); */
});
