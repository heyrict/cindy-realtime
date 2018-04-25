/**
 *
 * StarList
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
import StarListQuery from 'graphql/StarList';
import LoadingDots from 'components/LoadingDots';
import FiveStars from 'components/FiveStars';
import PaginatorBar from 'components/PaginatorBar';

const StarList = (props) => (
  <div>
    {props.allStars &&
      props.allStars.edges.map((edge) => (
        <PuzzlePanel
          node={edge.node.puzzle}
          key={edge.node.id}
          additional={
            <FiveStars
              value={edge.node.value}
              starSize="15px"
              justify="center"
            />
          }
        />
      ))}
    {props.loading && <LoadingDots size={8} py={props.allStars ? 10 : 50} />}
    {!props.loading && (
      <PaginatorBar
        numPages={Math.ceil(props.allStars.totalCount / props.itemsPerPage)}
        currentPage={props.page}
        changePage={props.changePage}
      />
    )}
  </div>
);

StarList.propTypes = {
  loading: PropTypes.bool.isRequired,
  allStars: PropTypes.shape({
    edges: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
  }),
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  itemsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  changePage: PropTypes.func.isRequired,
};

const withStarList = graphql(StarListQuery, {
  options: ({ variables, page, itemsPerPage }) => ({
    variables: {
      limit: itemsPerPage,
      offset: itemsPerPage * (page - 1),
      ...variables,
    },
  }),
  props({ data }) {
    const { loading, allStars, refetch } = data;
    return {
      loading,
      allStars,
      refetch,
    };
  },
});

export default compose(withNumberPaginator(), withStarList)(StarList);
