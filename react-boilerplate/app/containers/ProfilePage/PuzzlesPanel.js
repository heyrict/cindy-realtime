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
        count: 10,
        user: props.userId,
      }}
      order={[
        {
          key: 'modified',
          asc: false,
        },
      ]}
      orderList={['modified', 'starCount', 'starSum', 'commentCount']}
    />
  );
}

ProfilePuzzlesPanel.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ProfilePuzzlesPanel;
