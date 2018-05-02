/**
 *
 * UserLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withLocale, from_global_id as f } from 'common';
import { DarkNicknameLink as NicknameLink, ImgXs } from 'style-store';

import { openDirectChat } from 'containers/Chat/actions';
import UserAwardPopover from 'components/UserAwardPopover';
import chat from 'images/chat.svg';

const Linked = styled.button`
  color: #006388;
  &:hover {
    color: black;
  }
`;

class UserLabel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detail: false,
    };
    this.handleClick = () => {
      window.clearInterval(this.countdownHdl);
      this.setState(({ detail }) => ({ detail: !detail }));
      this.countdownHdl = window.setTimeout(
        () => this.setState({ detail: false }),
        10000
      );
    };
  }
  render() {
    const { user, break: needBreak } = this.props;
    return (
      <span>
        {!this.state.detail && (
          <Linked onClick={this.handleClick}>{user.nickname}</Linked>
        )}
        {this.state.detail && (
          <NicknameLink to={withLocale(`/profile/show/${f(user.id)[1]}`)}>
            {user.nickname}
          </NicknameLink>
        )}
        {this.state.detail && (
          <Linked
            onClick={() =>
              this.props.openDirectChat(`${user.id}:${user.nickname}`)
            }
          >
            <ImgXs alt="DM" src={chat} />
          </Linked>
        )}
        {needBreak && <br />}
        <UserAwardPopover
          userAward={user.currentAward}
          style={{ color: '#23527c', fontSize: '0.92em' }}
        />
      </span>
    );
  }
}

UserLabel.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    currentAward: PropTypes.object,
  }),
  break: PropTypes.bool,
  openDirectChat: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  openDirectChat: (id) => dispatch(openDirectChat({ chat: id })),
});

const withConnect = connect(null, mapDispatchToProps);

export default withConnect(UserLabel);
