/*
 * ProfilePage Messages
 *
 * This contains all the text for the ProfilePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.ProfilePage.title',
    defaultMessage: 'User Profile',
  },
  description: {
    id: 'app.containers.ProfilePage.description',
    defaultMessage: 'Profile of a user',
  },
  heading: {
    id: 'app.containers.ProfilePage.heading',
    defaultMessage: "{nickname}'s Profile",
  },
  nickname: {
    id: 'app.containers.ProfilePage.nickname',
    defaultMessage: 'Nickname',
  },
  lastLogin: {
    id: 'app.containers.ProfilePage.lastLogin',
    defaultMessage: 'Last Login',
  },
  dateJoined: {
    id: 'app.containers.ProfilePage.dateJoined',
    defaultMessage: 'Joined Date',
  },
  profile: {
    id: 'app.containers.ProfilePage.profile',
    defaultMessage: 'Profile',
  },
  awardSelect: {
    id: 'app.containers.ProfilePage.awardSelect',
    defaultMessage: 'Award Select',
  },
});
