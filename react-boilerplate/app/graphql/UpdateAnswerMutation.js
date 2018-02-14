import gql from 'graphql-tag';

const UpdateAnswerMutation = gql`
  mutation UpdateAnswerMutation($input: UpdateAnswerInput!) {
    updateAnswer(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateAnswerMutation;
