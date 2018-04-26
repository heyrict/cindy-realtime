/**
 *
 * MarkdownPreview
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ButtonOutline as Button } from 'style-store';
import { text2md } from 'common';
import posed from 'react-pose';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const panelProps = {
  display: {
    scaleY: 1,
    transition: (props) =>
      tween({
        ...props,
        duration: 1000,
        ease: easing.linear,
      }),
  },
  collapsed: {
    scaleY: 0,
  },
};

const Panel = posed.div(panelProps);

class MarkdownPreview extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };

    this.togglePreview = this.togglePreview.bind(this);
  }

  togglePreview() {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  }

  render() {
    return (
      <div>
        <Button onClick={this.togglePreview} w={1} tabIndex="-1">
          {this.state.open ? (
            <FormattedMessage {...messages.hide} />
          ) : (
            <FormattedMessage {...messages.show} />
          )}
        </Button>
        <Panel pose={this.state.open ? 'display' : 'collapsed'}>
          <div
            dangerouslySetInnerHTML={{
              __html: text2md(this.props.content),
            }}
            style={{ overflow: 'auto' }}
          />
        </Panel>
      </div>
    );
  }
}

MarkdownPreview.propTypes = {
  content: PropTypes.string,
};

export default MarkdownPreview;
