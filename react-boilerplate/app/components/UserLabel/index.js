/**
 *
 * UserLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import { DarkNicknameLink as NicknameLink } from 'style-store';

import UserAwardPopover from 'components/UserAwardPopover';
import UserLabelUserFragment from 'graphql/UserLabel';

export function UserLabel(props) {
  const user = props.user;
  return (
    <span>
      <NicknameLink to={`/profile/show/${user.rowid}`}>
        {user.nickname}
      </NicknameLink>
      <br />
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
};

export default Relay.createFragmentContainer(UserLabel, UserLabelUserFragment);
