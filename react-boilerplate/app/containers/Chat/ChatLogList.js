/**
 *
 * ChatLogList
 *
 */

/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import { graphql } from 'react-apollo';
import ChatLogListQuery from 'graphql/ChatLogQuery';

import withModal from 'components/withModal';
import withNumberPaginator from 'components/withNumberPaginator';
import LoadingDots from 'components/LoadingDots';
import PaginatorBar from 'components/PaginatorBar';
import ChatMessage from './ChatMessage';

const ChatLogList = (props) => (
  <div>
    <PaginatorBar
      numPages={
        props.allChatmessagesLo
          ? Math.ceil(props.allChatmessagesLo.totalCount / props.itemsPerPage)
          : 0
      }
      currentPage={props.page}
      changePage={props.changePage}
      useQuery={false}
    />
    {props.loading && (
      <LoadingDots size={8} py={props.allChatmessagesLo ? 10 : 50} />
    )}
    {props.allChatmessagesLo &&
      props.allChatmessagesLo.edges.map((edge) => (
        <ChatMessage
          key={edge.node.id}
          {...edge.node}
          anonymous={props.anonymousUserId === edge.node.user.id}
        />
      ))}
  </div>
);

ChatLogList.propTypes = {
  loading: PropTypes.bool.isRequired,
  allChatmessagesLo: PropTypes.shape({
    edges: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
  }),
  anonymousUserId: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  itemsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  changePage: PropTypes.func.isRequired,
};

const withChatLogList = graphql(ChatLogListQuery, {
  options: ({ variables, page, itemsPerPage }) => ({
    variables: {
      limit: itemsPerPage,
      offset: itemsPerPage * (page - 1),
      ...variables,
    },
  }),
  props({ data }) {
    const { loading, allChatmessagesLo, refetch } = data;
    return {
      loading,
      allChatmessagesLo,
      refetch,
    };
  },
});

export default compose(
  withModal({
    header: 'Log',
    footer: {
      confirm: false,
      close: false,
    },
  }),
  withNumberPaginator({ useQuery: false }),
  withChatLogList,
)(ChatLogList);
