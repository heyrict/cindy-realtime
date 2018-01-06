import { createSelector } from 'reselect';

/**
 * Direct selector to the testPage state domain
 */
const selectTestPageDomain = (state) => state.get('testPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TestPage
 */

const makeSelectTestPage = () => createSelector(
  selectTestPageDomain,
  (substate) => substate.toJS()
);

export default makeSelectTestPage;
export {
  selectTestPageDomain,
};
