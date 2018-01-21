/**
 *
 * UserNavbar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { SubNavbar, RouterLink } from 'style-store';
import { NavLink } from 'rebass';
import LoginMenuItem from 'containers/LoginMenuItem';
import LogoutMenuItem from 'containers/LogoutMenuItem';
import RegisterMenuItem from 'containers/RegisterMenuItem';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import makeSelectUserNavbar from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import { connectViewer, disconnectViewer } from './actions';

export class UserNavbar extends React.Component {
  componentDidMount() {
    this.props.dispatch(connectViewer());
  }

  componentWillUnmount() {
    this.props.dispatch(disconnectViewer());
  }

  render() {
    const onlineViewerNumTitle = (
      <FormattedMessage
        {...messages.onlineUsers}
        values={{
          userCount: this.props.usernavbar.onlineViewerCount,
        }}
      />
    );
    const welcomeTitle = (
      <FormattedMessage
        {...messages.loggedInTitle}
        values={{
          nickname: this.props.usernavbar.user.nickname,
        }}
      />
    );
    if (this.props.usernavbar.user.userId) {
      return (
        <SubNavbar
          mx={-2}
          style={{ display: this.props.open ? 'block' : 'none' }}
        >
          <RouterLink
            to={`/profile/show/${this.props.usernavbar.user.userId}`}
            tabIndex="0"
          >
            <NavLink is="span">
              <FormattedMessage {...messages.myprof} />
            </NavLink>
          </RouterLink>
          <LogoutMenuItem>
            <FormattedMessage {...messages.logout} />
          </LogoutMenuItem>
          <NavLink is="span">
            {welcomeTitle}
            {'  '}
            {onlineViewerNumTitle}
          </NavLink>
        </SubNavbar>
      );
    }
    return (
      <SubNavbar
        mx={-2}
        style={{ display: this.props.open ? 'block' : 'none' }}
      >
        <LoginMenuItem>
          <FormattedMessage {...messages.login} />
        </LoginMenuItem>
        <RegisterMenuItem>
          <FormattedMessage {...messages.register} />
        </RegisterMenuItem>
        <NavLink is="span">{onlineViewerNumTitle}</NavLink>
      </SubNavbar>
    );
  }
}

UserNavbar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  usernavbar: PropTypes.object,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  usernavbar: makeSelectUserNavbar(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'userNavbar', reducer });
const withSaga = injectSaga({ key: 'userNavbar', saga });

export default compose(withReducer, withSaga, withConnect)(UserNavbar);
