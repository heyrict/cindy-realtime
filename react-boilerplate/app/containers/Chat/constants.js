/*
 *
 * Chat constants
 *
 */

import { componentsUserFragment } from 'containers/PuzzleActiveList/constants';

export const TOGGLE_MINICHAT = 'app/Chat/TOGGLE_MINICHAT';

export const OPEN_MINICHAT = 'app/Chat/OPEN_MINICHAT';
export const CLOSE_MINICHAT = 'app/Chat/CLOSE_MINICHAT';

export const MINICHAT_CONNECT = 'ws/MINICHAT_CONNECT';
export const MINICHAT_DISCONNECT = 'ws/MINICHAT_DISCONNECT';

export const MINICHAT_MORE = 'app/Chat/MINICHAT_MORE';
export const MORE_MINICHAT = 'app/Chat/MORE_MINICHAT';

export const INIT_MINICHAT = 'app/Chat/INIT_MINICHAT';

export const minichatQuery = `
  query($channel: String!) {
    allMinichats(channel: $channel, last: 15) {
      pageInfo {
        startCursor
      }
      edges {
        node {
          id
          content
          user {
            ...components_user
          }
        }
      }
    }
  }
  ${componentsUserFragment}
`;

export const minichatMoreQuery = `
  query($channel: String!, $before: String!) {
    allMinichats(channel: $channel, last: 15, before: $before) {
      pageInfo {
        startCursor
      }
      edges {
        node {
          id
          content
          user {
            ...components_user
          }
        }
      }
    }
  }
  ${componentsUserFragment}
`;
