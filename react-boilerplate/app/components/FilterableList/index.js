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
import { updateQueryStr, setQueryStr } from 'common';

import { push } from 'react-router-redux';

import FilterVarSetPanel from './FilterVarSetPanel';
import { makeSelectQuery } from './selectors';

function filterQuery(filterList, query) {
  let filtered = {};
  filterList.forEach((filter) => {
    if (query[filter]) {
      filtered[filter] = query[filter];
    }
  });
  return filtered;
}

export const FilterableList = (props) => {
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
  const curOrder = query.order || order;
  const curFilter = filterQuery(filterList, query);

  const setFilter = (filters) =>
    props.goto(
      setQueryStr({
        ...filters,
        order: curOrder,
      }),
    );
  const setOrder = (nextOrder) => {
    props.goto(updateQueryStr({ order: nextOrder, page: 1 }));
  };

  return (
    <div>
      <FilterVarSetPanel
        filterList={filterList}
        orderList={orderList}
        order={curOrder}
        onOrderChange={setOrder}
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
  query: {},
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

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(FilterableList);
