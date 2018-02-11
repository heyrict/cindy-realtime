/**
 *
 * LoginForm
 *
 */

/* eslint-disable react/jsx-indent */

import React from 'react';
import PropTypes from 'prop-types';
import FieldGroup from 'components/FieldGroup';
import environment from 'Environment';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { commitMutation } from 'react-relay';

import { Form, FormControl, Panel } from 'react-bootstrap';
import { setCurrentUser } from 'containers/UserNavbar/actions';
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
    if (target.id === 'formLoginUsername') {
      this.setState({ username: target.value });
    } else if (target.id === 'formLoginPassword') {
      this.setState({ password: target.value });
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
    const { username, password } = this.state;
    commitMutation(environment, {
      mutation: LoginFormMutation,
      variables: { input: { username, password } },
      onCompleted: (response, errors) => {
        if (errors) {
          this.setState({
            errorMsg: errors,
          });
        } else if (response) {
          const user = response.login.user;
          // TODO: Update Global User Interface here
          this.props.updateCurrentUser({
            ...user,
            userId: user.rowid,
          });
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
          id="formLoginUsername"
          label={<FormattedMessage {...messages.username} />}
          Ctl={FormControl}
          type="text"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formLoginPassword"
          label={<FormattedMessage {...messages.password} />}
          Ctl={FormControl}
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <FormControl
          id="formModalAddSubmit"
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

LoginForm.propTypes = {
  updateCurrentUser: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    updateCurrentUser: (user) => {
      dispatch(setCurrentUser(user));
    },
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withConnect,
  withModal({
    header: 'Login',
    footer: {
      confirm: true,
      close: true,
    },
  })
)(LoginForm);
