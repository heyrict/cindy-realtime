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
import Users from './Users';

class Direct extends React.Component {
  componentWillMount() {
    if (this.props.currentUser) {
      this.props.subscribeToDirectmessages();
    }
  }
  render() {
    if (!this.props.currentUser || !this.props.display) return null;
    return this.props.chat.activeDirectChat ? (
      <DirectChat {...this.props} />
    ) : (
      <Users {...this.props} />
    );
  }
}

Direct.propTypes = {
  chat: PropTypes.shape({
    activeDirectChat: PropTypes.string,
  }),
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
    variables: { userId: currentUser.id, limit: 250 },
    fetchPolicy: 'cache-and-network',
  }),
  props({ data, ownProps }) {
    const { allDirectmessages, loading, subscribeToMore } = data;
    const { currentUser, notify } = ownProps;
    return {
      allDirectmessages,
      loading,
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
