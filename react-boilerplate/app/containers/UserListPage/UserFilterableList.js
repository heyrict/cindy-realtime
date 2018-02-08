/**
 *
 * UserFilterableList
 *
 */
import React from 'react';
import PropTypes from 'prop-types';

import FilterableList from 'components/FilterableList';
import LoadingDots from 'components/LoadingDots';
import UserList from 'components/UserList';
import UserListInitQuery from 'graphql/UserListInitQuery';

function UserFilterableList(props) {
  return (
    <FilterableList
      query={UserListInitQuery}
      component={UserList}
      render={(raw) => {
        const error = raw.error;
        const p = raw.props;
        if (error) {
          return <div>{error.message}</div>;
        } else if (p) {
          return <UserList list={p} />;
        }
        return <LoadingDots />;
      }}
      {...props}
    />
  );
}

UserFilterableList.defaultProps = {
  variables: {},
  order: [],
  orderList: ['dateJoined'],
  filter: {},
};

UserFilterableList.propTypes = {
  variables: PropTypes.object,
  order: PropTypes.array,
  orderList: PropTypes.array,
  filter: PropTypes.object,
};

export default UserFilterableList;
