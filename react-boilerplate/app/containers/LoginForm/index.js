/**
 *
 * LoginForm
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import { graphql, withApollo } from "react-apollo";

import { Form, FormControl, Panel } from "react-bootstrap";
import FieldGroup from "components/FieldGroup";

import injectReducer from "utils/injectReducer";
import makeSelectLoginForm from "./selectors";
import reducer from "./reducer";
import messages from "./messages";
import { LoginMutation } from "./constants";
import { setCurrentUser } from "containers/NavbarUserDropdown/actions";

export class LoginForm extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
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
    this.props
      .mutate({
        variables: { input: { username: username, password: password } }
      })
      .then(({ data, errors }) => {
        if (errors) {
          this.setState({ errorMsg: errors });
        } else if (data) {
          const user = data.login.user;
          // TODO: Update Global User Interface here
          this.props.updateCurrentUser({
            userId: user.rowid,
            nickname: user.nickname
          });
        }
      });
  }
  // }}}
}

LoginForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  updateCurrentUser: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  loginform: makeSelectLoginForm()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateCurrentUser: user => {
      dispatch(setCurrentUser(user));
    }
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: "loginForm", reducer });

export default compose(
  withApollo,
  graphql(LoginMutation, { options: { errorPolicy: "all" } }),
  withReducer,
  withConnect
)(LoginForm);
