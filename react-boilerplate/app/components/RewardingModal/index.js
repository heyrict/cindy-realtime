/**
 *
 * RewardingModal
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import LoadingDots from 'components/LoadingDots';
import { withModal } from 'components/withModal';

import { graphql } from 'react-apollo';

import RewardingModalQuery from 'graphql/RewardingModalQuery';
import RewardingModalComponent from './RewardingModalComponent';

export function RewardingModal(props) {
  const { loading, error, puzzle, ...others } = props;
  if (error) {
    return <div>{error.message}</div>;
  } else if (loading) {
    return <LoadingDots />;
  }
  return <RewardingModalComponent {...others} {...puzzle} />;
}

RewardingModal.propTypes = {
  id: PropTypes.string.isRequired,
  puzzle: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  onHide: PropTypes.func,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
};

const withData = graphql(RewardingModalQuery, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
  props({ data }) {
    const { puzzle, loading, error } = data;
    return {
      puzzle,
      loading,
      error,
    };
  },
});

export default compose(withModal({}), withData)(RewardingModal);
