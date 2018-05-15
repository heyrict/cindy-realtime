/**
 *
 * AwardApplicationList
 *
 */

/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { ButtonOutline } from 'style-store';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import UserLabelFragment from 'graphql/UserLabel';
import AwardApplicationListQuery from 'graphql/AwardApplicationList';

import LoadingDots from 'components/LoadingDots';
import chatMessages from 'containers/Chat/messages';

import AwardApplicationPanel from './AwardApplicationPanel';

export function AwardApplicationList(props) {
  return (
    <div>
      {props.allAwardApplications &&
        props.allAwardApplications.edges.map((edge) => (
          <AwardApplicationPanel
            node={edge.node}
            key={edge.node.id}
            currentUser={props.currentUser}
          />
        ))}
      {props.loading && <LoadingDots py={50} size={8} />}
      {!props.loading &&
        props.hasMore() &&
        props.allowPagination && (
          <ButtonOutline onClick={props.loadMore} w={1} py="10px" mb={2}>
            <FormattedMessage {...chatMessages.loadMore} />
          </ButtonOutline>
        )}
    </div>
  );
}

AwardApplicationList.propTypes = {
  allAwardApplications: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  currentUserId: PropTypes.string,
  currentUser: PropTypes.object,
  allowPagination: PropTypes.bool.isRequired,
};

AwardApplicationList.defaultProps = {
  allowPagination: true,
};

const withAwardApplicationList = graphql(AwardApplicationListQuery, {
  options: ({ variables }) => ({ variables: { count: 10, ...variables } }),
  props({ data, ownProps }) {
    const { loading, allAwardApplications, fetchMore } = data;
    return {
      loading,
      allAwardApplications,
      hasMore: () =>
        allAwardApplications && allAwardApplications.pageInfo.hasNextPage,
      loadMore: () =>
        fetchMore({
          query: AwardApplicationListQuery,
          variables: {
            count: 10,
            ...ownProps.variables,
            cursor: allAwardApplications.pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.allAwardApplications.edges;
            const pageInfo = fetchMoreResult.allAwardApplications.pageInfo;

            return newEdges.length
              ? {
                  allAwardApplications: {
                    __typename: previousResult.allAwardApplications.__typename,
                    edges: [
                      ...previousResult.allAwardApplications.edges,
                      ...newEdges,
                    ],
                    pageInfo,
                  },
                }
              : previousResult;
          },
        }),
    };
  },
});

const withCurrentUser = graphql(
  gql`
    query awardApplicationPermQuery($id: ID!) {
      user(id: $id) {
        id
        canReviewAwardApplication
        ...UserLabel_user
      }
    }
    ${UserLabelFragment}
  `,
  {
    options: ({ currentUserId }) => ({
      variables: {
        id: currentUserId,
      },
      fetchPolicy: 'cache-first',
    }),
    props({ data }) {
      if (data.loading) return {};
      const { user } = data;
      return { currentUser: user };
    },
  }
);

export default compose(withAwardApplicationList, withCurrentUser)(
  AwardApplicationList
);
