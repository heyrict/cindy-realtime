import { createSelector } from 'reselect';

/**
 * Direct selector to the puzzleList state domain
 */
const selectPuzzleListDomain = (state) => state.get('puzzleList');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PuzzleList
 */

const makeSelectPuzzleList = () => createSelector(
  selectPuzzleListDomain,
  (substate) => substate.toJS()
);

export default makeSelectPuzzleList;
export {
  selectPuzzleListDomain,
};
