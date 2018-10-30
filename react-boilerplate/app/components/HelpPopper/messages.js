/*
 * HelpPopper Messages
 *
 * This contains all the text for the HelpPopper component.
 */
import { defineMessages } from 'react-intl';

const scope = 'app.components.HelpPopper';

export default defineMessages({
  puzzle_genre: {
    id: `${scope}.puzzle_genre`,
    defaultMessage: '**Genre**: Type of lateral thinking puzzle',
  },
  puzzle_yami: {
    id: `${scope}.puzzle_yami`,
    defaultMessage:
      "**Yami**: Whether a paticipant can view other paticipants' questions",
  },
  puzzle_content: {
    id: `${scope}.puzzle_content`,
    defaultMessage: '**Content**: The content of lateral thinking puzzle',
  },
  puzzle_solution: {
    id: `${scope}.puzzle_solution`,
    defaultMessage: '**Solution**: The solution to the puzzle',
  },
  puzzle_anonymous: {
    id: `${scope}.puzzle_anonymous`,
    defaultMessage:
      '**Anonymous**: Whether to show your identity *before puzzle is solved*. After the puzzle is solved, your identity will be opened to public.',
  },
  puzzle_grotesque: {
    id: `${scope}.puzzle_grotesque`,
    defaultMessage:
      '**Grotesque**: Whether the solution contain grotesque features. Your solution will be automatically masked if this option is selected.',
  },
  puzzle_dazedOn: {
    id: `${scope}.puzzle_dazedOn`,
    defaultMessage:
      '**Dazed On**: In case you have some incidents in real-life and cannot put the solution in time, after the selected *dazed_on* time, the puzzle will be automatically marked as `dazed`.\nYou can update the *dazed_on* date after you put the question.',
  },
  dashboard_schedule: {
    id: `${scope}.dashboard_schedule`,
    defaultMessage:
      'Post up to 3 messages for finding Soup Partners, broadcasting information, announcing events in advance and so on.',
  },
});
