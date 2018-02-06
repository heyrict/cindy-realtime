import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { connect } from 'react-redux';
import {
  Button,
  ButtonOutline,
  EditButton,
  ImgXs,
  Textarea,
} from 'style-store';
import { Flex, Box } from 'rebass';
import { line2md, from_global_id as f } from 'common';
import { FormattedMessage } from 'react-intl';
import { UserLabel } from 'components/UserLabel';
import { commitMutation } from 'react-relay';
import environment from 'Environment';
import dialogueMessages from 'containers/Dialogue/messages';
import tick from 'images/tick.svg';
import cross from 'images/cross.svg';
import UpdateChatroomMutation from 'graphql/UpdateChatroomMutation';
import Wrapper from './Wrapper';
import { updateChannel } from './actions';
import messages from './messages';

const StyledButton = ButtonOutline.extend`
  padding: 5px 15px;
  margin: 0 0 5px 0;
  border-radius: 10px;
  width: 100%;
`;

const DescriptionBtn = Button.extend`
  overflow-y: auto;
  height: ${(props) => props.height}px;
  width: 100%;
  border-radius: 0;
  padding: 0;
  background-color: sienna;
  &:hover {
    color: blanchedalmond;
    background-color: sienna;
  }
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
      show: false,
      editMode: false,
      description: '',
    };
    this.toggleDescription = this.toggleDescription.bind(this);
    this.handleChange = (e) => this.setState({ description: e.target.value });
    this.toggleEditMode = () =>
      this.setState((s) => ({ editMode: !s.editMode }));
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
  toggleDescription() {
    this.setState((p) => {
      this.props.changeHeight(p.show ? 20 : 120);
      return { show: !p.show };
    });
  }
  handleSubmit() {
    const id = parseInt(f(this.props.channel.id)[1], 10);
    commitMutation(environment, {
      mutation: UpdateChatroomMutation,
      variables: {
        input: {
          description: this.state.description,
          chatroomId: id,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
        }
        this.props.dispatch(
          updateChannel(this.props.name, {
            ...this.props.channel,
            description: this.state.description,
          })
        );
        this.toggleEditMode();
      },
    });
  }
  render() {
    if (!this.props.name || !this.props.channel) return null;
    if (this.props.name.match(/^puzzle-\d+$/g)) return null;
    if (this.state.show) {
      return (
        <DescriptionWrapper height={this.props.height}>
          <DescriptionBtn height={20} onClick={this.toggleDescription}>
            {this.props.name}
          </DescriptionBtn>
          {this.state.editMode === false && (
            <div>
              <span style={{ fontSize: '0.9em' }}>
                <FormattedMessage {...messages.owner} />:{' '}
                <UserLabel user={this.props.channel.user} />
              </span>
              <hr style={{ margin: '3px 0 7px 0' }} />
              <span
                style={{ overflow: 'auto' }}
                dangerouslySetInnerHTML={{
                  __html: line2md(this.state.description),
                }}
              />
              {this.props.currentUserId === this.props.channel.user.rowid && (
                <FormattedMessage {...dialogueMessages.edit}>
                  {(msg) => (
                    <EditButton onClick={this.toggleEditMode}>{msg}</EditButton>
                  )}
                </FormattedMessage>
              )}
            </div>
          )}
          {this.state.editMode === true && (
            <Flex align="center" mx={0} mt={1}>
              <Box w={[2 / 3, 5 / 6, 7 / 8]} mx={1}>
                <Textarea
                  value={this.state.description}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                />
              </Box>
              <Box w={[1 / 3, 1 / 6, 1 / 8]} mr={1}>
                <StyledButton onClick={this.toggleEditMode}>
                  <ImgXs src={cross} />
                </StyledButton>
                <StyledButton onClick={this.handleSubmit}>
                  <ImgXs src={tick} />
                </StyledButton>
              </Box>
            </Flex>
          )}
        </DescriptionWrapper>
      );
    }
    return (
      <DescriptionBtn
        height={this.props.height}
        onClick={this.toggleDescription}
      >
        {this.props.name}
      </DescriptionBtn>
    );
  }
}

DescriptionPanel.propTypes = {
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string,
  channel: PropTypes.object,
  height: PropTypes.number.isRequired,
  changeHeight: PropTypes.func.isRequired,
  currentUserId: PropTypes.number,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(null, mapDispatchToProps)(DescriptionPanel);
