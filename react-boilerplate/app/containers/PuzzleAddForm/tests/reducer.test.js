import { fromJS } from 'immutable';
import puzzleAddFormReducer from '../reducer';

describe('puzzleAddFormReducer', () => {
  it('returns the initial state', () => {
    expect(puzzleAddFormReducer(undefined, {})).toEqual(fromJS({}));
  });
});
