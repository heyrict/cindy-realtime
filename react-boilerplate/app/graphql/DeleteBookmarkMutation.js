import { graphql } from 'react-relay';

export const DeleteBookmarkMutation = graphql`
  mutation DeleteBookmarkMutation($input: DeleteBookmarkInput!) {
    deleteBookmark(input: $input) {
      clientMutationId
    }
  }
`;

export default DeleteBookmarkMutation;
