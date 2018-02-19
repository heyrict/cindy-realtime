/**
 *
 * UserList
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

import UserPanel from 'components/UserPanel';
import UserListQuery from 'graphql/UserList';
import LoadingDots from 'components/LoadingDots';
import chatMessages from 'containers/Chat/messages';

const StyledButtonOutline = ButtonOutline.extend`
  border-radius: 10px;
  padding: 10px 0;
`;

function UserList(props) {
  if (props.loading || !props.allUsers) {
    return <LoadingDots py={50} size={8} />;
  }
  return (
    <div>
      {props.allUsers.edges.map((edge) => (
        <UserPanel node={edge.node} key={edge.node.id} />
      ))}
      {props.hasMore() && (
        <StyledButtonOutline onClick={props.loadMore} w={1}>
          <FormattedMessage {...chatMessages.loadMore} />
        </StyledButtonOutline>
      )}
    </div>
  );
}

UserList.propTypes = {
  allUsers: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
};

const withUserList = graphql(UserListQuery, {
  options: ({ variables }) => ({ variables }),
  props({ data, ownProps }) {
    const { loading, allUsers, fetchMore, refetch } = data;
    return {
      loading,
      allUsers,
      refetch,
      hasMore: () => allUsers.pageInfo.hasNextPage,
      loadMore: () =>
        fetchMore({
          query: UserListQuery,
          variables: {
            ...ownProps.variables,
            count: 10,
            cursor: allUsers.pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.allUsers.edges;
            const pageInfo = fetchMoreResult.allUsers.pageInfo;

            return newEdges.length
              ? {
                  allUsers: {
                    __typename: previousResult.allUsers.__typename,
                    edges: [...previousResult.allUsers.edges, ...newEdges],
                    pageInfo,
                  },
                }
              : previousResult;
          },
        }),
    };
  },
});

export default compose(withUserList)(UserList);
