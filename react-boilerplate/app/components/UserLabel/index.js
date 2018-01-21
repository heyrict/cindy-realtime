/**
 *
 * UserLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer } from 'react-relay';
import styled from 'styled-components';
import { DarkNicknameLink as NicknameLink } from 'style-store';

import UserAwardPopover from 'components/UserAwardPopover';

export function UserLabel(props) {
  const user = props.user;
  return (
    <span>
      <NicknameLink to={`/profile/show/${user.rowid}`}>{user.nickname}</NicknameLink>
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

export default createFragmentContainer(UserLabel, {
  user: graphql`
    fragment UserLabel_user on UserNode {
      rowid
      nickname
      currentAward {
        id
        created
        award {
          id
          name
          description
        }
      }
    }
  `,
});
