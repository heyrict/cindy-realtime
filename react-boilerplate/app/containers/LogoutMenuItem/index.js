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

import { Panel, PanelHeader, NavLink } from 'rebass';

import { setCurrentUser } from 'containers/UserNavbar/actions';

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
              <Panel key={e.message} color="tomato">
                <PanelHeader>{e.message}</PanelHeader>
              </Panel>
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
      <NavLink onClick={this.confirm} role="button" tabIndex="-1">
        {this.props.children}
      </NavLink>
    );
  }
}

LogoutMenuItem.propTypes = {
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
