import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { commitMutation } from 'react-relay';
import environment from 'Environment';
import { FormattedMessage } from 'react-intl';
import { Flex } from 'rebass';
import { Input, ButtonOutline } from 'style-store';
import { CreateMinichatMutation } from 'graphql/CreateMinichatMutation';
import ChatMessage from './ChatMessage';
import Wrapper from './Wrapper';
import { loadMore } from './actions';
import messages from './messages';

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

    this.state = { content: '' };
    this.handleChange = (e) => this.setState({ content: e.target.value });
    this.handleKeyDown = (e) => {
      if (e.key === 'Enter') this.handleSubmit();
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    commitMutation(environment, {
      mutation: CreateMinichatMutation,
      variables: {
        input: {
          content: this.state.content,
          channel: this.props.channel,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
        }
        this.setState({ content: '' });
      },
    });
  }

  render() {
    return (
      <Flex wrap justify="center">
        <MessageWrapper height={this.props.height - 50}>
          <LoadMoreBtn
            onClick={() => this.props.dispatch(loadMore())}
            hidden={!this.props.hasPreviousPage}
          >
            <FormattedMessage {...messages.loadMore} />
          </LoadMoreBtn>
          {this.props.chatMessages.map((msg) => (
            <ChatMessage
              user={msg.node.user}
              key={msg.node.id}
              content={msg.node.content}
            />
          ))}
        </MessageWrapper>
        <Flex mx={1} w={1} hidden={this.props.currentUserId === null}>
          <Input
            value={this.state.content}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
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
  height: PropTypes.number.isRequired,
  currentUserId: PropTypes.number,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(ChatRoom);
