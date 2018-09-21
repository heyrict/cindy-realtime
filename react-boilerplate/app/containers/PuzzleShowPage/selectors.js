import { createSelector } from 'reselect';

/**
 * Direct selector to the puzzleShowPage state domain
 */
const selectPuzzleShowPageDomain = (state) => state.get('puzzleShowPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by PuzzleShowPage
 */

const makeSelectPuzzleShowPage = () =>
  createSelector(selectPuzzleShowPageDomain, (substate) => substate.toJS());

export default makeSelectPuzzleShowPage;
export { selectPuzzleShowPageDomain };
