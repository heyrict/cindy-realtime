/**
 *
 * ProfilePuzzlesPanel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import PuzzleFilterableList from 'containers/PuzzleFilterableList';

function ProfilePuzzlesPanel(props) {
  return (
    <PuzzleFilterableList
      variables={{
        orderBy: ['-created'],
        count: 10,
        user: props.userId,
      }}
    />
  );
}

ProfilePuzzlesPanel.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ProfilePuzzlesPanel;
