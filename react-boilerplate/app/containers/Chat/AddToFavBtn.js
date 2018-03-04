import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import bootbox from 'bootbox';
import { graphql } from 'react-apollo';
import createFavoriteChatRoomMutation from 'graphql/CreateFavoriteChatRoomMutation';

import { addFavoriteChatRoom } from './actions';

const FavBtn = styled.button`
  padding: 0;
  color: darkgoldenrod;
`;

function AddToFavBtn(props) {
  const handleSubmit = (dispatch) => {
    props
      .mutate({
        variables: {
          input: {
            chatroomName: props.chatroomName,
          },
        },
      })
      .then(() => {
        dispatch(addFavoriteChatRoom(props.chatroomName));
      })
      .catch((error) => {
        bootbox.alert(error.message);
      });
  };

  return (
    <FavBtn onClick={() => handleSubmit(props.dispatch)}>
      <Glyphicon glyph="star-empty" />
    </FavBtn>
  );
}

AddToFavBtn.propTypes = {
  chatroomName: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const withConnect = connect(mapDispatchToProps);

const withMutation = graphql(createFavoriteChatRoomMutation);

export default compose(withMutation, withConnect)(AddToFavBtn);
