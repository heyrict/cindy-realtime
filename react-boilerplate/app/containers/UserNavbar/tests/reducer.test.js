import { fromJS } from 'immutable';
import navbarUserDropdownReducer from '../reducer';

describe('navbarUserDropdownReducer', () => {
  it('returns the initial state', () => {
    expect(navbarUserDropdownReducer(undefined, {})).toEqual(fromJS({}));
  });
});
