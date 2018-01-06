
import { fromJS } from 'immutable';
import puzzleActiveListReducer from '../reducer';

describe('puzzleActiveListReducer', () => {
  it('returns the initial state', () => {
    expect(puzzleActiveListReducer(undefined, {})).toEqual(fromJS({}));
  });
});
