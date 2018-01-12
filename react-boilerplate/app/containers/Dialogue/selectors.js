import { createSelector } from 'reselect';

/**
 * Direct selector to the dialogue state domain
 */
const selectDialogueDomain = (state) => state.get('dialogue');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Dialogue
 */

const makeSelectDialogue = () => createSelector(
  selectDialogueDomain,
  (substate) => substate.toJS()
);

export default makeSelectDialogue;
export {
  selectDialogueDomain,
};
