
import { fromJS } from 'immutable';
import testPageReducer from '../reducer';

describe('testPageReducer', () => {
  it('returns the initial state', () => {
    expect(testPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
