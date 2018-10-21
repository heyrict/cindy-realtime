/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-mixed-operators */

import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { connect } from 'react-redux';
import { compose } from 'redux';
import { from_global_id as f, to_global_id as t } from 'common';
import { createSelector, createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Flex } from 'rebass';
import { Button, ButtonOutline } from 'style-store';
import { nAlert } from 'containers/Notifier/actions';

import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';
import ChatQuery from 'graphql/ChatQuery';
import CreateChatmessageMutation from 'graphql/CreateChatmessageMutation';
import ChatMessageSubscription from 'graphql/ChatMessageSubscription';

import LoadingDots from 'components/LoadingDots';
import { selectSettingsDomain } from 'containers/Settings/selectors';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import DescriptionPanel from './DescriptionPanel';
import ChatLogModal from './ChatLogList';
import Wrapper from './Wrapper';
import messages from './messages';

import { defaultChannel } from './constants';

const MessageWrapper = styled(Wrapper)`
  overflow-y: auto;
  height: ${(props) => props.height}px;
  width: 100%;
  margin-bottom: 5px;
  border-radius: 0 0 10px 10px;
`;

const DescriptionBtn = styled(Button)`
  overflow-y: auto;
  height: ${(props) => props.height}px;
  border-radius: 0;
  padding: 0;
  font-size: 0.95em;
  background: rgb(160, 82, 45) /* sienna */;
  &:hover {
    background: rgb(140, 62, 25);
  }
`;

const ShowlogBtn = styled(ButtonOutline)`
  overflow-y: auto;
  height: ${(props) => props.height}px;
  border-radius: 0;
  font-size: 0.95em;
  padding: 0;
`;

const currentPuzzleQuery = gql`
  query ChatRoomPuzzleQuery($puzzleId: ID!) {
    puzzle(id: $puzzleId) {
      id
      anonymous
      status
      user {
        id
      }
    }
  }
`;

class ChatRoom extends React.Component {
  // {{{ constructor()
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      taHeight: 36,
      chatLogModalShown: false,
      show: true,
    };

    switch (props.displayChatroomDescription) {
      case 'True':
        this.state.show = true;
        break;
      case 'False':
        this.state.show = false;
        break;
      default:
        this.state.show =
          (window.innerHeight || document.documentElement.clientHeight) > 500;
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleChatLogModalShow = (show) =>
      this.setState({ chatLogModalShown: show });
    this.handleHeightChange = (h, inst) =>
      this.setState({ taHeight: inst._rootDOMNode.clientHeight || h });
    this.handleToggleShow = (chatroomName) =>
      chatroomName.match(/^puzzle-\d+$/)
        ? this.setState((p) => ({ show: p.show ? false : 0.3 }))
        : this.setState((p) => ({ show: !p.show }));
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  // }}}

  // {{{ componentDidMount()
  componentDidMount() {
    this.props.subscribeChatUpdates();
  }
  // }}}

  // {{{ componentDidUpdate()
  componentDidUpdate(prevProps) {
    // If chatroom not exist, jump to lobby
    if (
      this.props.allChatmessages === undefined &&
      this.props.loading === false
    ) {
      if (this.props.channel !== null) {
        this.props.alert(`Chatroom "${this.props.channel}" does not exist`);
      }
      this.props.tune('lobby');
    }

    // scroll to bottom upon update
    if (!prevProps.allChatmessages && this.props.allChatmessages) {
      this.scrollToBottom();
    } else if (
      this.props.allChatmessages &&
      prevProps.allChatmessages &&
      this.props.allChatmessages.edges.length !==
        prevProps.allChatmessages.edges.length
    ) {
      this.scrollToBottom();
    }
  }
  // }}}

  // {{{ scrollToBottom()
  scrollToBottom() {
    if (!this.lastcmref || !this.btmref) {
      return;
    }
    const domrect = this.lastcmref.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    if (domrect.top <= windowHeight && domrect.top > 0) {
      this.btmref.scrollIntoView({ behavior: 'smooth' });
    }
  }
  // }}}

  // {{{ handleSubmit()
  handleSubmit(content) {
    if (this.state.loading) return;
    if (!content.trim()) {
      this.input.setContent('');
      return;
    }
    const { channel, currentUser, pathname } = this.props;
    const chatroomName = channel || defaultChannel(pathname);
    this.setState({ loading: true });
    this.input.setContent('');

    this.props
      .mutate({
        variables: {
          input: {
            content,
            chatroomName,
          },
        },
        update(
          proxy,
          {
            data: {
              createChatmessage: { chatmessage },
            },
          },
        ) {
          const data = proxy.readQuery({
            query: ChatQuery,
            variables: { chatroomName },
          });
          const responseData = {
            __typename: 'ChatMessageNodeEdge',
            node: {
              content,
              editTimes: 0,
              user: currentUser,
              ...chatmessage,
            },
          };

          let update = false;
          const prevEdges = data.allChatmessages.edges.map((edge) => {
            if (edge.node.id === responseData.node.id) {
              update = true;
              return responseData;
            }
            const pk = (id) => id && parseInt(f(id)[1], 10);
            if (pk(edge.node.id) > pk(responseData.node.id)) {
              update = true;
            }
            return edge;
          });

          if (update) {
            proxy.writeQuery({
              query: ChatQuery,
              variables: { chatroomName },
              data: {
                ...data,
                allChatmessages: {
                  ...data.allChatmessages,
                  edges: prevEdges,
                },
              },
            });
          } else {
            proxy.writeQuery({
              query: ChatQuery,
              variables: { chatroomName },
              data: {
                ...data,
                allChatmessages: {
                  ...data.allChatmessages,
                  edges: [...prevEdges, responseData],
                },
              },
            });
          }
        },
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.input.setContent(content);
        this.props.alert(error.message);
        this.setState({ loading: false });
      });
  }
  // }}}

  // {{{ render()
  render() {
    let dpHeight;

    if (this.props.hidden) return null;
    const chatroomName =
      this.props.channel || defaultChannel(this.props.pathname);
    const puzzleIdMatch = chatroomName.match(/^puzzle-(\d+)$/);
    const puzzleId = puzzleIdMatch && t('PuzzleNode', puzzleIdMatch[1] || -1);

    // calculate chat height
    dpHeight = chatroomName.match(/^puzzle-\d+$/) ? 30 : 100;
    dpHeight = this.state.show ? dpHeight : 0;
    const dbHeight = 20;
    const { taHeight } = this.state;
    const bodyHeight = this.props.height - dpHeight - dbHeight - taHeight - 20;

    return (
      <Flex flexWrap="wrap" justifyContent="center">
        <DescriptionBtn
          height={dbHeight}
          w={2 / 3}
          onClick={() => this.handleToggleShow(chatroomName)}
        >
          {chatroomName}
        </DescriptionBtn>
        <ShowlogBtn
          height={dbHeight}
          w={1 / 3}
          color="sienna"
          border="0"
          onClick={() => this.toggleChatLogModalShow(true)}
        >
          <FormattedMessage {...messages.log} />
        </ShowlogBtn>
        {puzzleId ? (
          <Query query={currentPuzzleQuery} variables={{ puzzleId }}>
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) {
                return JSON.stringify(error);
              }
              const currentPuzzle = data.puzzle;
              const anonymous =
                currentPuzzle.anonymous && currentPuzzle.status === 0;
              const anonymousUserId = anonymous
                ? currentPuzzle.user.id
                : undefined;
              return (
                <ChatLogModal
                  show={this.state.chatLogModalShown}
                  anonymousUserId={anonymousUserId}
                  onHide={() => this.toggleChatLogModalShow(false)}
                  variables={{ chatroomName }}
                />
              );
            }}
          </Query>
        ) : (
          <ChatLogModal
            show={this.state.chatLogModalShown}
            onHide={() => this.toggleChatLogModalShow(false)}
            variables={{ chatroomName }}
          />
        )}
        {this.state.show && (
          <DescriptionPanel
            show={this.state.show}
            toggleShow={this.handleToggleShow}
            height={dpHeight}
            name={chatroomName}
            currentUserId={this.props.currentUser && this.props.currentUser.id}
            favChannels={this.props.favChannels}
          />
        )}
        <MessageWrapper height={bodyHeight}>
          {this.props.loading ? (
            <LoadingDots />
          ) : (
            this.props.hasPreviousPage && (
              <ButtonOutline p="5px" w={1} onClick={this.props.loadMore}>
                <FormattedMessage {...messages.loadMore} />
              </ButtonOutline>
            )
          )}
          {puzzleId ? (
            <Query query={currentPuzzleQuery} variables={{ puzzleId }}>
              {({ loading, error, data }) => {
                if (loading) return null;
                if (error) {
                  console.log(error);
                  return null;
                }
                const currentPuzzle = data.puzzle;
                return this.props.allChatmessages
                  ? this.props.allChatmessages.edges.map((edge, i) => {
                      const anonymous =
                        currentPuzzle.anonymous &&
                        currentPuzzle.status === 0 &&
                        edge.node.user.id === currentPuzzle.user.id;
                      if (i + 1 === this.props.allChatmessages.edges.length) {
                        return (
                          <div
                            ref={(lastcm) => (this.lastcmref = lastcm)}
                            key={edge.node.id}
                          >
                            <ChatMessage {...edge.node} anonymous={anonymous} />
                          </div>
                        );
                      }
                      return (
                        <ChatMessage
                          key={edge.node.id}
                          {...edge.node}
                          anonymous={anonymous}
                        />
                      );
                    })
                  : null;
              }}
            </Query>
          ) : (
            this.props.allChatmessages &&
            this.props.allChatmessages.edges.map((edge, i) => {
              if (i + 1 === this.props.allChatmessages.edges.length) {
                return (
                  <div
                    ref={(lastcm) => (this.lastcmref = lastcm)}
                    key={edge.node.id}
                  >
                    <ChatMessage {...edge.node} />
                  </div>
                );
              }
              return <ChatMessage key={edge.node.id} {...edge.node} />;
            })
          )}
          <div ref={(btm) => (this.btmref = btm)} />
        </MessageWrapper>
        <ChatInput
          ref={(ins) => (this.input = ins)}
          sendPolicy={this.props.sendPolicy}
          disabled={this.props.currentUser === null}
          onSubmit={this.handleSubmit}
          onHeightChange={this.handleHeightChange}
          loading={this.state.loading}
        />
      </Flex>
    );
  }
  // }}}
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
  currentUser: PropTypes.object,
  sendPolicy: PropTypes.string.isRequired,
  favChannels: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  // eslint-disable-next-line react/no-unused-prop-types
  pathname: PropTypes.string.isRequired,
  alert: PropTypes.func.isRequired,
  displayChatroomDescription: PropTypes.string.isRequired,
  tune: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  displayChatroomDescription: createSelector(selectSettingsDomain, (settings) =>
    settings.get('displayChatroomDescription'),
  ),
});

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

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
            const { pageInfo } = fetchMoreResult.allChatmessages;

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
                return { __typename: 'ChatMessageNodeEdge', node: newNode };
              }
              const pk = (id) => id && parseInt(f(id)[1], 10);
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

export default compose(
  withChat,
  withMutation,
  withConnect,
)(ChatRoom);
