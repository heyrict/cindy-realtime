/**
 *
 * PuzzleFilterableList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer } from 'react-relay';
import environment from 'Environment';
import { RoundedPanel } from 'style-store';
import { Flex, Box } from 'rebass';

import LoadingDots from 'components/LoadingDots';
import PuzzleList from 'components/PuzzleList';
import PuzzleListInitQuery from 'graphql/PuzzleListInitQuery';

import FilterButton from './FilterButton';

class PuzzleFilterableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: props.order || [{ key: 'id', asc: false }],
    };
    this.getOrder = this.getOrder.bind(this);
    this.reverseOrder = this.reverseOrder.bind(this);
    this.handleMainButtonClick = this.handleMainButtonClick.bind(this);
    this.handleSortButtonClick = this.handleSortButtonClick.bind(this);
  }
  getOrder() {
    let orderBy = [];
    this.state.order.forEach(({ key, asc }) => {
      if (asc) {
        orderBy = orderBy.concat(key);
      } else {
        orderBy = orderBy.concat(`-${key}`);
      }
    });
    return orderBy;
  }
  reverseOrder() {
    const returns = {};
    this.state.order.forEach(({ key, asc }, index) => {
      returns[key] = { index, asc };
    });
    return returns;
  }
  handleMainButtonClick(name) {
    this.setState((state) => {
      let exist = false;
      let order = [];
      state.order.forEach((obj) => {
        if (obj.key !== name) {
          order = order.concat(obj);
        } else {
          exist = true;
        }
      });
      if (!exist) {
        order = order.concat({ key: name, asc: false });
      }
      return { ...state, order };
    });
  }
  handleSortButtonClick(name) {
    this.setState((state) => ({
      order: state.order.map(
        ({ key, asc }) => (name === key ? { key, asc: !asc } : { key, asc })
      ),
    }));
  }
  render() {
    const reverseOrder = this.reverseOrder();
    return (
      <div>
        <RoundedPanel>
          <Flex wrap justify="center" align="center">
            {this.props.orderList.map((name, index) => (
              <Flex wrap align="center" key={name}>
                <Box>{index !== 0 && '・'}</Box>
                <FilterButton
                  name={name}
                  {...reverseOrder[name]}
                  onMainButtonClick={this.handleMainButtonClick}
                  onSortButtonClick={this.handleSortButtonClick}
                />
              </Flex>
            ))}
          </Flex>
        </RoundedPanel>
        <QueryRenderer
          environment={environment}
          component={PuzzleList}
          query={PuzzleListInitQuery}
          variables={{
            orderBy: this.getOrder(),
            count: 10,
            ...this.props.variables,
          }}
          render={(raw) => {
            const error = raw.error;
            const p = raw.props;
            if (error) {
              return <div>{error.message}</div>;
            } else if (p) {
              return <PuzzleList list={p} />;
            }
            return <LoadingDots />;
          }}
        />
      </div>
    );
  }
}

PuzzleFilterableList.defaultProps = {
  variables: {},
  order: [],
  orderList: ['created', 'modified', 'starCount'],
  filter: {},
};

PuzzleFilterableList.propTypes = {
  variables: PropTypes.object,
  order: PropTypes.array,
  orderList: PropTypes.array,
  filter: PropTypes.object,
};

export default PuzzleFilterableList;
