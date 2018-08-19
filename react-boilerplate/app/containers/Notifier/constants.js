/*
 *
 * Notifier constants
 *
 */

import { text2md } from 'common';
import {
  WS_CONNECTED,
  WS_DISCONNECTED,
} from 'containers/WebSocketInterface/constants';
import { PUZZLE_ADDED } from 'containers/PuzzleActiveList/constants';
import { GOTID_MINICHAT } from 'containers/Chat/constants';

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const defaultMessageStyle = {
  position: 'br',
  level: 'info',
};

const wsConnectedMsg = () => ({
  ...defaultMessageStyle,
  children: <FormattedMessage {...messages.wsConnected} />,
});

const wsDisconnectedMsg = () => ({
  ...defaultMessageStyle,
  children: <FormattedMessage {...messages.wsDisconnected} />,
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
  children: context.anonymous ? (
    <FormattedMessage
      {...messages.puzzleAddedAnonymous}
      values={{ ...context }}
    />
  ) : (
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

const broadcastMsg = (context) => ({
  ...defaultMessageStyle,
  ...context.payload,
  message: null,
  children: (
    <span
      dangerouslySetInnerHTML={{ __html: text2md(context.payload.message) }}
    />
  ),
});

export const DIRECTCHAT_NOTIFY = 'containers/Notifier/DIRECTCHAT_NOTIFY';

export const NOTIFIER_MESSAGE = 'containers/Notifier/NOTIFIER_MESSAGE';
export const BROADCAST_MESSAGE = 'containers/Notifier/BROADCAST_MESSAGE';

export const NOTE_NEEDED = {
  WS_CONNECTED,
  WS_DISCONNECTED,
  PUZZLE_ADDED,
  DIRECTCHAT_NOTIFY,
  GOTID_MINICHAT,
  NOTIFIER_MESSAGE,
  BROADCAST_MESSAGE,
};

export const NOTE_MSG = {
  wsConnectedMsg,
  wsDisconnectedMsg,
  puzzleAddedMsg,
  directMessageReceivedMsg,
  chatroomNotExistsMsg,
  notifierMsg,
  broadcastMsg,
};
