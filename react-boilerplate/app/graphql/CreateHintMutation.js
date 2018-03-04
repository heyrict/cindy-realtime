import gql from 'graphql-tag';

const CreateHintMutation = gql`
  mutation CreateHintMutation($input: CreateHintInput!) {
    createHint(input: $input) {
      clientMutationId
    }
  }
`;

export default CreateHintMutation;
