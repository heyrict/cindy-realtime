import { compose } from 'redux';
import { createSelector } from 'reselect';
import { selectLocation } from 'containers/App/selectors';
import { getQueryStr } from 'common';

export const makeSelectQuery = () =>
  createSelector(selectLocation, (location) =>
    compose(
      getQueryStr,
    )(location.get('search')),
  );
