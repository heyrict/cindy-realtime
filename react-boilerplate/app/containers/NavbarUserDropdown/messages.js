/**
 *
 * NavbarUserDropdown
 *
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  onlineUsers: {
    id: 'app.containers.NavbarUserDropdown.onlineUsers',
    defaultMessage: 'Online users: {userCount}',
  },
  guestTitle: {
    id: 'app.containers.NavbarUserDropdown.guestTitle',
    defaultMessage: 'Hello guest!',
  },
  loggedInTitle: {
    id: 'app.containers.NavbarUserDropdown.loggedInTitle',
    defaultMessage: 'Welcome {nickname}!',
  },
});
