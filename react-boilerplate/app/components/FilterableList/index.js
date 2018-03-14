/**
 *
 * FilterableList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

import FilterVarSetPanel from './FilterVarSetPanel';

const getOrder = createSelector(
  (order) => order.toJS(),
  (orderList) => orderList.map(({ key, asc }) => (asc ? key : `-${key}`))
);

class FilterableList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      order: fromJS(this.props.order || []),
      filter: {},
    };
    this.setFilter = (filterKey, filterValue) =>
      this.setState({
        filter: { [filterKey]: filterValue },
      });
    this.handleOrderChange = (order) => {
      this.setState({ order });
    };
  }

  // {{{ render()
  render() {
    const {
      component: QueryList,
      variables,
      filter,
      filterList,
      order,
      orderList,
      ...others
    } = this.props;
    return (
      <div>
        <FilterVarSetPanel
          filterList={filterList}
          orderList={orderList}
          order={this.state.order}
          onOrderChange={this.handleOrderChange}
          onFilterChange={this.setFilter}
        />
        <QueryList
          variables={{
            orderBy: getOrder(this.state.order) || ['-id'],
            ...(this.state.filter || this.props.filter || {}),
            ...variables,
          }}
          {...others}
        />
      </div>
    );
  }
  // }}}
}

FilterableList.defaultProps = {
  variables: {},
  order: [],
  orderList: ['id', 'created'],
  filter: {},
  filterList: [],
};

FilterableList.propTypes = {
  component: PropTypes.any.isRequired,
  variables: PropTypes.object,
  order: PropTypes.array,
  orderList: PropTypes.array,
  filter: PropTypes.object,
  filterList: PropTypes.array,
};

export default FilterableList;
