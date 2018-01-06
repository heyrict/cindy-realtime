/**
 *
 * PuzzleList
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import injectSaga from "utils/injectSaga";
import injectReducer from "utils/injectReducer";
import makeSelectPuzzleList from "./selectors";
import reducer from "./reducer";
import saga from "./saga";

import { graphql, createPaginationContainer } from "react-relay";

import { Button } from "react-bootstrap";
import PuzzlePanel from "components/PuzzlePanel";

// {{{ PuzzleListInitQuery
export const PuzzleListInitQuery = graphql`
  query PuzzleListInitQuery(
    $count: Int
    $cursor: String
    $orderBy: [String]
    $status: Float
    $status__gt: Float
  ) {
    ...PuzzleList_list
      @arguments(
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        status__gt: $status__gt
        status: $status
      )
  }
`;
// }}}

export class PuzzleList extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this._loadMore = this._loadMore.bind(this);
  }
  render() {
    return (
      <div>
        {this.props.list.allPuzzles.edges.map(edge => (
          <PuzzlePanel node={edge.node} key={edge.node.__id} />
        ))}
        {this.props.relay.hasMore() ? (
          <Button onClick={this._loadMore} block={true} bsStyle="info">
            Load More ...
          </Button>
        ) : (
          ""
        )}
      </div>
    );
  }

  _loadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(10, error => {
      console.log(error);
    });
  }
}

PuzzleList.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  puzzlelist: makeSelectPuzzleList()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: "puzzleList", reducer });
const withSaga = injectSaga({ key: "puzzleList", saga });

const withPuzzleList_list = Component =>
  createPaginationContainer(
    Component,
    {
      list: graphql`
        fragment PuzzleList_list on Query
          @argumentDefinitions(
            count: { type: Int, defaultValue: 3 }
            cursor: { type: String }
            orderBy: { type: "[String]", defaultValue: "-id" }
            status: { type: Float, defaultValue: null }
            status__gt: { type: Float, defaultValue: null }
          ) {
          allPuzzles(
            first: $count
            after: $cursor
            orderBy: $orderBy
            status: $status
            status_Gt: $status__gt
          ) @connection(key: "PuzzleNode_allPuzzles") {
            edges {
              node {
                id
                ...PuzzlePanel_node
              }
            }
          }
        }
      `
    },
    {
      direction: "forward",
      getConnectionFromProps(props) {
        return props.list && props.list.allPuzzles;
      },
      getFragmentVariables(prevVars, totalCount) {
        return {
          ...prevVars,
          count: totalCount
        };
      },
      getVariables(props, { count, cursor }, fragmentVariables) {
        return {
          count,
          cursor,
          orderBy: fragmentVariables.orderBy,
          status: fragmentVariables.status,
          status__gt: fragmentVariables.status__gt
        };
      },
      query: PuzzleListInitQuery
    }
  );

export default compose(withReducer, withSaga, withConnect, withPuzzleList_list)(
  PuzzleList
);
