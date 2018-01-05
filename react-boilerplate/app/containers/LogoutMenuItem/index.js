/**
 *
 * LogoutMenuItem
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { graphql, withApollo } from "react-apollo";

import { MenuItem } from "react-bootstrap";

import { setCurrentUser } from "containers/NavbarUserDropdown/actions";
import { LogoutMutation } from "./constants";

export class LogoutMenuItem extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
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
    this.props.mutate({ variables: { input: {} } }).then(({ data, errors }) => {
      if (errors) {
        bootbox.alert(
          errors.map(e => (
            <Panel header={e.message} key={e.message} bsStyle="danger" />
          ))
        );
      } else if (data) {
        // TODO: Update Global User Interface here
        window.location.reload();
      }
    });
  }
}

LogoutMenuItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  updateCurrentUser: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateCurrentUser: () =>
      dispatch(
        setCurrentUser({
          userId: null,
          nickname: null
        })
      )
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withApollo,
  graphql(LogoutMutation, { options: { errorPolicy: "all" } }),
  withConnect
)(LogoutMenuItem);
