import gql from 'graphql-tag';

const CreateQuestionMutation = gql`
  mutation CreateQuestionMutation($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      dialogue {
        id
        created
      }
    }
  }
`;

export default CreateQuestionMutation;
