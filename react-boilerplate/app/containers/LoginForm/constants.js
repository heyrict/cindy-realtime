/*
 *
 * LoginForm constants
 *
 */

import gql from 'graphql-tag';

export const SHOW_MODAL = 'app/LoginForm/SHOW_MODAL';

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
