import React from 'react';
import PropTypes from 'prop-types';

import FilterableList from 'components/FilterableList';
import LoadingDots from 'components/LoadingDots';
import StarList from 'components/StarList';
import StarListInitQuery from 'graphql/StarListInitQuery';

function StarsPanel(props) {
  return (
    <FilterableList
      query={StarListInitQuery}
      component={StarList}
      variables={{ user: props.userId }}
      order={[{ key: 'id', asc: false }]}
      orderList={['id']}
      render={(raw) => {
        const error = raw.error;
        const p = raw.props;
        if (error) {
          return <div>{error.message}</div>;
        } else if (p) {
          return <StarList list={p} />;
        }
        return <LoadingDots />;
      }}
      {...props}
    />
  );
}

StarsPanel.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default StarsPanel;
