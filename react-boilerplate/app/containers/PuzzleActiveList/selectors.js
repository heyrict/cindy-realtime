import { createSelector } from 'reselect';

/**
 * Direct selector to the puzzleActiveList state domain
 */
const selectPuzzleActiveListDomain = (state) => state.get('puzzleActiveList');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PuzzleActiveList
 */

const makeSelectPuzzleActiveList = () => createSelector(
  selectPuzzleActiveListDomain,
  (substate) => substate.toJS()
);

export default makeSelectPuzzleActiveList;
export {
  selectPuzzleActiveListDomain,
};
