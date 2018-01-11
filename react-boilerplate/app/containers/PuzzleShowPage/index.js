/**
 *
 * PuzzleShowPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import makeSelectPuzzleShowPage from './selectors';
import saga from './saga';
import messages from './messages';
import { puzzleShown } from './actions';

export class PuzzleShowPage extends React.Component {
  componentDidMount() {
    this.props.dispatch(puzzleShown(this.props.match.params.id));
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Puzzle No.{this.props.match.params.id}</title>
          <meta name="description" content="Description of PuzzleShowPage" />
        </Helmet>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

PuzzleShowPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = createStructuredSelector({
  puzzleshowpage: makeSelectPuzzleShowPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'puzzleShowPage', saga });

export default compose(withSaga, withConnect)(PuzzleShowPage);
