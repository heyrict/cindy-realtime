/**
 *
 * RewardingModal
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import LoadingDots from 'components/LoadingDots';
import { withModal } from 'components/withModal';

import { QueryRenderer } from 'react-relay';
import environment from 'Environment';
import RewardingModalQuery from 'graphql/RewardingModalQuery';
import RewardingModalComponent from './RewardingModalComponent';

export function RewardingModal(props) {
  return (
    <QueryRenderer
      environment={environment}
      component={RewardingModalComponent}
      query={RewardingModalQuery}
      variables={{ id: props.id }}
      render={(raw) => {
        const error = raw.error;
        const p = raw.props;
        if (error) {
          return <div>{error.message}</div>;
        } else if (p) {
          return (
            <RewardingModalComponent
              title={props.title}
              genre={props.genre}
              yami={props.yami}
              id={props.id}
              {...p.puzzle}
            />
          );
        }
        return <LoadingDots />;
      }}
    />
  );
}

RewardingModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  genre: PropTypes.number.isRequired,
  yami: PropTypes.bool.isRequired,
};

export default withModal({})(RewardingModal);
