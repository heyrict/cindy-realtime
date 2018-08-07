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
  puzzleCountChart: {
    id: `${scope}.puzzleCountChart`,
    defaultMessage: 'Puzzle Count Chart',
  },
  awardApplications: {
    id: `${scope}.awardApplications`,
    defaultMessage: 'Recent Award Applications',
  },
  chartUserPuzzleCount: {
    id: `${scope}.chartUserPuzzleCount`,
    defaultMessage: 'My Puzzle Count',
  },
  chartTotalPuzzleCount: {
    id: `${scope}.chartTotalPuzzleCount`,
    defaultMessage: 'Total Puzzle Count',
  },
  recentComments: {
    id: `${scope}.recentComments`,
    defaultMessage: 'Recent Comments',
  },
  commentHint: {
    id: `${scope}.commentHint`,
    defaultMessage:
      "New comment added on {puzzle_user}'s puzzle {puzzle_title}",
  },
  commentSpoiler: {
    id: `${scope}.commentSpoiler`,
    defaultMessage: '(Spoiler)',
  },
});
