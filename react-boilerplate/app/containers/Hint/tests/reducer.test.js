
import { fromJS } from 'immutable';
import hintReducer from '../reducer';

describe('hintReducer', () => {
  it('returns the initial state', () => {
    expect(hintReducer(undefined, {})).toEqual(fromJS({}));
  });
});
