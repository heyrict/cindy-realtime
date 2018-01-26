import { graphql } from 'react-relay';

const UpdateCommentMutation = graphql`
  mutation UpdateCommentMutation($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateCommentMutation;
