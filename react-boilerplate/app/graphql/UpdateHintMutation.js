import { graphql } from 'react-relay';

const UpdateHintMutation = graphql`
  mutation UpdateHintMutation($input: UpdateHintInput!) {
    updateHint(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateHintMutation
