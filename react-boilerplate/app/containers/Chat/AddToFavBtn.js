import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { nAlert } from 'containers/Notifier/actions';
import { graphql } from 'react-apollo';
import createFavoriteChatRoomMutation from 'graphql/CreateFavoriteChatRoomMutation';
import FavoriteChatRoomQuery from 'graphql/FavoriteChatRoomQuery';

import { addFavoriteChatRoom } from './actions';

const FavBtn = styled.button`
  padding: 0;
  color: darkgoldenrod;
`;

function AddToFavBtn(props) {
  const { userId, chatroomName, alert, addFavCR } = props;
  const handleSubmit = () => {
    props
      .mutate({
        variables: {
          input: {
            chatroomName,
          },
        },
        update(proxy, { data: { createFavoriteChatroom: { favchatroom } } }) {
          const data = proxy.readQuery({
            query: FavoriteChatRoomQuery,
            variables: { userId },
          });
          data.allFavoriteChatrooms.edges.push({
            __typename: 'FavoriteChatRoomNodeEdge',
            node: {
              __typename: 'FavoriteChatRoomNode',
              ...favchatroom,
            },
          });
          proxy.writeQuery({
            query: FavoriteChatRoomQuery,
            variables: { userId },
            data,
          });
        },
      })
      .then(() => {
        addFavCR(props.chatroomName);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return <FavBtn onClick={handleSubmit}>☆</FavBtn>;
}

AddToFavBtn.propTypes = {
  chatroomName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  addFavCR: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  addFavCR: (name) => dispatch(addFavoriteChatRoom(name)),
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(null, mapDispatchToProps);

const withMutation = graphql(createFavoriteChatRoomMutation);

export default compose(withMutation, withConnect)(AddToFavBtn);
