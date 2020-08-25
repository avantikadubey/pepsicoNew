import reducer from './count';
import {
  increment,
  decrement,
  countingStart,
  countingFailure,
  countingSuccess
} from '../actions';

describe('count reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      count: 50,
      loading: false,
      error: null
    });
  });

  it('should increment the count', () => {
    expect(
      reducer({ count: 50, loading: false, error: null }, increment())
    ).toEqual({ count: 51, loading: false, error: null });
  });

  it('should decrement the count', () => {
    expect(
      reducer({ count: 50, loading: false, error: null }, decrement())
    ).toEqual({ count: 49, loading: false, error: null });
  });

  it('should set counting', () => {
    expect(
      reducer({ count: 50, loading: false, error: null }, countingStart())
    ).toEqual({ count: 50, loading: true, error: null });
  });

  it('should set counting success', () => {
    expect(
      reducer({ count: 50, loading: false, error: 'Error' }, countingSuccess())
    ).toEqual({ count: 50, loading: false, error: null });
  });

  it('should set counting failure', () => {
    expect(
      reducer(
        { count: 50, loading: false, error: 'Error' },
        countingFailure('Unable to count')
      )
    ).toEqual({ count: 50, loading: false, error: 'Unable to count' });
  });
});
