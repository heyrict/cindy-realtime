import { createSelector } from 'reselect';

/**
 * Direct selector to the navbarUserDropdown state domain
 */
const selectNavbarUserDropdownDomain = (state) => state.get('navbarUserDropdown');

/**
 * Other specific selectors
 */


/**
 * Default selector used by NavbarUserDropdown
 */

const makeSelectNavbarUserDropdown = () => createSelector(
  selectNavbarUserDropdownDomain,
  (substate) => substate.toJS()
);

export default makeSelectNavbarUserDropdown;
export {
  selectNavbarUserDropdownDomain,
};
