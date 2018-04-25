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
import { graphql } from 'react-apollo';

import withNumberPaginator from 'components/withNumberPaginator';
import PuzzlePanel from 'components/PuzzlePanel';
import BookmarkListQuery from 'graphql/BookmarkList';
import LoadingDots from 'components/LoadingDots';
import PaginatorBar from 'components/PaginatorBar';
import BookmarkLabel from './BookmarkLabel';

const BookmarkList = (props) => (
  <div>
    {props.allBookmarks &&
      props.allBookmarks.edges.map((edge) => (
        <PuzzlePanel
          node={edge.node.puzzle}
          key={edge.node.id}
          additional={
            <BookmarkLabel
              value={edge.node.value}
              isCurrentUser={props.currentUserId === props.userId}
              bookmarkId={f(edge.node.id)[1]}
            />
          }
        />
      ))}
    {props.loading && (
      <LoadingDots size={8} py={props.allBookmarks ? 10 : 50} />
    )}
    {!props.loading && (
      <PaginatorBar
        numPages={Math.ceil(props.allBookmarks.totalCount / props.itemsPerPage)}
        currentPage={props.page}
        changePage={props.changePage}
      />
    )}
  </div>
);

BookmarkList.propTypes = {
  loading: PropTypes.bool.isRequired,
  allBookmarks: PropTypes.shape({
    edges: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
  }),
  userId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  currentUserId: PropTypes.string,
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  itemsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  changePage: PropTypes.func.isRequired,
};

const withBookmarkList = graphql(BookmarkListQuery, {
  options: ({ variables, page, itemsPerPage }) => ({
    variables: {
      limit: itemsPerPage,
      offset: itemsPerPage * (page - 1),
      ...variables,
    },
  }),
  props({ data }) {
    const { loading, allBookmarks, refetch } = data;
    return {
      loading,
      allBookmarks,
      refetch,
    };
  },
});

export default compose(withNumberPaginator(), withBookmarkList)(BookmarkList);
