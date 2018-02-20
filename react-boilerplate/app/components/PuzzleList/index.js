/**
 *
 * PuzzleList
 *
 */

/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { graphql } from 'react-apollo';

import withNumberPaginator from 'components/withNumberPaginator';
import PuzzlePanel from 'components/PuzzlePanel';
import PaginatorBar from 'components/PaginatorBar';
import PuzzleListQuery from 'graphql/PuzzleList';
import LoadingDots from 'components/LoadingDots';

function PuzzleList(props) {
  if (props.loading || !props.allPuzzles) {
    return <LoadingDots py={50} size={8} />;
  }
  return (
    <div>
      {props.allPuzzles.edges.map((edge) => (
        <PuzzlePanel node={edge.node} key={edge.node.id} />
      ))}
      <PaginatorBar
        changePage={props.changePage}
        numPages={Math.ceil(props.allPuzzles.totalCount / props.itemsPerPage)}
        currentPage={props.page}
      />
    </div>
  );
}

PuzzleList.propTypes = {
  loading: PropTypes.bool.isRequired,
  allPuzzles: PropTypes.shape({
    edges: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
  }),
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // eslint-disable-next-line react/no-unused-prop-types
  itemsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  changePage: PropTypes.func,
};

PuzzleList.defaultProps = {
  page: 1,
  itemsPerPage: 10,
  changePage: () => {},
};

const withPuzzleList = graphql(PuzzleListQuery, {
  options: ({ variables, fetchPolicy, page, itemsPerPage }) => ({
    variables: {
      limit: itemsPerPage,
      offset: itemsPerPage * (page - 1),
      ...variables,
    },
    fetchPolicy,
  }),
  props({ data }) {
    const { loading, allPuzzles, refetch } = data;
    return {
      loading,
      allPuzzles,
      refetch,
    };
  },
});

export default compose(withNumberPaginator(), withPuzzleList)(PuzzleList);
