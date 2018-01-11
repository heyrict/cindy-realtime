/**
 *
 * PuzzleShowPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import { genre_type_dict as genreType } from 'common';
import genreMessages from 'components/TitleLabel/messages';

import Frame from './Frame';
import makeSelectPuzzleShowPage from './selectors';
import saga from './saga';
import messages from './messages';
import { puzzleShown } from './actions';

export class PuzzleShowPage extends React.Component {
  componentDidMount() {
    this.props.dispatch(puzzleShown(this.props.match.params.id));
  }

  render() {
    const P = this.props.puzzleshowpage;
    const _ = this.context.intl.formatMessage;
    const translateGenreCode = (x) => _(genreMessages[genreType[x]]);

    if (P.puzzle === null) return <div>Loading...</div>;
    return (
      <div>
        <Helmet>
          <title>
            {P.puzzle
              ? `[${translateGenreCode(P.puzzle.genre)}] ${P.puzzle.title}`
              : _(messages.title)}
          </title>
          <meta name="description" content="Description of PuzzleShowPage" />
        </Helmet>
        <Frame
          user={P.puzzle.user}
          text={P.puzzle.content}
          time={P.puzzle.created}
        />
        <Frame text={P.puzzle.solution} />
      </div>
    );
  }
}

PuzzleShowPage.contextTypes = {
  intl: intlShape,
};

PuzzleShowPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  puzzleshowpage: PropTypes.object.isRequired,
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
