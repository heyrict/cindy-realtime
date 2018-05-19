/**
 *
 * UnhandledTextarea
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { AutoResizeTextarea } from 'style-store';

import { OPTIONS_SEND } from 'containers/Settings/constants';

class UnhandledTextarea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.content || '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = (e) => this.setState({ content: e.target.value });
    this.setContent = (content) => this.setState({ content });
    this.getContent = () => this.state.content;
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
    const {
      component: Component,
      sendPolicy,
      onSubmit,
      style,
      ...others
    } = this.props;
    return (
      <Component
        style={{ borderRadius: '10px 0 0 10px', minHeight: '36px', ...style }}
        value={this.state.content}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyPress}
        {...others}
      />
    );
  }
}

UnhandledTextarea.propTypes = {
  component: PropTypes.any.isRequired,
  content: PropTypes.string,
  sendPolicy: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  style: PropTypes.object,
};

UnhandledTextarea.defaultProps = {
  component: AutoResizeTextarea,
  sendPolicy: OPTIONS_SEND.NONE,
  onSubmit: () => {},
};

export default UnhandledTextarea;
