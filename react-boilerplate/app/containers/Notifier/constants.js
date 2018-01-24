/*
 *
 * Notifier constants
 *
 */

import { WS_CONNECT } from 'containers/WebSocketInterface/constants';
import { PUZZLE_ADDED } from 'containers/PuzzleActiveList/constants';
import { DIRECTCHAT_RECEIVED } from 'containers/Chat/constants';

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

const puzzleAddedMsg = (context) => ({
  ...defaultMessageStyle,
  children: (
    <FormattedMessage {...messages.puzzleAdded} values={{ ...context }} />
  ),
});

const directMessageReceivedMsg = (context) => ({
  ...defaultMessageStyle,
  autoDismiss: 0,
  children: (
    <div>
      <FormattedMessage {...messages.directMessageReceived} values={{ nickname: context.from.nickname }} />
    </div>
  ),
});

export const NOTE_NEEDED = {
  WS_CONNECT,
  PUZZLE_ADDED,
  DIRECTCHAT_RECEIVED,
};

export const NOTE_MSG = {
  wsConnectMsg,
  puzzleAddedMsg,
  directMessageReceivedMsg,
};
