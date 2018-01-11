import { createSelector } from 'reselect';

/**
 * Direct selector to the userNavbar state domain
 */
const selectUserNavbarDomain = (state) => state.get('userNavbar');

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserNavbar
 */

const makeSelectUserNavbar = () =>
  createSelector(selectUserNavbarDomain, (substate) => substate.toJS());

export default makeSelectUserNavbar;
export { selectUserNavbarDomain };
