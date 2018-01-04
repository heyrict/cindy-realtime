import { createSelector } from 'reselect';

/**
 * Direct selector to the loginForm state domain
 */
const selectLoginFormDomain = (state) => state.get('loginForm');

/**
 * Other specific selectors
 */


/**
 * Default selector used by LoginForm
 */

const makeSelectLoginForm = () => createSelector(
  selectLoginFormDomain,
  (substate) => substate.toJS()
);

export default makeSelectLoginForm;
export {
  selectLoginFormDomain,
};
