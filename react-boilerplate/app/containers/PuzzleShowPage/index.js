/**
 *
 * PuzzleShowPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { createStructuredSelector, createSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import { selectUserNavbarDomain } from 'containers/UserNavbar/selectors';
import { from_global_id as f, genre_type_dict as genreType } from 'common';
import genreMessages from 'components/TitleLabel/messages';
import Dialogue from 'containers/Dialogue/Loadable';
import { Box } from 'rebass';
import Hint from 'containers/Hint';
import Constrained from 'components/Constrained';

import Frame from './Frame';
import makeSelectPuzzleShowPage from './selectors';
import saga from './saga';
import messages from './messages';
import { puzzleShown, puzzleHid } from './actions';
import QuestionPutBox from './QuestionPutBox';

const Title = styled.h1`
  font-size: 2em;
  text-align: center;
`;

export class PuzzleShowPage extends React.Component {
  componentDidMount() {
    this.puzzleId = this.props.match.params.id;
    this.props.dispatch(puzzleShown(this.puzzleId));
  }

  componentWillUnmount() {
    this.props.dispatch(puzzleHid(this.puzzleId));
  }

  render() {
    const P = this.props.puzzleshowpage.puzzle;
    const D = this.props.puzzleshowpage.puzzleShowUnion;
    const U = this.props.user.userId;

    if (P === null) {
      return <div>Loading...</div>;
    }

    const _ = this.context.intl.formatMessage;
    const translateGenreCode = (x) => _(genreMessages[genreType[x]]);
    const genre = translateGenreCode(P.genre);
    let index = 0;

    return (
      <div>
        <Helmet>
          <title>
            {P ? `Cindy - [${genre}] ${P.title}` : _(messages.title)}
          </title>
          <meta name="description" content="Description of PuzzleShowPage" />
        </Helmet>
        <Constrained>
          <Title>{`[${genre}] ${P.title}`}</Title>
        </Constrained>
        <Frame user={P.user} text={P.content} created={P.created} />
        {D.edges.map((node) => {
          const type = f(node.node.id)[0];
          if (type === 'DialogueNode') {
            index += 1;
            return (
              <Dialogue
                key={node.node.id}
                index={index}
                type={type}
                {...node}
              />
            );
          }
          return <Hint key={node.node.id} {...node} />;
        })}
        {P.status !== 0 && <Frame text={P.solution} solved={P.modified} />}
        {P.status === 0 &&
          U !== P.user.rowid && (
            <QuestionPutBox
              puzzleId={parseInt(this.puzzleId, 10)}
              currentUserId={this.props.user.userId}
            />
          )}
        <Box py={10} width={1} />
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
  user: PropTypes.object.isRequired,
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
  user: createSelector(selectUserNavbarDomain, (substate) =>
    substate.get('user').toJS()
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'puzzleShowPage', saga });

export default compose(withSaga, withConnect)(PuzzleShowPage);
