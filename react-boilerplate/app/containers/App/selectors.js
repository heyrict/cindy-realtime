import { createSelector } from 'reselect';

const selectRoute = (state) => state.get('route');

export const selectLocation = (state) => state.get('route').get('location');

export const makeSelectLocation = () =>
  createSelector(selectRoute, (routeState) =>
    routeState.get('location').toJS()
  );
