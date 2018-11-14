/**
 *
 * ProfileNavbar
 *
 */

import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
import { Button } from 'style-store';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const ProfileButton = styled(Button)`
  padding: 5px;
  background-color: darkgoldenrod;
  &:hover {
    background-color: goldenrod;
  }
`;

function ProfileNavbar(props) {
  return (
    <Flex alignItems="center" justifyContent="center" flexWrap="wrap" w={1} my={1}>
      <Box w={[1/3, 1/4, 1/5]} p="2px">
        <ProfileButton w={1} mx="3px" onClick={props.onProfileClick}>
          <FormattedMessage {...messages.profile} />
        </ProfileButton>
      </Box>
      <Box w={[1/3, 1/4, 1/5]} p="2px">
        <ProfileButton w={1} mx="3px" onClick={props.onPuzzlesClick}>
          <FormattedMessage {...messages.puzzles} />
        </ProfileButton>
      </Box>
      <Box w={[1/3, 1/4, 1/5]} p="2px">
        <ProfileButton w={1} mx="3px" onClick={props.onStarsClick}>
          <FormattedMessage {...messages.stars} />
        </ProfileButton>
      </Box>
      <Box w={[1/3, 1/4, 1/5]} p="2px">
        <ProfileButton w={1} mx="3px" onClick={props.onCommentsClick}>
          <FormattedMessage {...messages.comments} />
        </ProfileButton>
      </Box>
      {!props.hideBookmark && (
        <Box w={[1/3, 1/4, 1/5]}>
          <ProfileButton w={1} mx="3px" onClick={props.onBookmarksClick}>
            <FormattedMessage {...messages.bookmarks} />
          </ProfileButton>
        </Box>
      )}
    </Flex>
  );
}

ProfileNavbar.propTypes = {
  onProfileClick: PropTypes.func.isRequired,
  onPuzzlesClick: PropTypes.func.isRequired,
  onStarsClick: PropTypes.func.isRequired,
  onCommentsClick: PropTypes.func.isRequired,
  onBookmarksClick: PropTypes.func.isRequired,
  hideBookmark: PropTypes.bool.isRequired,
};

export default ProfileNavbar;
