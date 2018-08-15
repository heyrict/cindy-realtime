import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { intlShape, FormattedMessage } from 'react-intl';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import LoadingDots from 'components/LoadingDots';

import messages from './messages';

function StarStaticsChart(props, context) {
  const _ = context.intl.formatMessage;
  const labelFormatter = (count) => `★${count}`;
  if (!props.truncValueGroups) {
    return <LoadingDots py={50} size={8} />;
  }
  if (props.truncValueGroups.edges.length < 1) {
    return <FormattedMessage {...messages.noStars} />;
  }
  return (
    <ResponsiveContainer width="95%" height={200}>
      <BarChart data={props.truncValueGroups.edges}>
        <Legend />
        <Bar
          dataKey="node.count"
          name={_(messages.starStaticsCount)}
          fill="#c6b571"
        />
        <Tooltip labelFormatter={labelFormatter} />
        <XAxis
          dataKey="node.value"
          domain={[0.5, 5.5]}
          ticks={[1, 2, 3, 4, 5]}
          type="number"
          tickFormatter={labelFormatter}
        />
        <YAxis dataKey="node.count" allowDecimals={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

StarStaticsChart.propTypes = {
  truncValueGroups: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  // eslint-disable-next-line react/no-unused-prop-types
  userId: PropTypes.string.isRequired,
};

StarStaticsChart.contextTypes = {
  intl: intlShape,
};

const withData = graphql(
  gql`
    query StarStaticsChartQuery($user: ID, $className: String) {
      truncValueGroups(user: $user, className: $className) {
        edges {
          node {
            value
            count
          }
        }
      }
    }
  `,
  {
    options: ({ userId }) => ({
      variables: {
        className: 'Star',
        user: userId,
      },
    }),
    props({ data }) {
      const { loading, truncValueGroups } = data;
      return {
        loading,
        truncValueGroups,
      };
    },
  },
);

export default compose(withData)(StarStaticsChart);
