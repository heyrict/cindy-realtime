import gql from 'graphql-tag';

const UpdateCommentMutation = gql`
  mutation UpdateCommentMutation($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateCommentMutation;
