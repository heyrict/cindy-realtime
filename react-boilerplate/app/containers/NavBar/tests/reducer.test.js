
import { fromJS } from 'immutable';
import navBarReducer from '../reducer';

describe('navBarReducer', () => {
  it('returns the initial state', () => {
    expect(navBarReducer(undefined, {})).toEqual(fromJS({}));
  });
});
