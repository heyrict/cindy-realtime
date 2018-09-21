/**
 *
 * LogoutMenuItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { nAlert } from 'containers/Notifier/actions';
import { setCurrentUser } from 'containers/UserNavbar/actions';

import { Panel, PanelHeader } from 'rebass';
import { NavLink } from 'style-store';

import { graphql } from 'react-apollo';
import LogoutMenuItemMutation from 'graphql/LogoutMutation';

export class LogoutMenuItem extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
  }

  confirm() {
    this.props
      .mutate({
        variables: { input: {} },
      })
      .then(() => {
        this.props.updateCurrentUser();
      })
      .catch((error) => {
        this.props.alert(
          <Panel key={error.message} color="tomato">
            <PanelHeader>{error.message}</PanelHeader>
          </Panel>,
        );
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
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
  updateCurrentUser: () =>
    dispatch(
      setCurrentUser({
        userId: null,
        nickname: null,
      }),
    ),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withLogout = graphql(LogoutMenuItemMutation);

export default compose(
  withLogout,
  withConnect,
)(LogoutMenuItem);
