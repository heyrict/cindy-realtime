/**
 *
 * ScheduleList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import { graphql } from 'react-apollo';
import ScheduleListQuery from 'graphql/ScheduleList';

import LoadingDots from 'components/LoadingDots';
import SchedulePanel from './SchedulePanel';

function ScheduleList(props) {
  return (
    <div>
      {props.allSchedules &&
        props.allSchedules.edges.map((edge) => (
          <SchedulePanel node={edge.node} key={edge.node.id} />
        ))}
      {props.loading && (
        <LoadingDots py={props.allSchedules ? 5 : 50} size={8} />
      )}
    </div>
  );
}

ScheduleList.propTypes = {
  loading: PropTypes.bool.isRequired,
  allSchedules: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
};

const withScheduleList = graphql(
  ScheduleListQuery,
  {
    options: ({ variables, fetchPolicy }) => ({
      variables: {
        ...variables,
      },
      fetchPolicy,
    }),
    props({ data }) {
      const { loading, allSchedules } = data;
      return {
        loading,
        allSchedules,
      };
    },
  }
);

export default compose(withScheduleList)(ScheduleList);
