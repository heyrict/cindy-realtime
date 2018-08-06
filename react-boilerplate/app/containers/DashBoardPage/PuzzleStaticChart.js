import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import { intlShape } from 'react-intl';
import moment from 'moment';
import gql from 'graphql-tag';

import {
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import LoadingDots from 'components/LoadingDots';

import messages from './messages';

function PuzzleStaticChart(props, context) {
  const _ = context.intl.formatMessage;
  const now = moment();
  const formatTime = (edge) => ({
    node: {
      ...edge.node,
      timestop: moment(edge.node.timestop).unix() - now.unix(),
    },
  });

  if (!props.truncDateGroupsCindy) {
    return <LoadingDots />;
  }
  let data = props.truncDateGroupsCindy.edges;
  if (props.truncDateGroupsUser) {
    data = props.truncDateGroupsCindy.edges.map((edge) => {
      const matched = props.truncDateGroupsUser.edges.find(
        (e) => e.node.timestop === edge.node.timestop,
      );
      return {
        node: {
          ...edge.node,
          usercount: matched ? matched.node.count : 0,
        },
      };
    });
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart>
        <CartesianGrid strokeDasharray="3 3" />
        <Legend />
        {props.truncDateGroupsUser && (
          <Line
            data={data
              .map(formatTime)
              .sort((a, b) => a.node.timestop - b.node.timestop)}
            stroke="#a02d92"
            dataKey="node.usercount"
            name={_(messages.chartUserPuzzleCount)}
            type="monotone"
          />
        )}
        {props.truncDateGroupsCindy && (
          <Line
            data={data
              .map(formatTime)
              .sort((a, b) => a.node.timestop - b.node.timestop)}
            dataKey="node.count"
            name={_(messages.chartTotalPuzzleCount)}
            type="monotone"
          />
        )}
        <Tooltip />
        <XAxis
          dataKey="node.timestop"
          type="number"
          tickFormatter={(timestr) =>
            moment.unix(now.unix() + timestr).format('YYYY-MM-DD')
          }
          allowDuplicatedCategory={false}
        />
        <YAxis dataKey="node.count" />
      </LineChart>
    </ResponsiveContainer>
  );
}

PuzzleStaticChart.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  truncDateGroupsCindy: PropTypes.object,
  truncDateGroupsUser: PropTypes.object,
};

PuzzleStaticChart.contextTypes = {
  intl: intlShape,
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
        truncDateGroupsCindy: truncDateGroups,
      };
    },
  },
);

const withUserData = graphql(
  gql`
    query UserStaticByDateQuery(
      $className: String
      $by: String
      $user: ID
      $created_Gte: DateTime
    ) {
      truncDateGroups(
        className: $className
        by: $by
        user: $user
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
    options: ({ currentUserId }) => {
      const now = moment();
      return {
        variables: {
          className: 'Puzzle',
          by: 'date',
          user: currentUserId,
          created_Gte: now.subtract(1, 'months').format(),
        },
      };
    },
    props({ data }) {
      const { loading, truncDateGroups } = data;
      return {
        loading,
        truncDateGroupsUser: truncDateGroups,
      };
    },
  },
);

export default compose(
  withCindyData,
  withUserData,
)(PuzzleStaticChart);
