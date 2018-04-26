/**
 *
 * LoginForm
 *
 */

/* eslint-disable react/jsx-indent */

import React from 'react';
import PropTypes from 'prop-types';
import FieldGroup from 'components/FieldGroup';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { graphql } from 'react-apollo';

import { Input } from 'style-store';
import { setCurrentUser } from 'containers/UserNavbar/actions';
import { nAlert } from 'containers/Notifier/actions';
import { withModal } from 'components/withModal';
import LoginFormMutation from 'graphql/LoginFormMutation';
import messages from './messages';

export class LoginForm extends React.Component {
  // {{{ constructor
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.confirm = this.confirm.bind(this);
  }
  // }}}
  // {{{ handleChange
  handleChange(e) {
    const target = e.target;
    if (target.id === 'formLoginUsername') {
      this.setState({ username: target.value });
    } else if (target.id === 'formLoginPassword') {
      this.setState({ password: target.value });
    }
  }
  // }}}
  // {{{ confirm
  confirm() {
    const { username, password } = this.state;
    this.props
      .mutate({
        variables: { input: { username, password } },
      })
      .then(({ data }) => {
        const user = data.login.user;
        this.props.updateCurrentUser({
          ...user,
          userId: user.rowid,
        });
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
          id="formLoginUsername"
          label={<FormattedMessage {...messages.username} />}
          Ctl={Input}
          type="text"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formLoginPassword"
          label={<FormattedMessage {...messages.password} />}
          Ctl={Input}
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
        />
      </div>
    );
  }
  // }}}
}

LoginForm.propTypes = {
  updateCurrentUser: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  updateCurrentUser: (user) => {
    dispatch(setCurrentUser(user));
  },
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(null, mapDispatchToProps);

const withLogin = graphql(LoginFormMutation);

export default compose(
  withLogin,
  withConnect,
  withModal({
    header: 'Login',
    footer: {
      confirm: true,
      close: true,
    },
  })
)(LoginForm);
