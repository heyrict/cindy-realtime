import gql from 'graphql-tag';
import ScheduleFragment from './ScheduleFragment';

const ScheduleAddFormMutation = gql`
  mutation ScheduleAddFormMutation($input: CreateScheduleInput!) {
    createSchedule(input: $input) {
      schedule {
        ...ScheduleFragment_schedule
      }
    }
  }
  ${ScheduleFragment}
`;

export default ScheduleAddFormMutation;
