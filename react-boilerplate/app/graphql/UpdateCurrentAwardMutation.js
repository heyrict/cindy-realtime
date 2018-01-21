import { graphql } from 'react-relay';

export const UpdateCurrentAwardMutation = graphql`
  mutation UpdateCurrentAwardMutation($input: UpdateCurrentAwardInput!) {
    updateCurrentAward(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateCurrentAwardMutation;
