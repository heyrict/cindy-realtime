import { graphql } from 'react-relay';

const UpdateStarMutation = graphql`
  mutation UpdateStarMutation($input: UpdateStarInput!) {
    updateStar(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateStarMutation;
