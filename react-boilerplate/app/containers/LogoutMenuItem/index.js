/**
 *
 * LogoutMenuItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import environment from 'Environment';
import bootbox from 'bootbox';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { commitMutation, graphql } from 'react-relay';

import { MenuItem, Panel } from 'react-bootstrap';

import { setCurrentUser } from 'containers/NavbarUserDropdown/actions';

export class LogoutMenuItem extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
  }

  confirm() {
    commitMutation(environment, {
      mutation: LogoutMenuItemMutation,
      variables: { input: {} },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(
            errors.map((e) => (
              <Panel header={e.message} key={e.message} bsStyle="danger" />
            ))
          );
        } else if (response) {
          // TODO: Update Global User Interface here
          this.props.updateCurrentUser();
        }
      },
    });
  }

  render() {
    return (
      <MenuItem eventKey={this.props.eventKey} onClick={this.confirm}>
        {this.props.children}
      </MenuItem>
    );
  }
}

LogoutMenuItem.propTypes = {
  eventKey: PropTypes.number,
  children: PropTypes.node,
  updateCurrentUser: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateCurrentUser: () =>
      dispatch(
        setCurrentUser({
          userId: null,
          nickname: null,
        })
      ),
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(LogoutMenuItem);

const LogoutMenuItemMutation = graphql`
  mutation LogoutMenuItemMutation($input: UserLogoutInput!) {
    logout(input: $input) {
      clientMutationId
    }
  }
`;
