/**
 *
 * PreviewEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { AutoResizeTextarea } from 'style-store';
import MarkdownPreview from 'components/MarkdownPreview';
import StampTooltipContent from 'components/StampTooltip/StampTooltipContent';
import Toolbar from './Toolbar';
import ColorTooltip from './ColorTooltip';
import TabsTooltip from './TabsTooltip';

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
  handleInsert(s) {
    const startPos = this.field.selectionStart || 0;
    const endPos = this.field.selectionEnd || 0;
    this.setState((prevState) => ({
      content:
        prevState.content.slice(0, startPos) +
        s +
        prevState.content.slice(endPos),
    }));
  }
  render() {
    const { safe, style, onChange, ...others } = this.props;

    return (
      <div style={{ marginBottom: '5px' }}>
        <Toolbar
          options={[
            {
              name: 'Red',
              icon: <span style={{ color: '#dc322f' }}>●</span>,
              callback: () =>
                this.handleWrapSelection(
                  `<span style="color:#dc322f">`,
                  '</span>',
                ),
            },
            {
              name: 'Green',
              icon: <span style={{ color: '#859900' }}>●</span>,
              callback: () =>
                this.handleWrapSelection(
                  `<span style="color:#859900">`,
                  '</span>',
                ),
            },
            {
              name: 'Blue',
              icon: <span style={{ color: '#268bd2' }}>●</span>,
              callback: () =>
                this.handleWrapSelection(
                  `<span style="color:#268bd2">`,
                  '</span>',
                ),
            },
            {
              name: 'Small',
              icon: (
                <div>
                  <small>A</small>
                </div>
              ),
              callback: () => this.handleWrapSelection(`<small>`, '</small>'),
            },
            {
              name: 'Big',
              icon: <div>A</div>,
              callback: () => this.handleWrapSelection(`<big>`, '</big>'),
            },
            {
              name: 'Tabs',
              tooltipEnabled: true,
              tooltipOptions: {
                html: (
                  <TabsTooltip
                    handleSubmit={(content) => this.handleInsert(content)}
                  />
                ),
                position: 'top',
                theme: 'cindy',
                trigger: 'click',
                interactive: true,
              },
            },
            {
              name: 'Stamps',
              tooltipEnabled: true,
              tooltipOptions: {
                html: (
                  <StampTooltipContent
                    puzzleStamps
                    onClick={(content) => this.handleInsert(` :${content}: `)}
                  />
                ),
                position: 'top',
                theme: 'cindy',
                trigger: 'click',
                interactive: true,
              },
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
          maxRows={25}
          {...others}
        />
        <MarkdownPreview content={this.state.content} safe={safe} />
      </div>
    );
  }
}

PreviewEdit.propTypes = {
  style: PropTypes.object.isRequired,
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
