// {{{1 Imports
import React from "react";
import { Form, FormControl, MenuItem, Panel } from "react-bootstrap";
import { commitMutation } from "react-relay";
import { connect } from "react-redux";
import bootbox from "bootbox";

import { setCurrentUser } from "../redux/actions";

import { FieldGroup, ModalContainer } from "./components.jsx";
import common from "../common";
import { environment } from "../Environment";

// {{{1 Containers
// {{{2 class LoginFormAtom
export class LoginFormAtom extends React.Component {
  // {{{ constructor
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorMsg: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.confirm = this.confirm.bind(this);
  }
  // }}}
  // {{{ render
  render() {
    return (
      <Form horizontal>
        {this.state.errorMsg
          ? this.state.errorMsg.map(e => (
              <Panel header={e.message} bsStyle="danger" key={e.message} />
            ))
          : null}
        <FieldGroup
          id="formLoginUsername"
          label={gettext("Username")}
          Ctl={FormControl}
          type="text"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formLoginPassword"
          label={gettext("Password")}
          Ctl={FormControl}
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <FormControl
          id="formModalAddSubmit"
          type="submit"
          onClick={this.handleSubmit}
          value={gettext("Submit")}
          className="hidden"
        />
      </Form>
    );
  }
  // }}}
  // {{{ handleChange
  handleChange(e) {
    var target = e.target;
    if (target.id == "formLoginUsername") {
      this.setState({ username: target.value });
    } else if (target.id == "formLoginPassword") {
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
    var { username, password } = this.state;
    commitMutation(environment, {
      mutation: AuthFormLoginMutation,
      variables: { input: { username: username, password: password } },
      onCompleted: (response, errors) => {
        if (errors) {
          this.setState({
            errorMsg: errors
          });
        } else if (response) {
          const user = response.login.user;
          // TODO: Update Global User Interface here
          this.props.updateCurrentUser({
            userId: user.rowid,
            nickname: user.nickname
          });
        }
      }
    });
  }
  // }}}
}
// {{{2 const LoginForm
const mapLoginDispatchToProps = (dispatch, ownProps) => ({
  updateCurrentUser: user => {
    dispatch(setCurrentUser(user));
  }
});

const LoginForm = connect(null, mapLoginDispatchToProps)(LoginFormAtom);
// {{{2 class LoginMenuItem
export class LoginMenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.showChildModal = this.showChildModal.bind(this);
  }

  render() {
    return (
      <MenuItem eventKey={this.props.eventKey}>
        <div onClick={this.showChildModal}>{this.props.children}</div>
        <ModalContainer
          header="Login"
          body={LoginForm}
          footer={{ confirm: true, close: true }}
          ref={instance => {
            this.childModal = instance;
          }}
        />
      </MenuItem>
    );
  }

  showChildModal() {
    this.childModal.showModal();
  }
}
// {{{2 class LogoutMenuItemAtom
export class LogoutMenuItemAtom extends React.Component {
  constructor(props) {
    super(props);

    this.confirm = this.confirm.bind(this);
  }

  render() {
    return (
      <MenuItem eventKey={this.props.eventKey} onClick={this.confirm}>
        {this.props.children}
      </MenuItem>
    );
  }

  confirm() {
    commitMutation(environment, {
      mutation: AuthFormLogoutMutation,
      variables: { input: {} },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(
            errors.map(e => (
              <Panel header={e.message} key={e.message} bsStyle="danger" />
            ))
          );
        } else if (response) {
          // TODO: Update Global User Interface here
          this.props.updateCurrentUser();
        }
      }
    });
  }
}
// {{{2 const LogoutMenuItem
const mapLogoutDispatchToProps = (dispatch, ownProps) => ({
  updateCurrentUser: () => {
    dispatch(setCurrentUser({ userId: null, nickname: null }));
  }
});

export const LogoutMenuItem = connect(null, mapLogoutDispatchToProps)(
  LogoutMenuItemAtom
);
// {{{1 Fragments
// {{{2 mutation AuthFormLoginMutation
const AuthFormLoginMutation = graphql`
  mutation AuthFormLoginMutation($input: UserLoginInput!) {
    login(input: $input) {
      user {
        rowid
        nickname
      }
    }
  }
`;
// {{{2 mutation AuthFormLogoutMutation
const AuthFormLogoutMutation = graphql`
  mutation AuthFormLogoutMutation($input: UserLogoutInput!) {
    logout(input: $input) {
      clientMutationId
    }
  }
`;
