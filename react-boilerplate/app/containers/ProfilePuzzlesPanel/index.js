/**
 *
 * ProfilePuzzlesPanel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import environment from 'Environment';

import { QueryRenderer } from 'react-relay';
import LoadingDots from 'components/LoadingDots';
import PuzzleList from 'containers/PuzzleList';
import PuzzleListInitQuery from 'graphql/PuzzleListInitQuery';

function ProfilePuzzlesPanel(props) {
  return (
    <QueryRenderer
      environment={environment}
      component={PuzzleList}
      query={PuzzleListInitQuery}
      variables={{
        orderBy: ['-created'],
        count: 10,
        user: props.userId,
      }}
      render={(raw) => {
        const error = raw.error;
        const p = raw.props;
        if (error) {
          return <div>{error.message}</div>;
        } else if (p) {
          return <PuzzleList list={p} />;
        }
        return <LoadingDots />;
      }}
    />
  );
}

ProfilePuzzlesPanel.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ProfilePuzzlesPanel;
