/**
 *
 * Chat
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Toolbar, NavLink } from 'rebass';

import injectSaga from 'utils/injectSaga';
import ChatRoom from './ChatRoom';
import makeSelectChat from './selectors';
import saga from './saga';
import messages from './messages';

const StyledToolbar = styled(Toolbar)`
  background-color: sienna;
  font-weight: bold;
  color: blanchedalmond;
  border-radius: 10px;
  height: 50px;
`;

export class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
    };
    this.changeTab = (t) => this.setState({ activeTab: t });
  }
  render() {
    return (
      <div>
        <StyledToolbar>
          <NavLink onClick={() => this.changeTab(0)}>
            <FormattedMessage {...messages.chatroom} />
          </NavLink>
          <NavLink onClick={() => this.changeTab(1)}>
            <FormattedMessage {...messages.channel} />
          </NavLink>
        </StyledToolbar>
        <div>
          <div hidden={this.state.activeTab !== 0}>
            <ChatRoom chatMessages={this.props.chat.chatMessages} />
          </div>
        </div>
        <div>
          <div hidden={this.state.activeTab !== 1}>Channels</div>
        </div>
      </div>
    );
  }
}

Chat.propTypes = {
  chat: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  chat: makeSelectChat(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'chat', saga });

export default compose(withSaga, withConnect)(Chat);
