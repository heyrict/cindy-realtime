import { defineMessages } from 'react-intl';

export default defineMessages({
  wsConnected: {
    id: 'app.containers.Notifier.wsConnected',
    defaultMessage: 'Connected to server!',
  },
  wsDisconnected: {
    id: 'app.containers.Notifier.wsDisconnected',
    defaultMessage: 'Disconnected from server. Retrying...',
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
  open: {
    id: 'app.containers.Notifier.open',
    defaultMessage: 'Open',
  },
});
