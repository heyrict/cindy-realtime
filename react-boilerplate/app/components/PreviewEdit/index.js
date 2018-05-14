/**
 *
 * PreviewEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { AutoResizeTextarea } from 'style-store';
import MarkdownPreview from 'components/MarkdownPreview';
import Toolbar from './Toolbar';

class PreviewEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSetHeader = this.handleSetHeader.bind(this);
    this.getContent = () => this.state.content;
    this.setContent = (c) => this.setState({ content: c });
  }
  handleChange(e) {
    this.setState({ content: e.target.value });
    if (this.props.onChange) this.props.onChange(e);
  }
  handleSetHeader(level) {
    const setHeader = (s) => s.replace(/^#* */, `${'#'.repeat(level)} `);
    const caretPos = this.field.selectionStart || 0;
    const lastNextlinePos =
      this.field.value.slice(0, caretPos).lastIndexOf('\n') + 1;
    this.setState((prevState) => ({
      content:
        prevState.content.slice(0, lastNextlinePos) +
        setHeader(prevState.content.slice(lastNextlinePos)),
    }));
  }
  handleWrapSelection(s, e = s) {
    const startPos = this.field.selectionStart || 0;
    const endPos = this.field.selectionEnd || 0;
    if (startPos !== endPos) {
      this.setState((prevState) => ({
        content:
          prevState.content.slice(0, startPos) +
          s +
          prevState.content.slice(startPos, endPos) +
          e +
          prevState.content.slice(endPos),
      }));
    }
  }
  render() {
    const { safe, style, onChange, ...others } = this.props;
    return (
      <div>
        <Toolbar
          options={[
            {
              name: 'H1',
              callback: () => this.handleSetHeader(1),
            },
            {
              name: 'H2',
              callback: () => this.handleSetHeader(2),
            },
            {
              name: 'H3',
              callback: () => this.handleSetHeader(3),
            },
            {
              name: 'Bold',
              callback: () => this.handleWrapSelection('**'),
            },
            {
              name: 'Italic',
              callback: () => this.handleWrapSelection('*'),
            },
          ]}
        />
        <AutoResizeTextarea
          inputRef={(ref) => (this.field = ref)}
          value={this.state.content}
          onChange={this.handleChange}
          style={{
            ...style,
            minHeight: '100px',
            borderRadius: '0',
          }}
          minRows={3}
          maxRows={7}
          {...others}
        />
        <MarkdownPreview content={this.state.content} safe={safe} />
      </div>
    );
  }
}

PreviewEdit.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  content: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  safe: PropTypes.bool,
};

PreviewEdit.defaultProps = {
  style: {},
  safe: true,
  content: '',
};

export default PreviewEdit;
