
import { fromJS } from 'immutable';
import puzzleListReducer from '../reducer';

describe('puzzleListReducer', () => {
  it('returns the initial state', () => {
    expect(puzzleListReducer(undefined, {})).toEqual(fromJS({}));
  });
});
