/*
 *
 * Notifier constants
 *
 */

import { WS_CONNECT } from 'containers/WebSocketInterface/constants';
import { PUZZLE_ADDED } from 'containers/PuzzleActiveList/constants';
import { GOTID_MINICHAT } from 'containers/Chat/constants';

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const defaultMessageStyle = {
  position: 'br',
  level: 'info',
};

const wsConnectMsg = () => ({
  ...defaultMessageStyle,
  children: <FormattedMessage {...messages.wsConnect} />,
});

const chatroomNotExistsMsg = (context) => ({
  ...defaultMessageStyle,
  children: (
    <FormattedMessage
      {...messages.chatroomNotExists}
      values={{ name: context.name }}
    />
  ),
});

const puzzleAddedMsg = (context) => ({
  ...defaultMessageStyle,
  children: (
    <FormattedMessage {...messages.puzzleAdded} values={{ ...context }} />
  ),
});

const directMessageReceivedMsg = (context) => ({
  ...defaultMessageStyle,
  autoDismiss: 0,
  action: {
    label: <FormattedMessage {...messages.open} />,
    callback: context.callback,
  },
  message: (
    <FormattedMessage
      {...messages.directMessageReceived}
      values={{ nickname: context.sender.nickname }}
    />
  ),
});

const notifierMsg = (context) => ({
  ...defaultMessageStyle,
  ...context.payload,
});

export const DIRECTCHAT_NOTIFY = 'containers/Notifier/DIRECTCHAT_NOTIFY';

export const NOTIFIER_MESSAGE = 'containers/Notifier/NOTIFIER_MESSAGE';

export const NOTE_NEEDED = {
  WS_CONNECT,
  PUZZLE_ADDED,
  DIRECTCHAT_NOTIFY,
  GOTID_MINICHAT,
  NOTIFIER_MESSAGE,
};

export const NOTE_MSG = {
  wsConnectMsg,
  puzzleAddedMsg,
  directMessageReceivedMsg,
  chatroomNotExistsMsg,
  notifierMsg,
};
