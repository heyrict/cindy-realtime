import { graphql } from 'react-relay';

export const UpdateBookmarkMutation = graphql`
  mutation UpdateBookmarkMutation($input: UpdateBookmarkInput!) {
    updateBookmark(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateBookmarkMutation;
