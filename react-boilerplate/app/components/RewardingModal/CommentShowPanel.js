import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Flex, Box } from 'rebass';
import { line2md } from 'common';
import { ButtonOutline } from 'style-store';
import UserLabel from 'components/UserLabel';

import messages from './messages';

const WarningBtn = ButtonOutline.extend`
  color: tomato;
  width: 100%;
  border-radius: 10px;
  &:hover {
    background-color: tomato;
  }
`;

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
      <Flex wrap>
        {this.state.show ? (
          <Box>
            <div
              dangerouslySetInnerHTML={{
                __html: line2md(this.props.node.content),
              }}
            />
          </Box>
        ) : (
          <WarningBtn onClick={this.showComment}>
            <FormattedMessage {...messages.spoilerWarning} />
          </WarningBtn>
        )}
        <Box w={1} mt={5} style={{ textAlign: 'right' }}>
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
