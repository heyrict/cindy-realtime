/**
 *
 * FilterableList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { updateQueryStr } from 'common';

import { push } from 'react-router-redux';

import FilterVarSetPanel from './FilterVarSetPanel';
import { makeSelectQuery } from './selectors';

const FilterableList = (props) => {
  const {
    component: QueryList,
    variables,
    filter,
    filterList,
    order,
    orderList,
    query,
    ...others
  } = props;
  const curOrder = query.orderBy || order;
  const curFilter = query.filterValue
    ? { [query.filterKey]: query.filterValue }
    : filter || {};

  const setFilter = (filterKey, filterValue) =>
    props.goto(
      updateQueryStr({
        filterKey,
        filterValue,
        page: 1,
      })
    );
  const handleOrderChange = (nextOrder) => {
    props.goto(updateQueryStr({ order: nextOrder, page: 1 }));
  };

  return (
    <div>
      <FilterVarSetPanel
        filterList={filterList}
        orderList={orderList}
        order={curOrder}
        onOrderChange={handleOrderChange}
        onFilterChange={setFilter}
      />
      <QueryList
        variables={{
          orderBy: curOrder || '-id',
          ...(curFilter || filter),
          ...variables,
        }}
        {...others}
      />
    </div>
  );
};

FilterableList.defaultProps = {
  variables: {},
  order: '',
  orderList: ['id', 'created'],
  filter: {},
  filterList: [],
};

FilterableList.propTypes = {
  component: PropTypes.any.isRequired,
  variables: PropTypes.object,
  order: PropTypes.string.isRequired,
  orderList: PropTypes.array,
  filter: PropTypes.object,
  filterList: PropTypes.array,
  query: PropTypes.object,
  goto: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  query: makeSelectQuery(),
});

const mapDispatchToProps = (dispatch) => ({
  goto: (link) => dispatch(push(link)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(FilterableList);
