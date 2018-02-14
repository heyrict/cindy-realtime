import gql from 'graphql-tag';

const UpdateHintMutation = gql`
  mutation UpdateHintMutation($input: UpdateHintInput!) {
    updateHint(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateHintMutation
