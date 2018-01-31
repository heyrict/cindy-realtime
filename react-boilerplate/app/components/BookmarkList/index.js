/**
 *
 * BookmarkList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { from_global_id as f } from 'common';
import { FormattedMessage } from 'react-intl';
import Relay from 'react-relay';
import { ButtonOutline } from 'style-store';

import PuzzlePanel from 'components/PuzzlePanel';
import BookmarkListFragment from 'graphql/BookmarkList';
import BookmarkListInitQuery from 'graphql/BookmarkListInitQuery';
import chatMessages from 'containers/Chat/messages';
import BookmarkLabel from './BookmarkLabel';

const StyledButtonOutline = ButtonOutline.extend`
  border-radius: 10px;
  padding: 10px 0;
`;

export class BookmarkList extends React.Component {
  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(10, (error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        {this.props.list.allBookmarks.edges.map((edge) => (
          <PuzzlePanel
            node={edge.node.puzzle}
            key={edge.node.id}
            additional={
              <BookmarkLabel
                value={edge.node.value}
                isCurrentUser={this.props.currentUserId === this.props.userId}
                bookmarkId={f(edge.node.id)[1]}
              />
            }
          />
        ))}
        {this.props.relay.hasMore() ? (
          <StyledButtonOutline onClick={this.loadMore} w={1}>
            <FormattedMessage {...chatMessages.loadMore} />
          </StyledButtonOutline>
        ) : (
          ''
        )}
      </div>
    );
  }
}

BookmarkList.propTypes = {
  relay: PropTypes.object.isRequired,
  list: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string,
};

const withBookmarkList = (Component) =>
  Relay.createPaginationContainer(Component, BookmarkListFragment, {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.list && props.list.allBookmarks;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        orderBy: fragmentVariables.orderBy,
        status: fragmentVariables.status,
        status__gt: fragmentVariables.status__gt,
        user: fragmentVariables.user,
      };
    },
    query: BookmarkListInitQuery,
  });

export default compose(withBookmarkList)(BookmarkList);
