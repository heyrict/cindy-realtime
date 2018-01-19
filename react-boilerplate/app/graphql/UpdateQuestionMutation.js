import { graphql } from 'react-relay';

export const UpdateQuestionMutation = graphql`
  mutation UpdateQuestionMutation($input: UpdateQuestionInput!) {
    updateQuestion(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateQuestionMutation;
