/**
 *
 * ProfileNavbar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'rebass';
import { Button } from 'style-store';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const ProfileButton = Button.extend`
  padding: 5px;
  background-color: ${(props) => props.color || 'darkgoldenrod'};
  &:hover {
    background-color: ${(props) => props.hoverColor || 'goldenrod'};
  }
`;

function ProfileNavbar(props) {
  return (
    <Flex wrap align="center" justify="center" w={1} my={1}>
      <ProfileButton w={[1 / 4, 1 / 5]} onClick={props.onProfileClick}>
        <FormattedMessage {...messages.profile} />
      </ProfileButton>
      <ProfileButton w={[1 / 4, 1 / 5]} onClick={props.onPuzzlesClick}>
        <FormattedMessage {...messages.puzzles} />
      </ProfileButton>
      <ProfileButton w={[1 / 4, 1 / 5]} onClick={props.onStarsClick}>
        <FormattedMessage {...messages.stars} />
      </ProfileButton>
      {!props.hideBookmark && (
        <ProfileButton w={[1 / 4, 1 / 5]} onClick={props.onBookmarksClick}>
          <FormattedMessage {...messages.bookmarks} />
        </ProfileButton>
      )}
    </Flex>
  );
}

ProfileNavbar.defaultProps = {
  onProfileClick: () => {},
  onPuzzlesClick: () => {},
  onStarsClick: () => {},
  onBookmarksClick: () => {},
};

ProfileNavbar.propTypes = {
  onProfileClick: PropTypes.func,
  onPuzzlesClick: PropTypes.func,
  onStarsClick: PropTypes.func,
  onBookmarksClick: PropTypes.func,
  hideBookmark: PropTypes.bool.isRequired,
};

export default ProfileNavbar;
