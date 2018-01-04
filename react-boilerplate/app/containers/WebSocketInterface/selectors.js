import { createSelector } from 'reselect';

/**
 * Direct selector to the webSocketInterface state domain
 */
const selectWebSocketInterfaceDomain = (state) => state.get('webSocketInterface');

/**
 * Other specific selectors
 */


/**
 * Default selector used by WebSocketInterface
 */

const makeSelectWebSocketInterface = () => createSelector(
  selectWebSocketInterfaceDomain,
  (substate) => substate.toJS()
);

export default makeSelectWebSocketInterface;
export {
  selectWebSocketInterfaceDomain,
};
