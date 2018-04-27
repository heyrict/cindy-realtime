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
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const panelProps = {
  initialPose: 'display',
  display: {
    maxHeight: '400px',
    borderWidth: '1px',
  },
  collapsed: {
    maxHeight: 0,
    borderWidth: 0,
  },
};

const Panel = styled(posed.div(panelProps))`
  border-radius: 0 0 5px 5px;
  border-color: #2075c7;
  border-style: solid;
  padding: 5px 5px;
  overflow-y: ${({ pose }) => (pose === 'display' ? 'auto' : 'hidden')};
  overflow-x: auto;
`;

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
        <Button
          onClick={this.togglePreview}
          w={1}
          py={1}
          tabIndex="-1"
          style={{
            borderRadius: this.state.open ? '0' : '0 0 5px 5px',
            boxShadow: "inset 0 0 0 0",
            border: '1px solid #2075c7',
          }}
        >
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
