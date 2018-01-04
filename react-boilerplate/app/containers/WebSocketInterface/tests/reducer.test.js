
import { fromJS } from 'immutable';
import webSocketInterfaceReducer from '../reducer';

describe('webSocketInterfaceReducer', () => {
  it('returns the initial state', () => {
    expect(webSocketInterfaceReducer(undefined, {})).toEqual(fromJS({}));
  });
});
