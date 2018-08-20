import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { intlShape, FormattedMessage } from 'react-intl';
import { Pie, PieChart, Sector, ResponsiveContainer } from 'recharts';
import LoadingDots from 'components/LoadingDots';

import messages from './messages';

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    name,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        ★{name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#c67182"
      >
        {value}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#ccc"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

class StarStaticsChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
    this.onPieEnter = (data, index) => {
      this.setState({
        activeIndex: index,
      });
    };
  }

  render() {
    const _ = this.context.intl.formatMessage;
    if (!this.props.truncValueGroups) {
      return <LoadingDots py={50} size={8} />;
    }
    if (this.props.truncValueGroups.edges.length < 1) {
      return <FormattedMessage {...messages.noStars} />;
    }
    const data = this.props.truncValueGroups.edges.map(
      ({ node: { count, value } }) => ({ count, value }),
    );
    data.sort((e1, e2) => e1.value - e2.value);

    return (
      <ResponsiveContainer width="95%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            name={_(messages.starStaticsCount)}
            nameKey="value"
            innerRadius={30}
            outerRadius={50}
            activeShape={renderActiveShape}
            activeIndex={this.state.activeIndex}
            onMouseEnter={this.onPieEnter}
            onClick={this.onPieEnter}
            fill="#c67182"
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
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
