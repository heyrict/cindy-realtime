/**
 *
 * CommentDescribeList
 *
 */

/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import LoadingDots from 'components/LoadingDots';

import CommentPanel from 'components/CommentList/CommentPanel';
import { withCommentList } from 'components/CommentList/constants';

export function RecentCommentList(props) {
  if (props.loading || !props.allComments) {
    return <LoadingDots py={50} size={8} />;
  }
  return (
    <div>
      {props.allComments.edges.map((edge) => (
        <CommentPanel
          node={edge.node}
          key={edge.node.id}
          hintMessageId="commentHint"
        />
      ))}
    </div>
  );
}

RecentCommentList.propTypes = {
  loading: PropTypes.bool.isRequired,
  allComments: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  // eslint-disable-next-line react/no-unused-prop-types
  itemsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

RecentCommentList.defaultProps = {
  itemsPerPage: 10,
};

export default compose(withCommentList)(RecentCommentList);
