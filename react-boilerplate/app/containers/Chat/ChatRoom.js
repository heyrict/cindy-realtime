/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */

import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { compose } from 'redux';
import { from_global_id as f, to_global_id as t } from 'common';
import { FormattedMessage } from 'react-intl';
import { Flex } from 'rebass';
import { ButtonOutline, AutoResizeTextarea } from 'style-store';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ChatQuery from 'graphql/ChatQuery';
import UserLabel from 'graphql/UserLabel';
import CreateChatmessageMutation from 'graphql/CreateChatmessageMutation';
import ChatMessageSubscription from 'graphql/ChatMessageSubscription';

import { OPTIONS_SEND } from 'containers/Settings/constants';
import LoadingDots from 'components/LoadingDots';
import ChatMessage from './ChatMessage';
import DescriptionPanel from './DescriptionPanel';
import Wrapper from './Wrapper';
import messages from './messages';

import { defaultChannel } from './constants';

const MessageWrapper = Wrapper.extend`
  overflow-y: auto;
  height: ${(props) => props.height}px;
  width: 100%;
  margin-bottom: 5px;
  border-radius: 0 0 10px 10px;
`;

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = { content: '', loading: false, taHeight: 36, dpHeight: 20 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = (e) => this.setState({ content: e.target.value });
    this.handleHeightChange = (h, inst) =>
      this.setState({ taHeight: inst._rootDOMNode.clientHeight || h });
    this.handleDPHeightChange = (h) => this.setState({ dpHeight: h });
  }

  componentDidMount() {
    this.props.subscribeChatUpdates();
  }

  handleKeyPress(e) {
    const content = this.state.content;
    switch (this.props.sendPolicy) {
      case OPTIONS_SEND.NONE:
        break;
      case OPTIONS_SEND.ON_SHIFT_RETURN:
        if (e.nativeEvent.keyCode === 13 && e.nativeEvent.shiftKey) {
          this.handleSubmit();
        }
        break;
      case OPTIONS_SEND.ON_RETURN:
        if (e.nativeEvent.keyCode === 13 && !e.nativeEvent.shiftKey) {
          if (content[content.length - 1] === '\n') {
            this.handleSubmit();
          }
        }
        break;
      default:
    }
  }

  handleSubmit() {
    if (this.state.loading) return;
    const { channel, currentUser, pathname } = this.props;
    const content = this.state.content;
    const now = new Date();
    const chatroomName = channel || defaultChannel(pathname);
    this.setState({ loading: true, content: '' });

    this.props
      .mutate({
        variables: {
          input: {
            content,
            chatroomName,
          },
        },
        update(proxy, { data: { createChatmessage: { chatmessage } } }) {
          const data = proxy.readQuery({
            query: ChatQuery,
            variables: { chatroomName },
          });
          data.allChatmessages.edges.push({
            __typename: 'ChatMessageNodeEdge',
            node: {
              content,
              editTimes: 0,
              user: currentUser,
              ...chatmessage,
            },
          });
          proxy.writeQuery({
            query: ChatQuery,
            variables: { chatroomName },
            data,
          });
        },
        optimisticResponse: {
          createChatmessage: {
            __typename: 'CreateChatMessagePayload',
            chatmessage: {
              __typename: 'ChatMessageNode',
              id: '-1',
              created: now.toISOString(),
            },
          },
        },
      })
      .then(() => {})
      .catch((error) => {
        this.setState({ content });
        bootbox.alert(error.message);
      });
    this.setState({ loading: false });
  }

  render() {
    return (
      <Flex wrap justify="center">
        <DescriptionPanel
          height={this.state.dpHeight}
          changeHeight={this.handleDPHeightChange}
          name={this.props.channel || defaultChannel(this.props.pathname)}
          currentUserId={this.props.currentUserId}
          favChannels={this.props.favChannels}
        />
        <MessageWrapper
          height={
            this.props.height - this.state.taHeight - this.state.dpHeight - 14
          }
        >
          {this.props.loading ? (
            <LoadingDots />
          ) : (
            this.props.hasPreviousPage && (
              <ButtonOutline p="5px" w={1} onClick={this.props.loadMore}>
                <FormattedMessage {...messages.loadMore} />
              </ButtonOutline>
            )
          )}
          {this.props.allChatmessages
            ? this.props.allChatmessages.edges.map((edge) => (
                <ChatMessage key={edge.node.id} {...edge.node} />
              ))
            : null}
        </MessageWrapper>
        <Flex mx={1} w={1} hidden={this.props.currentUserId === null}>
          <AutoResizeTextarea
            style={{ borderRadius: '10px 0 0 10px', minHeight: '36px' }}
            value={this.state.content}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyPress}
            onHeightChange={this.handleHeightChange}
            minRows={1}
            maxRows={5}
          />
          <ButtonOutline
            onClick={this.handleSubmit}
            p={10}
            style={{ wordBreak: 'keep-all', borderRadius: '0 10px 10px 0' }}
          >
            <FormattedMessage {...messages.send} />
          </ButtonOutline>
        </Flex>
      </Flex>
    );
  }
}

ChatRoom.propTypes = {
  mutate: PropTypes.func.isRequired,
  allChatmessages: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  loading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  subscribeChatUpdates: PropTypes.func.isRequired,
  hasPreviousPage: PropTypes.bool,
  channel: PropTypes.string,
  height: PropTypes.number.isRequired,
  currentUserId: PropTypes.number,
  currentUser: PropTypes.object,
  sendPolicy: PropTypes.string.isRequired,
  favChannels: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  // eslint-disable-next-line react/no-unused-prop-types
  pathname: PropTypes.string.isRequired,
};

const withMutation = graphql(CreateChatmessageMutation);

const withChat = graphql(ChatQuery, {
  options: ({ channel, pathname }) => {
    const chatroomName = channel || defaultChannel(pathname);
    return {
      variables: { chatroomName },
      fetchPolicy: 'cache-and-network',
    };
  },
  props({ data, ownProps }) {
    const { allChatmessages, loading, fetchMore, subscribeToMore } = data;
    const { channel, pathname } = ownProps;
    const chatroomName = channel || defaultChannel(pathname);
    return {
      allChatmessages,
      loading,
      hasPreviousPage:
        allChatmessages && allChatmessages.pageInfo.hasPreviousPage,
      loadMore: () =>
        fetchMore({
          query: ChatQuery,
          variables: {
            chatroomName,
            before: allChatmessages.pageInfo.startCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.allChatmessages.edges;
            const pageInfo = fetchMoreResult.allChatmessages.pageInfo;

            return newEdges.length
              ? {
                  allChatmessages: {
                    __typename: previousResult.allChatmessages.__typename,
                    edges: [
                      ...newEdges,
                      ...previousResult.allChatmessages.edges,
                    ],
                    pageInfo,
                  },
                }
              : previousResult;
          },
        }),
      subscribeChatUpdates: () =>
        subscribeToMore({
          document: ChatMessageSubscription,
          variables: { chatroomName },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newNode = subscriptionData.data.chatmessageSub;
            if (!newNode) return prev;

            let update = false;
            const prevEdges = prev.allChatmessages.edges.map((edge) => {
              if (edge.node.id === newNode.id) {
                update = true;
                return { ...edge, node: newNode };
              }
              const pk = (id) => parseInt(f(id)[1], 10);
              if (pk(edge.node.id) > pk(newNode.id)) {
                update = true;
              }
              return edge;
            });

            if (update) {
              return {
                ...prev,
                allChatmessages: {
                  ...prev.allChatmessages,
                  edges: prevEdges,
                },
              };
            }

            return {
              ...prev,
              allChatmessages: {
                ...prev.allChatmessages,
                edges: [
                  ...prev.allChatmessages.edges,
                  { __typename: 'ChatMessageNodeEdge', node: newNode },
                ],
              },
            };
          },
        }),
    };
  },
});

const withCurrentUser = graphql(
  gql`
    query($id: ID!) {
      user(id: $id) {
        ...UserLabel_user
      }
    }
    ${UserLabel}
  `,
  {
    options: ({ currentUserId }) => ({
      variables: {
        id: t('UserNode', currentUserId || '-1'),
      },
    }),
    props({ data }) {
      const { user: currentUser } = data;
      return { currentUser };
    },
  }
);

export default compose(withCurrentUser, withChat, withMutation)(ChatRoom);
