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
import { graphql, withApollo } from "react-apollo";

import injectSaga from "utils/injectSaga";
import injectReducer from "utils/injectReducer";
import makeSelectPuzzleList from "./selectors";
import reducer from "./reducer";
import saga from "./saga";

import PuzzleList_list from "./graphql/PuzzleList_list.graphql";

export class PuzzleList extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return <div>{JSON.stringify(this.props.data)}</div>;
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

export default compose(
  withApollo,
  graphql(PuzzleList_list, {
    options: {
      variables: {
        orderBy: "-id"
      }
    },
  }),
  withReducer,
  withSaga,
  withConnect
)(PuzzleList);
