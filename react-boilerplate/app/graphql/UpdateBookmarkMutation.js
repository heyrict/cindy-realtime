import gql from 'graphql-tag';

export const UpdateBookmarkMutation = gql`
  mutation UpdateBookmarkMutation($input: UpdateBookmarkInput!) {
    updateBookmark(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateBookmarkMutation;
