import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { commitMutation } from 'react-relay';
import { Glyphicon } from 'react-bootstrap';
import environment from 'Environment';
import bootbox from 'bootbox';
import deleteFavoriteChatRoomMutation from 'graphql/DeleteFavoriteChatRoomMutation';

import { removeFavoriteChatRoom } from './actions';

const FavBtn = styled.button`
  padding: 0;
  color: darkgoldenrod;
`;

function DeleteFromFavBtn(props) {
  const handleSubmit = (dispatch) => {
    commitMutation(environment, {
      mutation: deleteFavoriteChatRoomMutation,
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
        dispatch(removeFavoriteChatRoom(props.chatroomName));
      },
    });
  };

  return (
    <FavBtn onClick={() => handleSubmit(props.dispatch)}>
      <Glyphicon glyph="star" />
    </FavBtn>
  );
}

DeleteFromFavBtn.propTypes = {
  chatroomName: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapDispatchToProps)(DeleteFromFavBtn);
