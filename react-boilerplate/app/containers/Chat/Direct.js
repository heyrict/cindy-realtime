/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { to_global_id as t } from 'common';

import { graphql } from 'react-apollo';
import DirectmessageQuery from 'graphql/DirectmessageQuery';
import DirectmessageSubscription from 'graphql/DirectmessageSubscription';

import { directchatReceived } from './actions';
import DirectChat from './DirectChat';

class Direct extends React.Component {
  componentWillMount() {
    if (this.props.currentUser) {
      this.props.subscribeToDirectmessages();
    }
  }
  render() {
    if (!this.props.currentUser || !this.props.display) return null;
    return <DirectChat {...this.props} />;
  }
}

Direct.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  currentUser: PropTypes.object.isRequired,
  subscribeToDirectmessages: PropTypes.func.isRequired,
  display: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  notify: (payload) => dispatch(directchatReceived(payload)),
});

const withConnect = connect(null, mapDispatchToProps);

const withDirectMessages = graphql(DirectmessageQuery, {
  options: ({ currentUser }) => ({
    variables: { userId: currentUser.id, last: 10 },
    fetchPolicy: 'cache-and-network',
  }),
  props({ data, ownProps }) {
    const { allDirectmessages, loading, fetchMore, subscribeToMore } = data;
    const { currentUser, notify } = ownProps;
    return {
      allDirectmessages,
      loading,
      hasPreviousPage:
        allDirectmessages && allDirectmessages.pageInfo.hasPreviousPage,
      loadMore: () =>
        fetchMore({
          query: DirectmessageQuery,
          variables: {
            userId: currentUser.id,
            last: 10,
            before: allDirectmessages.pageInfo.startCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.allDirectmessages.edges;
            const pageInfo = fetchMoreResult.allDirectmessages.pageInfo;

            return newEdges.length
              ? {
                  allDirectmessages: {
                    __typename: previousResult.allDirectmessages.__typename,
                    edges: [
                      ...newEdges,
                      ...previousResult.allDirectmessages.edges,
                    ],
                    pageInfo,
                  },
                }
              : previousResult;
          },
        }),
      subscribeToDirectmessages: () =>
        subscribeToMore({
          document: DirectmessageSubscription,
          variables: {
            userId: currentUser ? currentUser.id : t('UserNode', '-1'),
          },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const node = subscriptionData.data.directmessageSub;
            if (!node) return prev;

            notify({
              sender: {
                id: node.sender.id,
                nickname: node.sender.nickname,
              },
            });
            return {
              ...prev,
              allDirectmessages: {
                ...prev.allDirectmessages,
                edges: [
                  ...prev.allDirectmessages.edges,
                  { __typename: 'DirectMessageNodeEdge', node },
                ],
              },
            };
          },
        }),
    };
  },
});

export default compose(withConnect, withDirectMessages)(Direct);
