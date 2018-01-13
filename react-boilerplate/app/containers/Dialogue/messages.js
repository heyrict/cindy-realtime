/*
 * Dialogue Messages
 *
 * This contains all the text for the Dialogue component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  waiting: {
    id: 'app.containers.Dialogue.waiting',
    defaultMessage: 'Waiting to be answered...',
  },
  good: {
    id: 'app.containers.Dialogue.good',
    defaultMessage: 'Good Question',
  },
  true: {
    id: 'app.containers.Dialogue.true',
    defaultMessage: 'True Answer',
  },
  edit: {
    id: 'app.containers.Dialogue.edit',
    defaultMessage: 'Edit',
  },
  answerInputHint: {
    id: 'app.containers.Dialogue.answerInputHint',
    defaultMessage: 'Put your answer',
  },
});
