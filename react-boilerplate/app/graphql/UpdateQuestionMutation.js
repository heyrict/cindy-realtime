import gql from 'graphql-tag';

export const UpdateQuestionMutation = gql`
  mutation UpdateQuestionMutation($input: UpdateQuestionInput!) {
    updateQuestion(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateQuestionMutation;
