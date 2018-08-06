/**
 *
 * UserLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { pushWithLocale, from_global_id as f } from 'common';
import { ImgXs } from 'style-store';
import { Tooltip } from 'react-tippy';

import { openDirectChat } from 'containers/Chat/actions';
import UserAwardPopover from 'components/UserAwardPopover';
import chat from 'images/chat.svg';
import home from 'images/home.svg';

const Linked = styled.button`
  padding: 3px;
  color: #006388;
  &:hover {
    color: black;
  }
`;

function UserLabel(props) {
  const { user, break: needBreak, color } = props;
  const popoverDetail = (
    <div>
      <button
        style={{ padding: '3px' }}
        onClick={() => props.goto(`/profile/show/${f(user.id)[1]}`)}
      >
        <ImgXs alt="home" src={home} />
      </button>
      <button
        style={{ padding: '3px' }}
        onClick={() =>
          props.openDirectChat({
            id: user.id,
            nickname: user.nickname,
          })
        }
      >
        <ImgXs alt="direct-message" src={chat} />
      </button>
    </div>
  );
  return (
    <span>
      <Tooltip
        position={props.placement || 'top'}
        html={popoverDetail}
        trigger="focus click"
        interactive="true"
        theme="cindy"
      >
        <Linked style={{ color }}>{user.nickname}</Linked>
      </Tooltip>
      {needBreak && <br />}
      <UserAwardPopover
        userAward={user.currentAward}
        style={{ color, fontSize: '0.92em' }}
      />
    </span>
  );
}

UserLabel.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    currentAward: PropTypes.object,
  }),
  break: PropTypes.bool,
  openDirectChat: PropTypes.func.isRequired,
  goto: PropTypes.func.isRequired,
  placement: PropTypes.string,
  color: PropTypes.string,
};

UserLabel.defaultProps = {
  color: '#23527c',
};

const mapDispatchToProps = (dispatch) => ({
  openDirectChat: (chatObj) => dispatch(openDirectChat({ chat: chatObj })),
  goto: (uri) => dispatch(pushWithLocale(uri)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default withConnect(UserLabel);
