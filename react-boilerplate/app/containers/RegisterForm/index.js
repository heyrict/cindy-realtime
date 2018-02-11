/**
 *
 * RegisterForm
 *
 */

/* eslint-disable react/jsx-indent */

import React from 'react';
import PropTypes from 'prop-types';
import environment from 'Environment';
import { text2md } from 'common';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { commitMutation } from 'react-relay';
import { Form, FormControl, Panel } from 'react-bootstrap';
import { ButtonOutline } from 'style-store';

import Constrained from 'components/Constrained';
import FieldGroup from 'components/FieldGroup';
import { setCurrentUser } from 'containers/UserNavbar/actions';
import { withModal } from 'components/withModal';
import RegisterFormMutation from 'graphql/RegisterFormMutation';

import rulesMessages from 'containers/RulesPage/messages';
import messages from './messages';
import { registerSucceeded } from './actions';

export class RegisterForm extends React.Component {
  // {{{ constructor
  constructor(props) {
    super(props);
    this.state = {
      displayPolicy: true,
      username: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
      errorMsg: null,
      username_valid: true,
      nickname_valid: true,
      password_valid: true,
      passwordConfirm_valid: true,
    };

    this.handlePolicyConfirm = () => this.setState({ displayPolicy: false });
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.confirm = this.confirm.bind(this);
  }
  // }}}
  // {{{ handleChange
  handleChange(e) {
    const target = e.target;
    if (target.id === 'formRegisterUsername') {
      this.setState({ username: target.value });
      this.setState((prevState) => ({
        username_valid:
          prevState.username.match(/^[a-zA-Z0-9@\-+._]+$/) &&
          prevState.username.length < 150 &&
          prevState.username.length > 0,
      }));
    } else if (target.id === 'formRegisterNickname') {
      this.setState({ nickname: target.value });
      this.setState((prevState) => ({
        nickname_valid:
          prevState.nickname.length <= 64 && prevState.nickname.length > 0,
      }));
    } else if (target.id === 'formRegisterPassword') {
      this.setState({ password: target.value });
      this.setState((prevState) => ({
        password_valid:
          prevState.password.length <= 64 &&
          prevState.password.length >= 8 &&
          prevState.password.match(/[0-9]+/) &&
          prevState.password.match(/[a-zA-Z]+/),
      }));
    } else if (target.id === 'formRegisterPasswordConfirm') {
      this.setState({ passwordConfirm: target.value });
      this.setState((prevState) => ({
        passwordConfirm_valid: prevState.passwordConfirm === prevState.password,
      }));
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
    const { username, nickname, password } = this.state;
    // Validation
    if (
      !this.state.username_valid ||
      !this.state.nickname_valid ||
      !this.state.password_valid ||
      !this.state.passwordConfirm_valid ||
      !(
        this.state.nickname &&
        this.state.username &&
        this.state.password &&
        this.state.passwordConfirm
      )
    ) {
      this.setState((prevState) => ({
        username_valid: prevState.username !== '',
        nickname_valid: prevState.nickname !== '',
        password_valid: prevState.password !== '',
        passwordConfirm_valid: prevState.passwordConfirm !== '',
        errorMsg: [{ message: 'There are some errors in your form!' }],
      }));
      return;
    }
    // Commit
    commitMutation(environment, {
      mutation: RegisterFormMutation,
      variables: {
        input: { username, nickname, password },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          this.setState({
            errorMsg: errors,
          });
        } else if (response) {
          const user = response.register.user;
          this.props.updateCurrentUser({
            ...user,
            userId: user.rowid,
          });
          this.props.dispatch(registerSucceeded());
        }
      },
    });
  }
  // }}}
  // {{{ render
  render() {
    if (this.state.displayPolicy) {
      return (
        <Constrained level={5}>
          <div style={{ maxHeight: '340px', overflow: 'auto' }}>
            <FormattedMessage {...rulesMessages.rules}>
              {(msg) => (
                <div dangerouslySetInnerHTML={{ __html: text2md(msg) }} />
              )}
            </FormattedMessage>
          </div>
          <ButtonOutline
            onClick={this.handlePolicyConfirm}
            style={{ borderRadius: 0, width: '100%' }}
          >
            <FormattedMessage {...messages.policyReadPrompt} />
          </ButtonOutline>
        </Constrained>
      );
    }
    return (
      <Form horizontal>
        {this.state.errorMsg
          ? this.state.errorMsg.map((e) => (
              <Panel header={e.message} bsStyle="danger" key={e.message} />
            ))
          : null}
        <FieldGroup
          id="formRegisterUsername"
          label={<FormattedMessage {...messages.usernameLabel} />}
          Ctl={FormControl}
          type="text"
          value={this.state.username}
          valid={this.state.username_valid ? null : 'error'}
          help={<FormattedMessage {...messages.usernameHelp} />}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formRegisterNickname"
          label={<FormattedMessage {...messages.nicknameLabel} />}
          Ctl={FormControl}
          type="text"
          value={this.state.nickname}
          valid={this.state.nickname_valid ? null : 'error'}
          help={<FormattedMessage {...messages.nicknameHelp} />}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formRegisterPassword"
          label={<FormattedMessage {...messages.passwordLabel} />}
          Ctl={FormControl}
          type="password"
          value={this.state.password}
          valid={this.state.password_valid ? null : 'error'}
          help={<FormattedMessage {...messages.passwordHelp} />}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formRegisterPasswordConfirm"
          label={<FormattedMessage {...messages.passwordConfirmLabel} />}
          Ctl={FormControl}
          type="password"
          value={this.state.passwordConfirm}
          valid={this.state.passwordConfirm_valid ? null : 'error'}
          onChange={this.handleChange}
        />
        <FormControl
          id="formRegiterSubmit"
          type="submit"
          onClick={this.handleSubmit}
          value={<FormattedMessage {...messages.submitLabel} />}
          className="hidden"
        />
      </Form>
    );
  }
  // }}}
}

RegisterForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  updateCurrentUser: PropTypes.func.isRequired,
  onHide: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateCurrentUser: (user) => {
      dispatch(setCurrentUser(user));
    },
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withConnect,
  withModal({
    header: 'Register',
    footer: {
      confirm: true,
      close: true,
    },
  })
)(RegisterForm);
