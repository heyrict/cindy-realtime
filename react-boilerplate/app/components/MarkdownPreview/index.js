/**
*
* MarkdownPreview
*
*/

import React from "react";
import PropTypes from "prop-types";
import { Panel, Button } from "react-bootstrap";
import common from "common";
// import styled from 'styled-components';

import { FormattedMessage } from "react-intl";
import messages from "./messages";

class MarkdownPreview extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };

    this.togglePreview = this.togglePreview.bind(this);
  }

  render() {
    return (
      <div>
        <Button onClick={this.togglePreview} block>
          {this.state.open ? (
            <FormattedMessage {...messages.hide} />
          ) : (
            <FormattedMessage {...messages.show} />
          )}
        </Button>
        <Panel collapsible expanded={this.state.open}>
          <div
            dangerouslySetInnerHTML={{
              __html: common.text2md(this.props.content)
            }}
          />
        </Panel>
      </div>
    );
  }

  togglePreview(e) {
    this.setState((prevState, props) => ({
      open: !prevState.open
    }));
  }
}

MarkdownPreview.propTypes = {
  content: PropTypes.string
};

export default MarkdownPreview;
