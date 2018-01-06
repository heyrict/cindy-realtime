
import { fromJS } from 'immutable';
import testPageIiReducer from '../reducer';

describe('testPageIiReducer', () => {
  it('returns the initial state', () => {
    expect(testPageIiReducer(undefined, {})).toEqual(fromJS({}));
  });
});
