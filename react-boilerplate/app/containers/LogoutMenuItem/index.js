/**
 *
 * LogoutMenuItem
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { commitMutation } from "react-relay";
import environment from "Environment";

import { MenuItem } from "react-bootstrap";

import { setCurrentUser } from "containers/NavbarUserDropdown/actions";

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
    commitMutation(environment, {
      mutation: LogoutMenuItemMutation,
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
  withConnect
)(LogoutMenuItem);

const LogoutMenuItemMutation = graphql`
  mutation LogoutMenuItemMutation($input: UserLogoutInput!) {
    logout(input: $input) {
      clientMutationId
    }
  }
`;
