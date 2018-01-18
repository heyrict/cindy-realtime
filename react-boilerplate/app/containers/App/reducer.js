import { fromJS } from 'immutable';

const initialState = fromJS({
  chatWidth: 0,
});

function chatReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default chatReducer;
