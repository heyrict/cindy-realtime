import { createSelector } from 'reselect';

/**
 * Direct selector to the chat state domain
 */
const selectChatDomain = (state) => state.get('chat');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Chat
 */

const makeSelectChat = () => createSelector(
  selectChatDomain,
  (substate) => substate.toJS()
);

export default makeSelectChat;
export {
  selectChatDomain,
};
