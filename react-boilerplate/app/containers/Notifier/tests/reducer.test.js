import { fromJS } from 'immutable';
import notifierReducer from '../reducer';

describe('notifierReducer', () => {
  it('returns the initial state', () => {
    expect(notifierReducer(undefined, {})).toEqual(fromJS({}));
  });
});
