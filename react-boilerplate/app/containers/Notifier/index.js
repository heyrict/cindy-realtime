/**
 *
 * Notifier
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import NotificationSystem from 'react-notification-system';

import injectReducer from 'utils/injectReducer';
import makeSelectNotifier from './selectors';
import reducer from './reducer';

import { NOTE_NEEDED, NOTE_MSG } from './constants';

class Notifier extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { WS_CONNECT, PUZZLE_ADDED, DIRECTCHAT_RECEIVED } = NOTE_NEEDED;
    const { wsConnectMsg, puzzleAddedMsg, directMessageReceivedMsg } = NOTE_MSG;

    switch (nextProps.notification.type) {
      case WS_CONNECT:
        this.notif.addNotification(wsConnectMsg());
        break;
      case PUZZLE_ADDED:
        this.notif.addNotification(puzzleAddedMsg(nextProps.notification.data));
        break;
      case DIRECTCHAT_RECEIVED:
        this.notif.addNotification(directMessageReceivedMsg(nextProps.notification.data));
        break;
      default:
    }
  }

  render() {
    return (
      <NotificationSystem
        ref={(node) => {
          this.notif = node;
        }}
      />
    );
  }
}

Notifier.propTypes = {
  notification: PropTypes.any.isRequired,
};

const mapStateToProps = createSelector(
  makeSelectNotifier(),
  (notification) => ({
    notification,
  })
);

const withConnect = connect(mapStateToProps);

const withReducer = injectReducer({ key: 'notifier', reducer });

export default compose(withReducer, withConnect)(Notifier);
