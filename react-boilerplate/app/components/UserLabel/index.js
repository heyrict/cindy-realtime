/**
 *
 * UserLabel
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { graphql, createFragmentContainer } from 'react-relay';
import styled from 'styled-components';

import UserAwardPopover from 'components/UserAwardPopover';

const StyledNicknameLink = styled(Link)`
  font-size: 1.2em;
  color: orange;
  word-break: break-all;
  word-wrap: break-word;
`;

export function UserLabel(props) {
  const user = props.user;
  return (
    <span>
      <StyledNicknameLink to={`/profile/${user.rowid}`}>
        {user.nickname}
      </StyledNicknameLink>
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
