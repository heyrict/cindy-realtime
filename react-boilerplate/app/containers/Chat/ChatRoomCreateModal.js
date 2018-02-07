import React from 'react';
import PropTypes from 'prop-types';
import withModal from 'components/withModal';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { commitMutation } from 'react-relay';
import environment from 'Environment';
import CreateChatRoomMutation from 'graphql/CreateChatRoomMutation';
import { Form, FormControl, Panel } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import FieldGroup from 'components/FieldGroup';
import messages from './messages';
import { updateChannel, openChat } from './actions';

/* eslint-disable react/jsx-indent */

export class ChatRoomCreateForm extends React.Component {
  // {{{ constructor
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      errorMsg: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  // {{{ handleSubmit
  handleSubmit(e) {
    e.preventDefault();
    this.confirm();
  }
  // }}}
  // {{{ confirm
  confirm() {
    const { name, description } = this.state;
    commitMutation(environment, {
      mutation: CreateChatRoomMutation,
      variables: { input: { name, description } },
      onCompleted: (response, errors) => {
        if (errors) {
          this.setState({
            errorMsg: errors,
          });
        } else if (response) {
          this.props.dispatch(
            updateChannel(name, response.createChatroom.chatroom)
          );
          this.props.onHide();
          this.props.tune(name);
        }
      },
    });
  }
  // }}}
  // {{{ render
  render() {
    return (
      <Form horizontal>
        {this.state.errorMsg
          ? this.state.errorMsg.map((e) => (
              <Panel header={e.message} bsStyle="danger" key={e.message} />
            ))
          : null}
        <FieldGroup
          id="formCreateChatRoomName"
          label={<FormattedMessage {...messages.channelName} />}
          Ctl={FormControl}
          type="text"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formCreateChatRoomDescription"
          label={<FormattedMessage {...messages.description} />}
          Ctl={FormControl}
          type="description"
          value={this.state.description}
          onChange={this.handleChange}
        />
        <FormControl
          id="formCreateChatRoomSubmit"
          type="submit"
          onClick={this.handleSubmit}
          value={'Submit'}
          className="hidden"
        />
      </Form>
    );
  }
  // }}}
}

ChatRoomCreateForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  tune: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(null, mapDispatchToProps),
  withModal({
    header: 'New ChatRoom',
    footer: {
      confirm: true,
      close: true,
    },
  })
)(ChatRoomCreateForm);
