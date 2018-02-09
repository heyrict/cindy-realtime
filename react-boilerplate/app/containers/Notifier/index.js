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

import { openDirectChat } from 'containers/Chat/actions';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectNotifier from './selectors';
import reducer from './reducer';
import saga from './saga';

import { NOTE_NEEDED, NOTE_MSG } from './constants';

class Notifier extends React.Component {
  componentWillReceiveProps(nextProps) {
    const {
      WS_CONNECT,
      PUZZLE_ADDED,
      DIRECTCHAT_NOTIFY,
      GOTID_MINICHAT,
      USERAWARD_ADDED,
    } = NOTE_NEEDED;
    const {
      wsConnectMsg,
      puzzleAddedMsg,
      directMessageReceivedMsg,
      chatroomNotExistsMsg,
      userawardAddedMsg,
    } = NOTE_MSG;

    switch (nextProps.notification.type) {
      case WS_CONNECT:
        this.notif.addNotification(wsConnectMsg());
        break;
      case PUZZLE_ADDED:
        this.notif.addNotification(puzzleAddedMsg(nextProps.notification.data));
        break;
      case DIRECTCHAT_NOTIFY:
        this.notif.addNotification(
          directMessageReceivedMsg({
            ...nextProps.notification.data,
            callback: () =>
              this.props.dispatch(
                openDirectChat({
                  chat: String(nextProps.notification.data.from.userId),
                })
              ),
          })
        );
        break;
      case GOTID_MINICHAT:
        this.notif.addNotification(
          chatroomNotExistsMsg(nextProps.notification)
        );
        break;
      case USERAWARD_ADDED:
        this.notif.addNotification(
          userawardAddedMsg(nextProps.notification.data)
        );
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
  dispatch: PropTypes.func.isRequired,
  notification: PropTypes.any.isRequired,
};

const mapStateToProps = createSelector(
  makeSelectNotifier(),
  (notification) => ({
    notification,
  })
);

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'notifier', reducer });

const withSaga = injectSaga({ key: 'notifier', saga });

export default compose(withSaga, withReducer, withConnect)(Notifier);
