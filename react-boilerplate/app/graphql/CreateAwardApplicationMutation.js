import gql from 'graphql-tag';
import AwardApplication from './AwardApplication';

export const CreateAwardApplicationMutation = gql`
  mutation CreateAwardApplicationMutation(
    $input: CreateAwardApplicationInput!
  ) {
    createAwardApplication(input: $input) {
      awardApplication {
        ...AwardApplication
      }
    }
  }
  ${AwardApplication}
`;

export default CreateAwardApplicationMutation;
