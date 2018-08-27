import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { nAlert } from 'containers/Notifier/actions';
import { ImgXs } from 'style-store';
import star from 'images/star.svg';

import { graphql } from 'react-apollo';
import deleteFavoriteChatRoomMutation from 'graphql/DeleteFavoriteChatRoomMutation';
import FavoriteChatRoomQuery from 'graphql/FavoriteChatRoomQuery';

import { removeFavoriteChatRoom } from './actions';

const FavBtn = styled.button`
  padding: 0;
  color: darkgoldenrod;
`;

function DeleteFromFavBtn(props) {
  const { alert, mutate, rmFavCR, chatroomName, userId } = props;
  const handleSubmit = () => {
    mutate({
      variables: {
        input: {
          chatroomName,
        },
      },
      update(proxy) {
        const data = proxy.readQuery({
          query: FavoriteChatRoomQuery,
          variables: { userId },
        });
        const index = data.allFavoriteChatrooms.edges.findIndex(
          (edge) => edge.node.chatroom.name === chatroomName,
        );
        if (index > -1) {
          data.allFavoriteChatrooms.edges.splice(index, 1);
          proxy.writeQuery({
            query: FavoriteChatRoomQuery,
            variables: { userId },
            data,
          });
        }
      },
    })
      .then(() => {
        rmFavCR(chatroomName);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <FavBtn onClick={handleSubmit}>
      <ImgXs alt="star" src={star} />
    </FavBtn>
  );
}

DeleteFromFavBtn.propTypes = {
  chatroomName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  rmFavCR: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  rmFavCR: (name) => dispatch(removeFavoriteChatRoom(name)),
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withMutation = graphql(deleteFavoriteChatRoomMutation);

export default compose(
  withMutation,
  withConnect,
)(DeleteFromFavBtn);
