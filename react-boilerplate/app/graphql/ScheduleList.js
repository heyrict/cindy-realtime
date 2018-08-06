import gql from 'graphql-tag';
import ScheduleFragment from 'graphql/ScheduleFragment';

const ScheduleListQuery = gql`
  query ScheduleListQuery($orderBy: [String], $scheduled_Gt: DateTime) {
    allSchedules(orderBy: $orderBy, scheduled_Gt: $scheduled_Gt)
      @connection(key: "ScheduleList__allSchedules", filter: []) {
      edges {
        node {
          ...ScheduleFragment_schedule
        }
      }
    }
  }
  ${ScheduleFragment}
`;

export default ScheduleListQuery;
