import { createSelector } from 'reselect';

/**
 * Direct selector to the topNavbar state domain
 */
const selectTopNavbarDomain = (state) => state.get('topNavbar');

/**
 * Other specific selectors
 */

/**
 * Default selector used by TopNavbar
 */

const makeSelectTopNavbar = () =>
  createSelector(selectTopNavbarDomain, (substate) => substate.toJS());

export default makeSelectTopNavbar;
export { selectTopNavbarDomain };
