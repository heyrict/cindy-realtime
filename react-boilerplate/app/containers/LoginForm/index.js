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
        this.setState({
          errorMsg: error,
        });
      });
  }
  // }}}
  // {{{ render
  render() {
    return (
      <Form horizontal>
        {this.state.errorMsg ? (
          <Panel
            header={this.state.errorMsg.message}
            bsStyle="danger"
            key={this.state.errorMsg.message}
          />
        ) : null}
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
  mutate: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    updateCurrentUser: (user) => {
      dispatch(setCurrentUser(user));
    },
  };
}

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
