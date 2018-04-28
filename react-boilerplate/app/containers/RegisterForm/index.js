/**
 *
 * RegisterForm
 *
 */

/* eslint-disable react/jsx-indent */

import React from 'react';
import PropTypes from 'prop-types';
import { text2md } from 'common';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import { ButtonOutline, Input } from 'style-store';

import Constrained from 'components/Constrained';
import FieldGroup from 'components/FieldGroup';
import { setCurrentUser } from 'containers/UserNavbar/actions';
import { withModal } from 'components/withModal';
import RegisterFormMutation from 'graphql/RegisterFormMutation';

import { nAlert } from 'containers/Notifier/actions';
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
      username_valid: true,
      nickname_valid: true,
      password_valid: true,
      passwordConfirm_valid: true,
    };

    this.handlePolicyConfirm = () => this.setState({ displayPolicy: false });
    this.handleChange = this.handleChange.bind(this);
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
          prevState.password.match(/[a-zA-Z]+/) &&
          prevState.password.match(/^[a-zA-Z0-9@.+\-_]+$/),
      }));
    } else if (target.id === 'formRegisterPasswordConfirm') {
      this.setState({ passwordConfirm: target.value });
      this.setState((prevState) => ({
        passwordConfirm_valid: prevState.passwordConfirm === prevState.password,
      }));
    }
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
      }));
      this.props.alert('There are some errors in your form!');
      return;
    }
    // Commit
    this.props
      .mutate({
        variables: {
          input: { username, nickname, password },
        },
      })
      .then(({ data }) => {
        const user = data.register.user;
        this.props.updateCurrentUser({
          ...user,
          userId: user.rowid,
        });
        this.props.registerSucceeded(user.rowid);
      })
      .catch((error) => {
        this.props.alert(error.message);
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
      <div>
        <FieldGroup
          id="formRegisterUsername"
          label={<FormattedMessage {...messages.usernameLabel} />}
          Ctl={Input}
          type="text"
          value={this.state.username}
          valid={this.state.username_valid ? null : 'error'}
          help={<FormattedMessage {...messages.usernameHelp} />}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formRegisterNickname"
          label={<FormattedMessage {...messages.nicknameLabel} />}
          Ctl={Input}
          type="text"
          value={this.state.nickname}
          valid={this.state.nickname_valid ? null : 'error'}
          help={<FormattedMessage {...messages.nicknameHelp} />}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formRegisterPassword"
          label={<FormattedMessage {...messages.passwordLabel} />}
          Ctl={Input}
          type="password"
          value={this.state.password}
          valid={this.state.password_valid ? null : 'error'}
          help={<FormattedMessage {...messages.passwordHelp} />}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formRegisterPasswordConfirm"
          label={<FormattedMessage {...messages.passwordConfirmLabel} />}
          Ctl={Input}
          type="password"
          value={this.state.passwordConfirm}
          valid={this.state.passwordConfirm_valid ? null : 'error'}
          onChange={this.handleChange}
        />
      </div>
    );
  }
  // }}}
}

RegisterForm.propTypes = {
  updateCurrentUser: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
  registerSucceeded: PropTypes.func.isRequired,
  // onHide: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  registerSucceeded: (userId) => dispatch(registerSucceeded(userId)),
  updateCurrentUser: (user) => dispatch(setCurrentUser(user)),
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(null, mapDispatchToProps);

const withMutation = graphql(RegisterFormMutation);

export default compose(
  withMutation,
  withConnect,
  withModal({
    header: 'Register',
    footer: {
      confirm: true,
      close: true,
    },
  })
)(RegisterForm);
