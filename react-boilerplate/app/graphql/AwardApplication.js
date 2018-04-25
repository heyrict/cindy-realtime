import gql from 'graphql-tag';
import UserLabel from './UserLabel';

export const AwardApplication = gql`
  fragment AwardApplication on AwardApplicationNode {
    id
    status
    comment
    reason
    award {
      id
      name
      description
    }
    applier {
      ...UserLabel_user
    }
    reviewer {
      ...UserLabel_user
    }
    created
    reviewed
  }
  ${UserLabel}
`;

export default AwardApplication;
