import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Flex } from 'rebass';
import { ButtonOutline, Input } from 'style-store';
import { PublicChannels } from './constants';
import messages from './messages';

const StyledButton = ButtonOutline.extend`
  border-radius: 5px;
  padding: 10px;
`;

class Channels extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { content: '' };
    this.handleChange = (e) => this.setState({ content: e.target.value });
    this.handleKeyDown = (e) => {
      if (e.key === 'Enter') this.props.tune(this.state.content);
    };
  }
  render() {
    return (
      <Flex wrap>
        <StyledButton
          w={1}
          py={20}
          my={5}
          onClick={() => this.props.tune(null)}
        >
          <FormattedMessage {...messages.defaultChannel} />
        </StyledButton>
        {PublicChannels.map((c) => (
          <StyledButton
            w={1}
            py={20}
            my={5}
            onClick={() => this.props.tune(c)}
            key={c}
          >
            {c}
          </StyledButton>
        ))}
        <Flex mx={1} w={1}>
          <FormattedMessage {...messages.channelName}>
            {(msg) => (
              <Input
                value={this.state.content}
                placeholder={msg}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
              />
            )}
          </FormattedMessage>
          <ButtonOutline
            onClick={this.handleSubmit}
            p={10}
            style={{ wordBreak: 'keep-all' }}
          >
            <FormattedMessage {...messages.change} />
          </ButtonOutline>
        </Flex>
      </Flex>
    );
  }
}

Channels.propTypes = {
  tune: PropTypes.func.isRequired,
};

export default Channels;
