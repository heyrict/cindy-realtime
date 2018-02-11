import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { commitMutation } from 'react-relay';
import environment from 'Environment';
import bootbox from 'bootbox';
import { EditButton } from 'style-store';
import createFavoriteChatRoomMutation from 'graphql/CreateFavoriteChatRoomMutation';

import { addFavoriteChatRoom } from './actions';

function AddToFavBtn(props) {
  const handleSubmit = (dispatch) => {
    commitMutation(environment, {
      mutation: createFavoriteChatRoomMutation,
      variables: {
        input: {
          chatroomName: props.chatroomName,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
          return;
        }
        dispatch(addFavoriteChatRoom(props.chatroomName));
      },
    });
  };

  return (
    <EditButton
      onClick={() => handleSubmit(props.dispatch)}
      style={{ padding: '2px', fontSize: '1.1em' }}
    >
      ♥
    </EditButton>
  );
}

AddToFavBtn.propTypes = {
  chatroomName: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapDispatchToProps)(AddToFavBtn);
