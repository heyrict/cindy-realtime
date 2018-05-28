import { compose } from 'redux';
import { createSelector } from 'reselect';
import { selectLocation } from 'containers/App/selectors';
import { getQueryStr } from 'common';

const querySelect = (searchObj) => ({
  orderBy: searchObj.order,
  filterValue: searchObj.filterValue,
  filterKey: searchObj.filterKey,
});

export const makeSelectQuery = () =>
  createSelector(selectLocation, (location) =>
    compose(querySelect, getQueryStr)(location.search)
  );
