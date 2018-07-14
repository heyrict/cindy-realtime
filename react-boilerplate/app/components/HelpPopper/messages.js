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
});
