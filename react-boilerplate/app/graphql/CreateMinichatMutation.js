import { graphql } from 'react-relay';

export const CreateMinichatMutation = graphql`
  mutation CreateMinichatMutation($input: CreateMinichatInput!) {
    createMinichat(input: $input) {
      clientMutationId
    }
  }
`;

export default CreateMinichatMutation;
