/*
 * DashBoardPage Messages
 *
 * This contains all the text for the DashBoardPage component.
 */
import { defineMessages } from 'react-intl';

const scope = 'app.containers.DashBoardPage';

export default defineMessages({
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'DashBoard',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'DashBoard - Cindy',
  },
  description: {
    id: `${scope}.description`,
    defaultMessage: 'Dashboard for Cindy',
  },
  schedule: {
    id: `${scope}.schedule`,
    defaultMessage: 'Schedule',
  },
  awardApplications: {
    id: `${scope}.awardApplications`,
    defaultMessage: 'Recent Award Applications',
  },
});
