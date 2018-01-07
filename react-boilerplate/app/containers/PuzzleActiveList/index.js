/**
 *
 * PuzzleActiveList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectPuzzleActiveList from './selectors';
import reducer from './reducer';
import saga from './saga';
import { loadAllPuzzles } from "./actions";

import { PuzzlePanel } from "components/PuzzlePanel";

export class PuzzleActiveList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.dispatch(loadAllPuzzles())
  }

  render() {
    return (
      <div>
        {this.props.puzzleactivelist.allPuzzles.edges.map(edge => (
          <PuzzlePanel node={edge.node} key={edge.node.id} />
        ))}
      </div>
    );
  }
}

PuzzleActiveList.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  puzzleactivelist: makeSelectPuzzleActiveList(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'puzzleActiveList', saga });

export default compose(
  withSaga,
  withConnect,
)(PuzzleActiveList);
