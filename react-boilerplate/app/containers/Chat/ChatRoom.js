/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { commitMutation } from 'react-relay';
import environment from 'Environment';
import { FormattedMessage } from 'react-intl';
import { Flex } from 'rebass';
import { ButtonOutline } from 'style-store';
import { CreateChatmessageMutation } from 'graphql/CreateChatmessageMutation';
import ChatMessage from './ChatMessage';
import DescriptionPanel from './DescriptionPanel';
import MessageInput from './MessageInput';
import Wrapper from './Wrapper';
import { loadMore } from './actions';
import messages from './messages';

import { ADD_CHATMESSAGE } from './constants';

const LoadMoreBtn = ButtonOutline.extend`
  border-radius: 10px;
  padding: 5px;
  width: 100%;
`;

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
    this.handleChange = (e) => this.setState({ content: e.target.value });
    this.handleHeightChange = (h, inst) =>
      this.setState({ taHeight: inst._rootDOMNode.clientHeight || h });
    this.handleDPHeightChange = (h) => this.setState({ dpHeight: h });
  }

  handleSubmit() {
    if (this.state.loading) return;
    this.setState({ loading: true });
    commitMutation(environment, {
      mutation: CreateChatmessageMutation,
      variables: {
        input: {
          content: this.state.content,
          chatroom: this.props.channelInfo[this.props.channel].id,
        },
      },
      onCompleted: (response, errors) => {
        this.setState({ loading: false });
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
        }
        this.props.dispatch({
          type: ADD_CHATMESSAGE,
          data: { data: response.createChatmessage },
        });
        this.setState({ content: '' });
      },
    });
  }

  render() {
    return (
      <Flex wrap justify="center">
        <DescriptionPanel
          height={this.state.dpHeight}
          changeHeight={this.handleDPHeightChange}
          name={this.props.channel}
          channel={this.props.channelInfo[this.props.channel]}
          currentUserId={this.props.currentUserId}
          favChannels={this.props.favChannels}
        />
        <MessageWrapper
          height={
            this.props.height - this.state.taHeight - this.state.dpHeight - 14
          }
        >
          <LoadMoreBtn
            onClick={() => this.props.dispatch(loadMore())}
            hidden={!this.props.hasPreviousPage}
          >
            <FormattedMessage {...messages.loadMore} />
          </LoadMoreBtn>
          {this.props.chatMessages.map((msg) => (
            <ChatMessage key={msg.node.id} {...msg.node} />
          ))}
        </MessageWrapper>
        <Flex mx={1} w={1} hidden={this.props.currentUserId === null}>
          <MessageInput
            value={this.state.content}
            onChange={this.handleChange}
            onHeightChange={this.handleHeightChange}
            minRows={1}
            maxRows={5}
          />
          <ButtonOutline
            onClick={this.handleSubmit}
            p={10}
            style={{ wordBreak: 'keep-all' }}
          >
            <FormattedMessage {...messages.send} />
          </ButtonOutline>
        </Flex>
      </Flex>
    );
  }
}

ChatRoom.propTypes = {
  dispatch: PropTypes.func.isRequired,
  chatMessages: PropTypes.array.isRequired,
  hasPreviousPage: PropTypes.bool,
  channel: PropTypes.string,
  channelInfo: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  currentUserId: PropTypes.number,
  favChannels: PropTypes.array.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(ChatRoom);
