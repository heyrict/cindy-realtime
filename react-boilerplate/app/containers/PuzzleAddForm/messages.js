/*
 * PuzzleAddForm Messages
 *
 * This contains all the text for the PuzzleAddForm component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  titleLabel: {
    id: 'app.containers.PuzzleAddForm.titleLabel',
    defaultMessage: 'Title',
  },
  genreLabel: {
    id: 'app.containers.PuzzleAddForm.genreLabel',
    defaultMessage: 'Genre',
  },
  yamiLabel: {
    id: 'app.containers.PuzzleAddForm.yamiLabel',
    defaultMessage: 'Yami',
  },
  contentLabel: {
    id: 'app.containers.PuzzleAddForm.contentLabel',
    defaultMessage: 'Content',
  },
  solutionLabel: {
    id: 'app.containers.PuzzleAddForm.solutionLabel',
    defaultMessage: 'Solution',
  },
  submitLabel: {
    id: 'app.containers.PuzzleAddForm.submitLabel',
    defaultMessage: 'Submit',
  },
  anonymousLabel: {
    id: 'app.containers.PuzzleAddForm.anonymousLabel',
    defaultMessage: 'Anonymous',
  },
  previewEditUsage: {
    id: 'app.containers.PuzzleAddForm.previewEditUsage',
    defaultMessage:
      '**Usage:**\n\n- Bold: `**bold**` -> **bold**\n- Multiple Newline: `<br />` -> ↩\n- Change Font: `<font color="red" size="3">font</font>` -> <font color="red" size="3">font</font>',
  },
});
