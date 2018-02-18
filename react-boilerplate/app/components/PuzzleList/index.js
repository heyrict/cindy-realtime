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
import { FormattedMessage } from 'react-intl';
import { ButtonOutline } from 'style-store';

import PuzzlePanel from 'components/PuzzlePanel';
import PuzzleListQuery from 'graphql/PuzzleList';
import LoadingDots from 'components/LoadingDots';

const StyledButtonOutline = ButtonOutline.extend`
  border-radius: 10px;
  padding: 10px 0;
`;

class PuzzleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.page || 1,
    };
    this.handleChange = (e) => this.setState({ value: e.target.value });
    this.handleSubmit = () => props.changePage(this.state.value);
  }
  render() {
    if (this.props.loading || !this.props.allPuzzles) {
      return <LoadingDots py={50} size={8} />;
    }
    return (
      <div>
        {this.props.allPuzzles.edges.map((edge) => (
          <PuzzlePanel node={edge.node} key={edge.node.id} />
        ))}
        <input value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>jump</button>
      </div>
    );
  }
}

PuzzleList.propTypes = {
  loading: PropTypes.bool.isRequired,
  allPuzzles: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  itemsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  changePage: PropTypes.func,
};

const withPuzzleList = graphql(PuzzleListQuery, {
  options: ({ variables, fetchPolicy, page = 1, itemsPerPage = 10 }) => ({
    variables: {
      limit: itemsPerPage,
      offset: itemsPerPage * (page - 1),
      ...variables,
    },
    fetchPolicy,
  }),
  props({ data, ownProps }) {
    const { loading, allPuzzles, fetchMore, refetch } = data;
    return {
      loading,
      allPuzzles,
      refetch,
      loadPage: (page, itemsPerPage = 10) =>
        fetchMore({
          query: PuzzleListQuery,
          variables: {
            ...ownProps.variables,
            limit: itemsPerPage,
            offset: itemsPerPage * (page - 1),
          },
          updateQuery: (previousResult, { fetchMoreResult }) =>
            fetchMoreResult.allPuzzles.edges.length
              ? fetchMoreResult
              : previousResult,
        }),
    };
  },
});

export default compose(withPuzzleList)(PuzzleList);
