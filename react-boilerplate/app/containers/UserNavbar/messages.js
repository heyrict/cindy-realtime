/**
 *
 * UserNavbar
 *
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  onlineUsers: {
    id: 'app.containers.UserNavbar.onlineUsers',
    defaultMessage: 'Online users: {userCount}',
  },
  guestTitle: {
    id: 'app.containers.UserNavbar.guestTitle',
    defaultMessage: 'Hello guest!',
  },
  loggedInTitle: {
    id: 'app.containers.UserNavbar.loggedInTitle',
    defaultMessage: 'Welcome {nickname}!',
  },
  myprof: {
    id: 'app.containers.UserNavbar.myprof',
    defaultMessage: 'My Profile',
  },
  userlist: {
    id: 'app.containers.UserNavbar.userlist',
    defaultMessage: 'User List',
  },
  logout: {
    id: 'app.containers.UserNavbar.logout',
    defaultMessage: 'Logout',
  },
  login: {
    id: 'app.containers.UserNavbar.login',
    defaultMessage: 'Login',
  },
  register: {
    id: 'app.containers.UserNavbar.register',
    defaultMessage: 'Register',
  },
});
