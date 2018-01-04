/*
 *
 * LogoutMenuItem constants
 *
 */

import gql from "graphql-tag"

export const LogoutMutation = gql`
  mutation LogoutMutation($input: UserLogoutInput!) {
    logout(input: $input) {
      clientMutationId
    }
  }
`;

