import gql from 'graphql-tag';

export const DeleteBookmarkMutation = gql`
  mutation DeleteBookmarkMutation($input: DeleteBookmarkInput!) {
    deleteBookmark(input: $input) {
      clientMutationId
    }
  }
`;

export default DeleteBookmarkMutation;
