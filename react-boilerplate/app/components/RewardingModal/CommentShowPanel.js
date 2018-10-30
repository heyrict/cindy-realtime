import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { FormattedMessage } from 'react-intl';

import { Flex, Box } from 'rebass';
import { line2md } from 'common';
import { WarningBtn } from 'style-store';
import UserLabel from 'components/UserLabel';

import messages from './messages';

class CommentShowPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: !props.node.spoiler,
    };
    this.showComment = () => this.setState({ show: true });
  }
  render() {
    return (
      <Flex flexWrap="wrap">
        {this.state.show ? (
          <Box>
            <div
              dangerouslySetInnerHTML={{
                __html: line2md(this.props.node.content),
              }}
            />
          </Box>
        ) : (
          <WarningBtn p={2} onClick={this.showComment}>
            <FormattedMessage {...messages.spoilerWarning} />
          </WarningBtn>
        )}
        <Box w={1} mt={2} style={{ textAlign: 'right' }}>
          —— <UserLabel user={this.props.node.user} />
        </Box>
      </Flex>
    );
  }
}

CommentShowPanel.propTypes = {
  node: PropTypes.object.isRequired,
};

export default CommentShowPanel;
