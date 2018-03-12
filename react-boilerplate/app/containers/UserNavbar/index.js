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
import SettingsMenuItem from 'containers/Settings/SettingsMenuItem';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import makeSelectUserNavbar from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

function UserNavbar(props) {
  const onlineViewerNumTitle = (
    <FormattedMessage
      {...messages.onlineUsers}
      values={{
        userCount: props.usernavbar.onlineViewerCount,
      }}
    />
  );
  const welcomeTitle = (
    <FormattedMessage
      {...messages.loggedInTitle}
      values={{
        nickname: props.usernavbar.user.nickname,
      }}
    />
  );
  if (props.usernavbar.user.userId) {
    return (
      <SubNavbar mx={-2} style={{ display: props.open ? 'block' : 'none' }}>
        <RouterLink
          to={`/profile/show/${props.usernavbar.user.userId}`}
          tabIndex="0"
        >
          <NavLink is="span">
            <FormattedMessage {...messages.myprof} />
          </NavLink>
        </RouterLink>
        <RouterLink to="/profile" tabIndex="0">
          <NavLink is="span">
            <FormattedMessage {...messages.userlist} />
          </NavLink>
        </RouterLink>
        <RouterLink to="/profile/award" tabIndex="0">
          <NavLink is="span">
            <FormattedMessage {...messages.awardApplication} />
          </NavLink>
        </RouterLink>
        <SettingsMenuItem>
          <FormattedMessage {...messages.settings} />
        </SettingsMenuItem>
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
    <SubNavbar mx={-2} style={{ display: props.open ? 'block' : 'none' }}>
      <RouterLink to="/profile" tabIndex="0">
        <NavLink is="span">
          <FormattedMessage {...messages.userlist} />
        </NavLink>
      </RouterLink>
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

UserNavbar.propTypes = {
  usernavbar: PropTypes.object,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  usernavbar: makeSelectUserNavbar(),
});

const withConnect = connect(mapStateToProps);

const withReducer = injectReducer({ key: 'userNavbar', reducer });
const withSaga = injectSaga({ key: 'userNavbar', saga });

export default compose(withReducer, withSaga, withConnect)(UserNavbar);
