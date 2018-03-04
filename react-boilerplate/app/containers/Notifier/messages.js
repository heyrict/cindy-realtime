import { defineMessages } from 'react-intl';

export default defineMessages({
  wsConnect: {
    id: 'app.containers.Notifier.wsConnect',
    defaultMessage: 'Connected to server!',
  },
  puzzleAdded: {
    id: 'app.containers.Notifier.puzzleAdded',
    defaultMessage: 'A New Puzzle {title} is Added by {nickname}!',
  },
  directMessageReceived: {
    id: 'app.containers.Notifier.directMessageReceived',
    defaultMessage: '{nickname} sends a direct message to you!',
  },
  chatroomNotExists: {
    id: 'app.containers.Notifier.chatroomNotExists',
    defaultMessage: 'ChatRoom {name} does not exists.',
  },
  userawardAdded: {
    id: 'app.containers.Notifier.userawardAdded',
    defaultMessage: 'Congratulations to {nickname} for getting award {award}!',
  },
  open: {
    id: 'app.containers.Notifier.open',
    defaultMessage: 'Open',
  },
});
