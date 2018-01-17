import { graphql } from 'react-relay';

const CreateQuestionMutation = graphql`
  mutation CreateQuestionMutation($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      clientMutationId
    }
  }
`;

export default CreateQuestionMutation;
