/**
 *
 * ChatRoomList
 *
 */

/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import withNumberPaginator from 'components/withNumberPaginator';
import ChatRoomPanel from 'components/ChatRoomPanel';
import PaginatorBar from 'components/PaginatorBar';
import LoadingDots from 'components/LoadingDots';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import ChatRoomFragment from 'graphql/ChatRoom';

function ChatRoomList(props) {
  return (
    <div>
      {!props.loading &&
        props.allChatrooms && (
          <PaginatorBar
            useQuery={false}
            numPages={Math.ceil(
              props.allChatrooms.totalCount / props.itemsPerPage,
            )}
            currentPage={props.page}
            changePage={props.changePage}
          />
        )}
      {props.allChatrooms &&
        props.allChatrooms.edges.map((edge) => (
          <ChatRoomPanel
            node={edge.node}
            key={edge.node.id}
            tune={props.tune}
          />
        ))}
      {props.loading && (
        <LoadingDots py={props.allChatrooms ? 5 : 50} size={8} />
      )}
    </div>
  );
}

ChatRoomList.propTypes = {
  loading: PropTypes.bool.isRequired,
  allChatrooms: PropTypes.shape({
    edges: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
  }),
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // eslint-disable-next-line react/no-unused-prop-types
  itemsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  changePage: PropTypes.func.isRequired,
};

ChatRoomList.defaultProps = {
  page: 1,
  itemsPerPage: 10,
};

const withChatRoomList = graphql(
  gql`
    query PublicChatRoomList($private: Boolean, $limit: Int, $offset: Int) {
      allChatroomsLo(private: $private, limit: $limit, offset: $offset) {
        edges {
          node {
            ...ChatRoom
          }
        }
        totalCount
      }
    }
    ${ChatRoomFragment}
  `,
  {
    options: ({ variables, fetchPolicy, page, itemsPerPage }) => ({
      variables: {
        limit: itemsPerPage,
        offset: itemsPerPage * (page - 1),
        ...variables,
      },
      fetchPolicy,
    }),
    props({ data }) {
      const { loading, allChatroomsLo, refetch } = data;
      return {
        loading,
        allChatrooms: allChatroomsLo,
        refetch,
      };
    },
  },
);

export default compose(
  withNumberPaginator({}),
  withChatRoomList,
)(ChatRoomList);
