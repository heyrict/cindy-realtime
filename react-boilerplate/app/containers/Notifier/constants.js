/*
 *
 * Notifier constants
 *
 */

import { WS_CONNECT } from 'containers/WebSocketInterface/constants';
import { PUZZLE_ADDED } from 'containers/PuzzleActiveList/constants';

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

export const NOTE_NEEDED = {
  WS_CONNECT,
  PUZZLE_ADDED,
};

export const NOTE_MSG = {
  wsConnectMsg,
  puzzleAddedMsg,
};
