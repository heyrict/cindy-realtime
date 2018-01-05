
import { fromJS } from 'immutable';
import puzzlePageReducer from '../reducer';

describe('puzzlePageReducer', () => {
  it('returns the initial state', () => {
    expect(puzzlePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
