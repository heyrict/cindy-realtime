/**
 *
 * CommentList
 *
 */

/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import withNumberPaginator from 'components/withNumberPaginator';
import LoadingDots from 'components/LoadingDots';
import PaginatorBar from 'components/PaginatorBar';

import { withCommentList } from './constants';
import CommentPanel from './CommentPanel';

export function CommentList(props) {
  if (props.loading || !props.allComments) {
    return <LoadingDots py={50} size={8} />;
  }
  return (
    <div>
      {props.allComments.edges.map((edge) => (
        <CommentPanel
          node={edge.node}
          key={edge.node.id}
          hintMessageId={props.hintMessageId}
        />
      ))}
      {props.loading && <LoadingDots size={8} py={50} />}
      {!props.loading && (
        <PaginatorBar
          numPages={Math.ceil(
            props.allComments.totalCount / props.itemsPerPage,
          )}
          currentPage={props.page}
          changePage={props.changePage}
          useQuery={false}
        />
      )}
    </div>
  );
}

CommentList.propTypes = {
  loading: PropTypes.bool.isRequired,
  allComments: PropTypes.shape({
    edges: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
  }),
  hintMessageId: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  itemsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  changePage: PropTypes.func.isRequired,
};

CommentList.defaultProps = {
  itemsPerPage: 10,
};

export default compose(
  withNumberPaginator({
    useQuery: false,
  }),
  withCommentList,
)(CommentList);
