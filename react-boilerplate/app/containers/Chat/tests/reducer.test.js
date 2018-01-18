
import { fromJS } from 'immutable';
import chatReducer from '../reducer';

describe('chatReducer', () => {
  it('returns the initial state', () => {
    expect(chatReducer(undefined, {})).toEqual(fromJS({}));
  });
});
