/**
 *
 * PuzzleList
 *
 */

/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { ButtonOutline } from 'style-store';

import PuzzlePanel from 'components/PuzzlePanel';
import PuzzleListQuery from 'graphql/PuzzleList';
import LoadingDots from 'components/LoadingDots';
import chatMessages from 'containers/Chat/messages';

const StyledButtonOutline = ButtonOutline.extend`
  border-radius: 10px;
  padding: 10px 0;
`;

function PuzzleList(props) {
  if (props.loading || !props.allPuzzles) {
    return <LoadingDots py={50} size={8} />;
  }
  return (
    <div>
      {props.allPuzzles.edges.map((edge) => (
        <PuzzlePanel node={edge.node} key={edge.node.id} />
      ))}
      {props.hasMore() && (
        <StyledButtonOutline onClick={props.loadMore} w={1}>
          <FormattedMessage {...chatMessages.loadMore} />
        </StyledButtonOutline>
      )}
    </div>
  );
}

PuzzleList.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.func.isRequired,
  allPuzzles: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
};

const withPuzzleList = graphql(PuzzleListQuery, {
  options: ({ variables }) => ({ variables }),
  props({ data, ownProps }) {
    const { loading, allPuzzles, fetchMore, refetch } = data;
    return {
      loading,
      allPuzzles,
      refetch,
      hasMore: () => allPuzzles.pageInfo.hasNextPage,
      loadMore: () =>
        fetchMore({
          query: PuzzleListQuery,
          variables: {
            ...ownProps.variables,
            count: 10,
            cursor: allPuzzles.pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.allPuzzles.edges;
            const pageInfo = fetchMoreResult.allPuzzles.pageInfo;

            return newEdges.length
              ? {
                  allPuzzles: {
                    __typename: previousResult.allPuzzles.__typename,
                    edges: [...previousResult.allPuzzles.edges, ...newEdges],
                    pageInfo,
                  },
                }
              : previousResult;
          },
        }),
    };
  },
});

export default compose(withPuzzleList)(PuzzleList);
