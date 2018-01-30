/**
 *
 * PuzzleFilterableList
 *
 */
import React from 'react';
import PropTypes from 'prop-types';

import FilterableList from 'components/FilterableList';
import LoadingDots from 'components/LoadingDots';
import PuzzleList from 'components/PuzzleList';
import PuzzleListInitQuery from 'graphql/PuzzleListInitQuery';

function PuzzleFilterableList(props) {
  return (
    <FilterableList
      query={PuzzleListInitQuery}
      component={PuzzleList}
      render={(raw) => {
        const error = raw.error;
        const p = raw.props;
        if (error) {
          return <div>{error.message}</div>;
        } else if (p) {
          return <PuzzleList list={p} />;
        }
        return <LoadingDots />;
      }}
      {...props}
    />
  );
}

PuzzleFilterableList.defaultProps = {
  variables: {},
  order: [],
  orderList: ['created', 'modified', 'starCount'],
  filter: {},
};

PuzzleFilterableList.propTypes = {
  variables: PropTypes.object,
  order: PropTypes.array,
  orderList: PropTypes.array,
  filter: PropTypes.object,
};

export default PuzzleFilterableList;
