import { createSelector } from 'reselect';

/**
 * Direct selector to the puzzlePage state domain
 */
const selectPuzzlePageDomain = (state) => state.get('puzzlePage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by PuzzlePage
 */

const makeSelectPuzzlePage = () =>
  createSelector(selectPuzzlePageDomain, (substate) => substate.toJS());

export default makeSelectPuzzlePage;
export { selectPuzzlePageDomain };
