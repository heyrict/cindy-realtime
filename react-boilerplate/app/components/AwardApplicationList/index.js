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
import AwardApplicationListQuery from 'graphql/AwardApplicationList';

import LoadingDots from 'components/LoadingDots';
import chatMessages from 'containers/Chat/messages';

import AwardApplicationPanel from './AwardApplicationPanel';

const StyledButtonOutline = ButtonOutline.extend`
  border-radius: 10px;
  padding: 10px 0;
`;

function AwardApplicationList(props) {
  if (props.loading || !props.allAwardApplications) {
    return <LoadingDots py={50} size={8} />;
  }
  return (
    <div>
      {props.allAwardApplications.edges.map((edge) => (
        <AwardApplicationPanel
          node={edge.node}
          key={edge.node.id}
          currentUserId={props.currentUserId}
          canReviewAwardApplication={props.canReviewAwardApplication}
        />
      ))}
      {props.hasMore() && (
        <StyledButtonOutline onClick={props.loadMore} w={1}>
          <FormattedMessage {...chatMessages.loadMore} />
        </StyledButtonOutline>
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
  canReviewAwardApplication: PropTypes.bool,
};

const withAwardApplicationList = graphql(AwardApplicationListQuery, {
  options: ({ variables }) => ({ variables: { ...variables, count: 10 } }),
  props({ data, ownProps }) {
    const { loading, allAwardApplications, fetchMore } = data;
    return {
      loading,
      allAwardApplications,
      hasMore: () => allAwardApplications.pageInfo.hasNextPage,
      loadMore: () =>
        fetchMore({
          query: AwardApplicationListQuery,
          variables: {
            ...ownProps.variables,
            count: 10,
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
      }
    }
  `,
  {
    options: ({ currentUserId }) => ({
      variables: {
        id: currentUserId,
      },
    }),
    props({ data }) {
      if (data.loading) return {};
      const { user: { canReviewAwardApplication } } = data;
      return { canReviewAwardApplication };
    },
  }
);

export default compose(withAwardApplicationList, withCurrentUser)(
  AwardApplicationList
);
