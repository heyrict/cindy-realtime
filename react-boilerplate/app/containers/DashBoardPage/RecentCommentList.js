/**
 *
 * CommentDescribeList
 *
 */

/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import UserLabel from 'graphql/UserLabel';

import { Box } from 'rebass';
import Constrained from 'components/Constrained';
import LoadingDots from 'components/LoadingDots';

import RecentCommentPanel from './RecentCommentPanel';
import messages from './messages';

export function RecentCommentList(props) {
  if (props.loading || !props.allComments) {
    return <LoadingDots py={50} size={8} />;
  }
  return (
    <div>
      {props.allComments.edges.map((edge) => (
        <RecentCommentPanel node={edge.node} key={edge.node.id} />
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
  page: 1,
  itemsPerPage: 10,
  changePage: () => {},
};

const withCommentList = graphql(
  gql`
    query RecentCommentListQuery($orderBy: [String], $first: Int) {
      allComments(orderBy: $orderBy, first: $first) {
        edges {
          node {
            id
            user {
              ...UserLabel_user
            }
            puzzle {
              id
              title
              user {
                ...UserLabel_user
              }
            }
            content
            spoiler
          }
        }
      }
    }
    ${UserLabel}
  `,
  {
    options: ({ variables, fetchPolicy, itemsPerPage }) => ({
      variables: {
        first: itemsPerPage,
        ...variables,
      },
      fetchPolicy,
    }),
    props({ data }) {
      const { loading, allComments } = data;
      return {
        loading,
        allComments,
      };
    },
  },
);

export default compose(withCommentList)(RecentCommentList);
