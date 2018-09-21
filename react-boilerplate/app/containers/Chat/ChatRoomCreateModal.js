import React from 'react';
import PropTypes from 'prop-types';
import withModal from 'components/withModal';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Input, AutoResizeTextarea as Textarea } from 'style-store';
import CreateChatRoomMutation from 'graphql/CreateChatRoomMutation';
import { FormattedMessage } from 'react-intl';
import { graphql } from 'react-apollo';
import FieldGroup from 'components/FieldGroup';
import { nAlert } from 'containers/Notifier/actions';
import messages from './messages';
import { updateChannel } from './actions';

/* eslint-disable react/jsx-indent */

export class ChatRoomCreateForm extends React.Component {
  // {{{ constructor
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.confirm = this.confirm.bind(this);
  }
  // }}}
  // {{{ handleChange
  handleChange(e) {
    const target = e.target;
    if (target.id === 'formCreateChatRoomName') {
      this.setState({ name: target.value });
    } else if (target.id === 'formCreateChatRoomDescription') {
      this.setState({ description: target.value });
    }
  }
  // }}}
  // {{{ confirm
  confirm() {
    const { name, description } = this.state;
    this.props
      .mutate({
        variables: { input: { name, description } },
      })
      .then(({ data }) => {
        this.props.updateChannel(name, data.createChatroom.chatroom);
        this.props.onHide();
        this.props.tune(name);
      })
      .catch((error) => {
        this.props.alert(error.message);
      });
  }
  // }}}
  // {{{ render
  render() {
    return (
      <div>
        <FieldGroup
          id="formCreateChatRoomName"
          label={<FormattedMessage {...messages.channelName} />}
          Ctl={Input}
          type="text"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formCreateChatRoomDescription"
          label={<FormattedMessage {...messages.description} />}
          Ctl={Textarea}
          type="description"
          value={this.state.description}
          onChange={this.handleChange}
        />
      </div>
    );
  }
  // }}}
}

ChatRoomCreateForm.propTypes = {
  updateChannel: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  tune: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  updateChannel: (name, chatroom) => dispatch(updateChannel(name, chatroom)),
  alert: (message) => dispatch(nAlert(message)),
});

const withMutation = graphql(CreateChatRoomMutation);

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  withMutation,
  withModal({
    header: 'New ChatRoom',
    footer: {
      confirm: true,
      close: true,
    },
  }),
)(ChatRoomCreateForm);
