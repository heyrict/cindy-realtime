import { createSelector } from 'reselect';

/**
 * Direct selector to the testPageIi state domain
 */
const selectTestPageIiDomain = (state) => state.get('testPageIi');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TestPageIi
 */

const makeSelectTestPageIi = () => createSelector(
  selectTestPageIiDomain,
  (substate) => substate.toJS()
);

export default makeSelectTestPageIi;
export {
  selectTestPageIiDomain,
};
