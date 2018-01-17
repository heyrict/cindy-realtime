import { graphql } from 'react-relay';

const CreateHintMutation = graphql`
  mutation CreateHintMutation($input: CreateHintInput!) {
    createHint(input: $input) {
      clientMutationId
    }
  }
`;

export default CreateHintMutation;
