/**
 *
 * BookmarkList
 *
 */

/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { from_global_id as f } from 'common';
import { FormattedMessage } from 'react-intl';
import { graphql } from 'react-apollo';
import { ButtonOutline } from 'style-store';

import PuzzlePanel from 'components/PuzzlePanel';
import BookmarkListQuery from 'graphql/BookmarkList';
import chatMessages from 'containers/Chat/messages';
import LoadingDots from 'components/LoadingDots';
import BookmarkLabel from './BookmarkLabel';

class BookmarkList extends React.PureComponent {
  render() {
    return (
      <div>
        {this.props.allBookmarks &&
          this.props.allBookmarks.edges.map((edge) => (
            <PuzzlePanel
              node={edge.node.puzzle}
              key={edge.node.id}
              additional={
                <BookmarkLabel
                  value={edge.node.value}
                  isCurrentUser={this.props.currentUserId === this.props.userId}
                  bookmarkId={f(edge.node.id)[1]}
                />
              }
            />
          ))}
        {this.props.loading && (
          <LoadingDots size={8} py={this.props.allBookmarks ? 10 : 50} />
        )}
        {!this.props.loading && this.props.hasMore() ? (
          <ButtonOutline onClick={this.props.loadMore} w={1} my={1}>
            <FormattedMessage {...chatMessages.loadMore} />
          </ButtonOutline>
        ) : (
          ''
        )}
      </div>
    );
  }
}

BookmarkList.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.func.isRequired,
  allBookmarks: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string,
};

const withBookmarkList = graphql(BookmarkListQuery, {
  options: ({ variables }) => ({ variables: { ...variables, count: 10 } }),
  props({ data, ownProps }) {
    const { loading, allBookmarks, fetchMore, refetch } = data;
    return {
      loading,
      allBookmarks,
      refetch,
      hasMore: () => allBookmarks.pageInfo.hasNextPage,
      loadMore: () =>
        fetchMore({
          query: BookmarkListQuery,
          variables: {
            ...ownProps.variables,
            count: 10,
            cursor: allBookmarks.pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.allBookmarks.edges;
            const pageInfo = fetchMoreResult.allBookmarks.pageInfo;

            return newEdges.length
              ? {
                  allBookmarks: {
                    __typename: previousResult.allBookmarks.__typename,
                    edges: [...previousResult.allBookmarks.edges, ...newEdges],
                    pageInfo,
                  },
                }
              : previousResult;
          },
        }),
    };
  },
});

export default compose(withBookmarkList)(BookmarkList);
