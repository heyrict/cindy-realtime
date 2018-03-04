/**
 *
 * UserLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { DarkNicknameLink as NicknameLink } from 'style-store';

import UserAwardPopover from 'components/UserAwardPopover';

export function UserLabel(props) {
  const user = props.user;
  return (
    <span>
      <NicknameLink to={`/profile/show/${user.rowid}`}>
        {user.nickname}
      </NicknameLink>
      {props.break && <br />}
      <UserAwardPopover userAward={user.currentAward} />
    </span>
  );
}

UserLabel.propTypes = {
  user: PropTypes.shape({
    rowid: PropTypes.number.isRequired,
    nickname: PropTypes.string.isRequired,
    currentAward: PropTypes.object,
  }),
  break: PropTypes.bool,
};

export default UserLabel;
