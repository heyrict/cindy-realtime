import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import gql from 'graphql-tag';

import messages from './messages';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function PuzzleStaticChart(props, context) {
  if (!props.truncDateGroups) {
    return null;
  }

  return (
    <FormattedMessage {...messages.chartTotalPuzzleCount}>
      {(msg) => (
        <LineChart
          width={props.width}
          height={360}
          data={props.truncDateGroups.edges}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Legend />
          <Line type="monotone" dataKey="node.count" name={msg} />
          <Tooltip />
          <XAxis dataKey="node.timestop" />
          <YAxis />
        </LineChart>
      )}
    </FormattedMessage>
  );
}

PuzzleStaticChart.propTypes = {
  width: PropTypes.number,
  loading: PropTypes.bool.isRequired,
  truncDateGroups: PropTypes.object,
};

PuzzleStaticChart.defaultProps = {
  width: 450,
};

const withCindyData = graphql(
  gql`
    query CindyStaticByDateQuery(
      $className: String
      $by: String
      $created_Gte: DateTime
    ) {
      truncDateGroups(
        className: $className
        by: $by
        created_Gte: $created_Gte
      ) {
        edges {
          node {
            count
            timestop
          }
        }
      }
    }
  `,
  {
    options: () => {
      const now = moment();
      return {
        variables: {
          className: 'Puzzle',
          by: 'date',
          created_Gte: now.subtract(1, 'months').format(),
        },
      };
    },
    props({ data }) {
      const { loading, truncDateGroups } = data;
      return {
        loading,
        truncDateGroups,
      };
    },
  },
);

export default compose(withCindyData)(PuzzleStaticChart);
