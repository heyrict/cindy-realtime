import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ChatMessage from './ChatMessage';
import { loadMore } from './actions';

class ChatRoom extends React.Component {
  render() {
    return (
      <div>
        <div>
          <button onClick={() => this.props.dispatch(loadMore())}>
            Load More
          </button>
          {this.props.chatMessages.map((msg) => (
            <ChatMessage
              user={msg.node.user}
              key={msg.node.id}
              content={msg.node.content}
            />
          ))}
        </div>
        <div>Input</div>
      </div>
    );
  }
}

ChatRoom.propTypes = {
  dispatch: PropTypes.func.isRequired,
  chatMessages: PropTypes.array.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(ChatRoom);
