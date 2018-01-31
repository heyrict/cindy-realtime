import { graphql } from 'react-relay';

export const CreateBookmarkMutation = graphql`
  mutation CreateBookmarkMutation($input: CreateBookmarkInput!) {
    createBookmark(input: $input) {
      clientMutationId
    }
  }
`;

export default CreateBookmarkMutation;
