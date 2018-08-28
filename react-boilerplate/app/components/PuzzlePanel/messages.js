import { defineMessages } from 'react-intl';

const scope = 'app.components.PuzzlePanel';

export default defineMessages({
  status_0: {
    id: `${scope}.status_0`,
    defaultMessage: 'unsolved',
  },
  status_1: {
    id: `${scope}.status_1`,
    defaultMessage: 'solved',
  },
  status_2: {
    id: `${scope}.status_2`,
    defaultMessage: 'dazed',
  },
  status_3: {
    id: `${scope}.status_3`,
    defaultMessage: 'hidden',
  },
  status_4: {
    id: `${scope}.status_4`,
    defaultMessage: 'forced hidden',
  },
});
