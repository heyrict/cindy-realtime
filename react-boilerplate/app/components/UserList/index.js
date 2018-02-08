/**
 *
 * UserList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import Relay from 'react-relay';
import { ButtonOutline } from 'style-store';

import UserPanel from 'components/UserPanel';
import UserListFragment from 'graphql/UserList';
import UserListInitQuery from 'graphql/UserListInitQuery';
import chatMessages from 'containers/Chat/messages';

const StyledButtonOutline = ButtonOutline.extend`
  border-radius: 10px;
  padding: 10px 0;
`;

export class UserList extends React.Component {
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
        {this.props.list.allUsers.edges.map((edge) => (
          <UserPanel node={edge.node} key={edge.node.id} />
        ))}
        {this.props.relay.hasMore() && (
          <StyledButtonOutline onClick={this.loadMore} w={1}>
            <FormattedMessage {...chatMessages.loadMore} />
          </StyledButtonOutline>
        )}
      </div>
    );
  }
}

UserList.propTypes = {
  relay: PropTypes.object.isRequired,
  list: PropTypes.object.isRequired,
};

const withUserList = (Component) =>
  Relay.createPaginationContainer(Component, UserListFragment, {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.list && props.list.allUsers;
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
      };
    },
    query: UserListInitQuery,
  });

export default compose(withUserList)(UserList);
