/*
 * CommentList Messages
 *
 * This contains all the text for the CommentList component.
 */

import { defineMessages } from 'react-intl';

const scope = 'app.components.CommentList';

export default defineMessages({
  commentHint: {
    id: `${scope}.commentHint`,
    defaultMessage:
      "New comment added on {puzzle_user}'s puzzle {puzzle_title}",
  },
  commentDescribe: {
    id: `${scope}.commentDescribe`,
    defaultMessage:
      "{user} adds a comment on {puzzle_user}'s puzzle {puzzle_title}",
  },
  commentNoUser: {
    id: `${scope}.commentNoUser`,
    defaultMessage: '{puzzle_title} by {puzzle_user}',
  },
  commentNoPuzzleUser: {
    id: `${scope}.commentNoPuzzleUser`,
    defaultMessage: '{puzzle_title} commented by {user}',
  },
  commentSpoiler: {
    id: `${scope}.commentSpoiler`,
    defaultMessage: '(Spoiler)',
  },
});
