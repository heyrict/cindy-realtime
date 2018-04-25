/*
 *
 * Notifier actions
 *
 */

import { NOTIFIER_MESSAGE } from './constants';

export const nAlert = (message) => ({
  type: NOTIFIER_MESSAGE,
  payload: {
    autoDismiss: 10,
    message,
  },
});

export const nMessage = (payload) => ({
  type: NOTIFIER_MESSAGE,
  payload,
});
