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

import { PuzzlePanel } from 'components/PuzzlePanel';
import makeSelectPuzzleActiveList from './selectors';
import saga from './saga';
import { loadAllPuzzles } from './actions';

export class PuzzleActiveList extends React.Component {
  componentDidMount() {
    if (this.props.puzzleactivelist.allPuzzles.edges.length === 0) {
      this.props.dispatch(loadAllPuzzles());
    }
  }

  render() {
    return (
      <div>
        {this.props.puzzleactivelist.allPuzzles.edges.map((edge) => (
          <PuzzlePanel node={edge.node} key={edge.node.id} />
        ))}
      </div>
    );
  }
}

PuzzleActiveList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  puzzleactivelist: PropTypes.object.isRequired,
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

export default compose(withSaga, withConnect)(PuzzleActiveList);
