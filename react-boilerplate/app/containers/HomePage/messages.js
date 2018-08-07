/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

const scope = 'app.containers.HomePage';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Cindy: A lateral thinking salon for every one!',
  },
  description: {
    id: `${scope}.description`,
    defaultMessage:
      'Find interesting lateral thinking puzzles here, share with your friends, and even create your own lateral thinking puzzle in minites!',
  },
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Welcome to {cindy}!',
  },
  body: {
    id: `${scope}.body`,
    defaultMessage:
      'Cindy is an active community for chatting lateral thinking problems.',
  },
  start: {
    id: `${scope}.start`,
    defaultMessage: 'Start',
  },
  bestPuzzleOfLastMonth: {
    id: `${scope}.bestPuzzleOfLastMonth`,
    defaultMessage: 'Most Valuable Puzzles of the Last Month',
  },
});
