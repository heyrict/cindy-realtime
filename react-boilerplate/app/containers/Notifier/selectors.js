import { createSelector } from 'reselect';

/**
 * Direct selector to the notifier state domain
 */
const selectNotifierDomain = (state) => state.get('notifier');

/**
 * Other specific selectors
 */

/**
 * Default selector used by Notifier
 */

const makeSelectNotifier = () =>
  createSelector(selectNotifierDomain, (state) => state.get('notification'));

export default makeSelectNotifier;
