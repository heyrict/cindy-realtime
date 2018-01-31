import React from 'react';
import PropTypes from 'prop-types';

import FilterableList from 'components/FilterableList';
import LoadingDots from 'components/LoadingDots';
import BookmarkList from 'components/BookmarkList';
import BookmarkListInitQuery from 'graphql/BookmarkListInitQuery';

function BookmarksPanel(props) {
  return (
    <FilterableList
      query={BookmarkListInitQuery}
      component={BookmarkList}
      variables={{ user: props.userId }}
      order={[{ key: 'id', asc: false }]}
      orderList={['id']}
      render={(raw) => {
        const error = raw.error;
        const p = raw.props;
        if (error) {
          return <div>{error.message}</div>;
        } else if (p) {
          return <BookmarkList list={p} />;
        }
        return <LoadingDots />;
      }}
      {...props}
    />
  );
}

BookmarksPanel.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default BookmarksPanel;
