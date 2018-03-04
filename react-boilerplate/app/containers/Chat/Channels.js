import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Flex } from 'rebass';
import { ButtonOutline, Input } from 'style-store';
import { PublicChannels } from './constants';
import messages from './messages';
import ChatRoomCreateModal from './ChatRoomCreateModal';
import Bar from './Bar';

const StyledButton = ButtonOutline.extend`
  border-radius: 5px;
  padding: 10px;
`;

class Channels extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      publicShown: false,
      favShown: false,
      createModalShown: false,
    };
    this.handleChange = (e) => this.setState({ content: e.target.value });
    this.handleKeyDown = (e) => {
      if (e.key === 'Enter') this.props.tune(this.state.content);
    };
    this.toggleCreateModalShow = (s) => this.setState({ createModalShown: s });
    this.togglePublicShown = () =>
      this.setState((p) => ({ publicShown: !p.publicShown }));
    this.toggleFavShown = () =>
      this.setState((p) => ({ favShown: !p.favShown }));
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
        <Bar open={this.state.publicShown} onClick={this.togglePublicShown}>
          public channels
        </Bar>
        {this.state.publicShown &&
          PublicChannels.map((c) => (
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
        <Bar open={this.state.favShown} onClick={this.toggleFavShown}>
          favorite channels
        </Bar>
        {this.state.favShown &&
          this.props.favChannels.edges.map((edge) => {
            if (!edge) return null;
            const c = edge.node.chatroom.name;
            return (
              <StyledButton
                w={1}
                py={20}
                my={5}
                onClick={() => this.props.tune(c)}
                key={c}
              >
                {c}
              </StyledButton>
            );
          })}
        <Flex mx={1} mt={1} w={1}>
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
            onClick={() => this.props.tune(this.state.content)}
            p={10}
            style={{ wordBreak: 'keep-all' }}
          >
            <FormattedMessage {...messages.change} />
          </ButtonOutline>
        </Flex>
        <ButtonOutline
          onClick={() => this.toggleCreateModalShow(true)}
          p={10}
          m={1}
          w={1}
          style={{ wordBreak: 'keep-all', borderRadius: '10px' }}
        >
          <FormattedMessage {...messages.createChatroom} />
        </ButtonOutline>
        <ChatRoomCreateModal
          show={this.state.createModalShown}
          onHide={() => this.toggleCreateModalShow(false)}
          tune={this.props.tune}
        />
      </Flex>
    );
  }
}

Channels.propTypes = {
  tune: PropTypes.func.isRequired,
  favChannels: PropTypes.object,
};

export default Channels;
