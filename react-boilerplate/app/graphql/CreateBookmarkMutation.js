import gql from 'graphql-tag';

export const CreateBookmarkMutation = gql`
  mutation CreateBookmarkMutation($input: CreateBookmarkInput!) {
    createBookmark(input: $input) {
      clientMutationId
    }
  }
`;

export default CreateBookmarkMutation;
