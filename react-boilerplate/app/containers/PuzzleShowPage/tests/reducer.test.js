import { fromJS } from 'immutable';
import puzzleShowPageReducer from '../reducer';

describe('puzzleShowPageReducer', () => {
  it('returns the initial state', () => {
    expect(puzzleShowPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
