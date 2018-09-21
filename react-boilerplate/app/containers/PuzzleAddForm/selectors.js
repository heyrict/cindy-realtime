import { createSelector } from 'reselect';

/**
 * Direct selector to the puzzleAddForm state domain
 */
const selectPuzzleAddFormDomain = (state) => state.get('puzzleAddForm');

/**
 * Other specific selectors
 */

/**
 * Default selector used by PuzzleAddForm
 */

const makeSelectPuzzleAddForm = () =>
  createSelector(selectPuzzleAddFormDomain, (substate) => substate.toJS());

export default makeSelectPuzzleAddForm;
export { selectPuzzleAddFormDomain };
