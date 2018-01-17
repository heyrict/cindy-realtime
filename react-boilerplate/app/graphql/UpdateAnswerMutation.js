import { graphql } from 'react-relay';

const UpdateAnswerMutation = graphql`
  mutation UpdateAnswerMutation($input: UpdateAnswerInput!) {
    updateAnswer(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateAnswerMutation;
