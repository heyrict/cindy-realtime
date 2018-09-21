import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { ButtonOutline, EditButton, ImgXs, Textarea } from 'style-store';
import { Flex, Box } from 'rebass';
import { line2md, from_global_id as f } from 'common';
import { FormattedMessage } from 'react-intl';
import { graphql } from 'react-apollo';

import UserLabel from 'components/UserLabel';
import ButtonSelect from 'components/ButtonSelect';
import dialogueMessages from 'containers/Dialogue/messages';
import { nAlert } from 'containers/Notifier/actions';
import tick from 'images/tick.svg';
import cross from 'images/cross.svg';

import UpdateChatroomMutation from 'graphql/UpdateChatroomMutation';
import ChatRoomQuery from 'graphql/ChatRoomQuery';
import ChatRoomFragment from 'graphql/ChatRoom';

import Wrapper from './Wrapper';
import AddToFavBtn from './AddToFavBtn';
import DeleteFromFavBtn from './DeleteFromFavBtn';
import { updateChannel } from './actions';
import messages from './messages';

const StyledButton = ButtonOutline.extend`
  padding: 5px 15px;
  margin: 0 0 5px 0;
  border-radius: 10px;
  width: 100%;
`;

const DescriptionWrapper = Wrapper.extend`
  overflow-y: auto;
  height: ${(props) => props.height}px;
  width: 100%;
  border-radius: 0;
  padding: 0;
`;

class DescriptionPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      description: props.channel ? props.channel.description : 'Now Loading...',
    };
    this.handleChange = (e) => this.setState({ description: e.target.value });
    this.toggleEditMode = (mode) =>
      this.setState((s) => ({
        editMode: mode === undefined ? !s.editMode : mode,
      }));
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.channel) {
      this.setState({
        description: nextProps.channel
          ? nextProps.channel.description || ''
          : '',
      });
    }
  }
  handleSubmit(input) {
    const { id } = this.props.channel;
    const { name } = this.props;
    this.props
      .mutate({
        variables: {
          input: {
            chatroomId: id,
            ...input,
          },
        },
        update(proxy) {
          /*
          const data = proxy.readQuery({
            query: ChatRoomQuery,
            variables: { chatroomName: name },
          });
          if (input.description !== undefined) {
            data.allChatrooms.edges[0].node.description = input.description;
          }
          if (input.private !== undefined) {
            data.allChatrooms.edges[0].node.private = input.private;
          }
          proxy.writeQuery({
            query: ChatRoomQuery,
            variables: { chatroomName: name },
            data,
          });
          */
          const data = proxy.readFragment({
            id,
            fragment: ChatRoomFragment,
            fragmentName: 'ChatRoom',
          });
          if (input.description !== undefined) {
            data.description = input.description;
          }
          if (input.private !== undefined) {
            data.private = input.private;
          }
          proxy.writeFragment({
            id,
            fragment: ChatRoomFragment,
            fragmentName: 'ChatRoom',
            data,
          });
        },
      })
      .then(() => {
        this.props.dispatch(
          updateChannel(this.props.name, {
            ...this.props.channel,
            description: this.state.description,
          }),
        );
        this.toggleEditMode(false);
      })
      .catch((error) => {
        this.props.alert(error.message);
      });
  }
  render() {
    if (!this.props.name) return null;
    if (!this.props.channel) {
      return <DescriptionWrapper height={this.props.height} />;
    }
    if (this.props.name.match(/^puzzle-\d+$/)) {
      return (
        <DescriptionWrapper height={this.props.height}>
          <Flex style={{ fontSize: '0.9em' }}>
            <Box mr="auto">
              <FormattedMessage
                {...messages.puzzleChatDescription}
                values={{ channelName: this.props.name }}
              />
            </Box>
            {this.props.currentUserId && (
              <Box ml="auto">
                {inFavorite ? (
                  <DeleteFromFavBtn
                    chatroomName={this.props.name}
                    userId={this.props.currentUserId}
                  />
                ) : (
                  <AddToFavBtn
                    chatroomName={this.props.name}
                    userId={this.props.currentUserId}
                  />
                )}
              </Box>
            )}
          </Flex>
        </DescriptionWrapper>
      );
    }

    let inFavorite = false;
    if (this.props.favChannels) {
      this.props.favChannels.edges.forEach((edge) => {
        if (edge.node.chatroom.name === this.props.name) {
          inFavorite = true;
        }
      });
    }

    return (
      <DescriptionWrapper height={this.props.height}>
        {this.state.editMode === true ? (
          <Flex alignItems="center" mx={0} mt={1}>
            <Box w={[2 / 3, 5 / 6, 7 / 8]} mx={1}>
              <Textarea
                value={this.state.description}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
              />
            </Box>
            <Box w={[1 / 3, 1 / 6, 1 / 8]} mr={1}>
              <StyledButton onClick={() => this.toggleEditMode(false)}>
                <ImgXs src={cross} />
              </StyledButton>
              <StyledButton
                onClick={() =>
                  this.handleSubmit({ description: this.state.description })
                }
              >
                <ImgXs src={tick} />
              </StyledButton>
            </Box>
          </Flex>
        ) : (
          <div>
            <Flex style={{ fontSize: '0.9em' }} alignItems="center">
              <Box mr="auto">
                <FormattedMessage {...messages.owner} />:{' '}
                <UserLabel user={this.props.channel.user} />
              </Box>
              {this.props.currentUserId === this.props.channel.user.id && (
                <Box mx="auto">
                  <ButtonSelect
                    value={this.props.channel.private}
                    onChange={({ value }) =>
                      this.handleSubmit({ private: value })
                    }
                    buttonProps={{
                      py: 0,
                    }}
                    options={[
                      {
                        value: true,
                        label: <FormattedMessage {...messages.private} />,
                      },
                      {
                        value: false,
                        label: <FormattedMessage {...messages.public} />,
                      },
                    ]}
                  />
                </Box>
              )}
              {this.props.currentUserId && (
                <Box ml="auto">
                  {inFavorite ? (
                    <DeleteFromFavBtn
                      chatroomName={this.props.name}
                      userId={this.props.currentUserId}
                    />
                  ) : (
                    <AddToFavBtn
                      chatroomName={this.props.name}
                      userId={this.props.currentUserId}
                    />
                  )}
                </Box>
              )}
            </Flex>
            <hr style={{ margin: '3px 0 7px 0' }} />
            <span
              style={{ overflow: 'auto' }}
              dangerouslySetInnerHTML={{
                __html: line2md(this.props.channel.description),
              }}
            />
            {this.props.currentUserId === this.props.channel.user.id && (
              <FormattedMessage {...dialogueMessages.edit}>
                {(msg) => (
                  <EditButton onClick={() => this.toggleEditMode(true)}>
                    {msg}
                  </EditButton>
                )}
              </FormattedMessage>
            )}
          </div>
        )}
      </DescriptionWrapper>
    );
  }
}

DescriptionPanel.propTypes = {
  dispatch: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  name: PropTypes.string,
  height: PropTypes.number.isRequired,
  channel: PropTypes.object,
  currentUserId: PropTypes.string,
  favChannels: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withMutation = graphql(UpdateChatroomMutation);

const withData = graphql(ChatRoomQuery, {
  options: ({ name }) => ({
    variables: { chatroomName: name },
  }),
  props({ data }) {
    const { allChatrooms } = data;
    if (!allChatrooms || allChatrooms.edges.length === 0) return {};
    return {
      channel: allChatrooms.edges[0].node,
    };
  },
});

export default compose(
  withData,
  withConnect,
  withMutation,
)(DescriptionPanel);
