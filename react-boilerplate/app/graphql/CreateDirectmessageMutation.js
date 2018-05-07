import gql from 'graphql-tag';
import UserLabel from './UserLabel';

export const CreateDirectmessageMutation = gql`
  mutation CreateDirectmessageMutation($input: CreateDirectMessageInput!) {
    createDirectmessage(input: $input) {
      directmessage {
        id
        created
        receiver {
          ...UserLabel_user
        }
      }
    }
  }
  ${UserLabel}
`;

export default CreateDirectmessageMutation;
