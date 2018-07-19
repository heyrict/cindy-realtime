import gql from 'graphql-tag';
import UserLabel from 'graphql/UserLabel';

const ScheduleFragment = gql`
  fragment ScheduleFragment_schedule on ScheduleNode {
    id
    user {
      ...UserLabel_user
    }
    content
    created
    scheduled
  }
  ${UserLabel}
`;

export default ScheduleFragment;
