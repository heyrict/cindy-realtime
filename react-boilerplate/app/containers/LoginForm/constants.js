/*
 *
 * LoginForm constants
 *
 */

import gql from 'graphql-tag';

export const DEFAULT_ACTION = 'app/LoginForm/DEFAULT_ACTION';

export const LoginMutation = gql`
  mutation LoginMutation($input: UserLoginInput!) {
    login(input: $input) {
      user {
        rowid
        nickname
      }
    }
  }
`;
