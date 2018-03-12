/*
 * Settings Messages
 *
 * This contains all the text for the Settings component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  sendChat: {
    id: 'app.containers.Settings.sendChat',
    defaultMessage: 'Chat',
  },
  sendQuestion: {
    id: 'app.containers.Settings.sendQuestion',
    defaultMessage: 'Question (Send)',
  },
  modifyQuestion: {
    id: 'app.containers.Settings.modifyQuestion',
    defaultMessage: 'Question (Edit)',
  },
  sendAnswer: {
    id: 'app.containers.Settings.sendAnswer',
    defaultMessage: 'Answer',
  },
  NONE: {
    id: 'app.containers.Settings.NONE',
    defaultMessage: 'None',
  },
  ON_RETURN: {
    id: 'app.containers.Settings.ON_RETURN',
    defaultMessage: 'Enter',
  },
  ON_SHIFT_RETURN: {
    id: 'app.containers.Settings.ON_SHIFT_RETURN',
    defaultMessage: 'Shift+Enter',
  },
  save: {
    id: 'app.containers.Settings.save',
    defaultMessage: 'Save',
  },
  msgSendPolicy: {
    id: 'app.containers.Settings.msgSendPolicy',
    defaultMessage: 'Message Send Policy',
  },
});
