
import { fromJS } from 'immutable';
import dialogueReducer from '../reducer';

describe('dialogueReducer', () => {
  it('returns the initial state', () => {
    expect(dialogueReducer(undefined, {})).toEqual(fromJS({}));
  });
});
