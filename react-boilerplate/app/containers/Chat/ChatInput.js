import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Flex } from 'rebass';
import { ButtonOutline, AutoResizeTextarea } from 'style-store';

import { OPTIONS_SEND } from 'containers/Settings/constants';

import messages from './messages';

class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = (e) => this.setState({ content: e.target.value });
    this.setContent = (content) => this.setState({ content });
  }

  handleKeyPress(e) {
    const content = this.state.content;
    switch (this.props.sendPolicy) {
      case OPTIONS_SEND.NONE:
        break;
      case OPTIONS_SEND.ON_SHIFT_RETURN:
        if (e.nativeEvent.keyCode === 13 && e.nativeEvent.shiftKey) {
          this.props.onSubmit(content.trimRight());
        }
        break;
      case OPTIONS_SEND.ON_RETURN:
        if (e.nativeEvent.keyCode === 13 && !e.nativeEvent.shiftKey) {
          if (content[content.length - 1] === '\n') {
            this.props.onSubmit(content.trimRight());
          }
        }
        break;
      default:
    }
  }

  render() {
    return (
      <Flex mx={1} w={1}>
        <AutoResizeTextarea
          style={{ borderRadius: '10px 0 0 10px', minHeight: '36px' }}
          value={this.state.content}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyPress}
          onHeightChange={this.props.onHeightChange}
          disabled={this.props.disabled || this.props.loading}
          placeholder={this.props.placeholder}
          minRows={1}
          maxRows={5}
        />
        <ButtonOutline
          onClick={() => this.props.onSubmit(this.state.content)}
          p={1}
          disabled={this.props.disabled || this.props.loading}
          borderRadius="0 10px 10px 0"
          style={{
            wordBreak: 'keep-all',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          {this.props.loading ? (
            <FormattedMessage {...messages.sending} />
          ) : (
            <FormattedMessage {...messages.send} />
          )}
        </ButtonOutline>
      </Flex>
    );
  }
}

ChatInput.propTypes = {
  sendPolicy: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onHeightChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  placeholder: PropTypes.any,
};

ChatInput.defaultProps = {
  loading: false,
};

export default ChatInput;
