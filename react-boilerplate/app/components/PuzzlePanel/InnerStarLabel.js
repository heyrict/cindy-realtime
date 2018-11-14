/**
 *
 * InnerStarLabel
 *
 */

/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import LoadingDots from 'components/LoadingDots';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import UserLabel from 'graphql/UserLabel';

function InnerStarLabel(props) {
  const { starSet } = props;
  if (!starSet) {
    return <LoadingDots />;
  }

  const starDict = [[], [], [], [], []];
  starSet.edges.forEach((edge) => {
    if (edge.node.value - 1 in starDict) {
      starDict[edge.node.value - 1] = starDict[edge.node.value - 1].concat(
        edge.node.user.nickname,
      );
    }
  });
  return (
    <div>
      {props.loading && <LoadingDots />}
      {starDict.map(
        (list, index) =>
          list.length > 0 && (
            <div key={`${props.puzzleId}-${index}`}>
              {index + 1}★: {list.join(', ')}
            </div>
          ),
      )}
    </div>
  );
}

InnerStarLabel.propTypes = {
  starSet: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  puzzleId: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default graphql(
  gql`
    query PuzzleStars($puzzleId: ID!) {
      allStars(puzzle: $puzzleId) {
        edges {
          node {
            id
            value
            user {
              ...UserLabel_user
            }
          }
        }
      }
    }
    ${UserLabel}
  `,
  {
    options: (props) => ({
      variables: {
        puzzleId: props.puzzleId,
      },
      fetchPolicy: 'cache-and-network',
    }),
    props({ data }) {
      const { allStars, loading, error } = data;
      return {
        starSet: allStars,
        loading,
        error,
      };
    },
  },
)(InnerStarLabel);
