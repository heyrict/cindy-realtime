/**
 *
 * StarList
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
import StarListQuery from 'graphql/StarList';
import LoadingDots from 'components/LoadingDots';
import FiveStars from 'components/FiveStars';
import chatMessages from 'containers/Chat/messages';

class StarList extends React.PureComponent {
  render() {
    return (
      <div>
        {this.props.allStars &&
          this.props.allStars.edges.map((edge) => (
            <PuzzlePanel
              node={edge.node.puzzle}
              key={edge.node.id}
              additional={
                <FiveStars
                  value={edge.node.value}
                  starSize="15px"
                  justify="center"
                />
              }
            />
          ))}
        {this.props.loading && <LoadingDots size={8} py={this.props.allStars ? 10 : 50} />}
        {!this.props.loading &&
          this.props.hasMore() && (
            <ButtonOutline onClick={this.props.loadMore} w={1} py="10px">
              <FormattedMessage {...chatMessages.loadMore} />
            </ButtonOutline>
          )}
      </div>
    );
  }
}

StarList.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.func.isRequired,
  allStars: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
};

const withStarList = graphql(StarListQuery, {
  options: ({ variables }) => ({ variables: { ...variables, count: 10 } }),
  props({ data, ownProps }) {
    const { loading, allStars, fetchMore, refetch } = data;
    return {
      loading,
      allStars,
      refetch,
      hasMore: () => allStars.pageInfo.hasNextPage,
      loadMore: () =>
        fetchMore({
          query: StarListQuery,
          variables: {
            ...ownProps.variables,
            count: 10,
            cursor: allStars.pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.allStars.edges;
            const pageInfo = fetchMoreResult.allStars.pageInfo;

            return newEdges.length
              ? {
                  allStars: {
                    __typename: previousResult.allStars.__typename,
                    edges: [...previousResult.allStars.edges, ...newEdges],
                    pageInfo,
                  },
                }
              : previousResult;
          },
        }),
    };
  },
});

export default compose(withStarList)(StarList);
