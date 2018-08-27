/**
 *
 * ChatRoomPanel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Flex, Box, ButtonTransparent } from 'rebass';
import { line2md } from 'common';
import { ButtonOutline } from 'style-store';
// import styled from 'styled-components';

import UserLabel from 'components/UserLabel';

import messages from './messages';

const Border = ButtonOutline.extend`
  border-radius: ${({ open }) => (open ? '10px 10px 0 0' : '10px')};
`;

const Content = Box.extend`
  border-radius: 0 0 10px 10px;
  border: 2px solid #2075c7;
  border-top: 0;
`;

const OpenButton = ButtonTransparent.extend`
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

/* eslint-disable react/prefer-stateless-function */
class ChatRoomPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleOpen = () => this.setState(({ open }) => ({ open: !open }));
  }
  render() {
    const { node } = this.props;
    return (
      <div>
        <Border w={1} open={this.state.open} onClick={this.toggleOpen}>
          {node.name}
        </Border>
        {this.state.open && (
          <Content p={1}>
            <Flex flexWrap="wrap" alignItems="center">
              <FormattedMessage {...messages.owner} />:
              <UserLabel user={node.user} />
              {this.props.tune && (
                <OpenButton
                  bg="transparent"
                  color="gray3"
                  ml="auto"
                  onClick={() => this.props.tune(node.name)}
                >
                  <FormattedMessage {...messages.open} />
                </OpenButton>
              )}
            </Flex>
            <div
              dangerouslySetInnerHTML={{ __html: line2md(node.description) }}
            />
          </Content>
        )}
      </div>
    );
  }
}

ChatRoomPanel.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    private: PropTypes.bool.isRequired,
    created: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  }),
  tune: PropTypes.func,
};

export default ChatRoomPanel;
