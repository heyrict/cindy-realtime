/**
 *
 * PuzzleShowPage
 *
 */

/* eslint-disable no-mixed-operators */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { createStructuredSelector, createSelector } from 'reselect';
import { compose } from 'redux';

import { selectUserNavbarDomain } from 'containers/UserNavbar/selectors';
import makeSelectSettings from 'containers/Settings/selectors';
import {
  from_global_id as f,
  to_global_id as t,
  genre_type_dict as genreType,
} from 'common';
import genreMessages from 'components/TitleLabel/messages';
import Dialogue from 'containers/Dialogue/Loadable';
import { Box } from 'rebass';
import Hint from 'containers/Hint';
import Constrained from 'components/Constrained';
import LoadingDots from 'components/LoadingDots';

import { graphql } from 'react-apollo';
import PuzzleShowQuery from 'graphql/PuzzleShow';
import PuzzleShowSubscription from 'graphql/PuzzleShowSubscription';
import PuzzleShowUnionSubscription from 'graphql/PuzzleShowUnionSubscription';

import Frame from './Frame';
import messages from './messages';
import QuestionPutBox from './QuestionPutBox';
import PuzzleModifyBox from './PuzzleModifyBox';
import RewardingBox from './RewardingBox';
import BookmarkBox from './BookmarkBox';

const Title = styled.h1`
  font-size: 2em;
  text-align: center;
`;

export class PuzzleShowPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
    };
    this.changePage = (p) => this.setState({ currentPage: p });
  }
  componentDidMount() {
    const puzzleId = t('PuzzleNode', this.props.match.params.id);
    this.props.subscribeToPuzzleUpdates({ id: puzzleId });
    this.props.subscribeToUnionUpdates({ id: puzzleId });
  }

  render() {
    const P = this.props.puzzle;
    const D = this.props.puzzleShowUnion;
    const U = this.props.user.userId;
    const puzzleId = parseInt(this.props.match.params.id, 10);

    if (this.props.loading || P === null) {
      return (
        <div style={{ paddingTop: '100px' }}>
          <LoadingDots />
        </div>
      );
    }

    const _ = this.context.intl.formatMessage;
    const translateGenreCode = (x) => _(genreMessages[genreType[x]]);
    const genre = translateGenreCode(P.genre);
    const yami = P.yami ? ` x ${_(genreMessages.yami)}` : '';

    let index = 0;
    const numItems = 50;
    const dSlices = [];
    const dEdges = D.edges.map((edge, i) => {
      if (f(edge.node.id)[0] === 'DialogueNode') {
        index += 1;
        if (index % numItems === 1 && index !== 1) dSlices.push(i);
        return { ...edge, index };
      }
      return edge;
    });
    dSlices.push(dEdges.length);

    const DialoguePaginationBar =
      dSlices.length > 1 ? (
        <Constrained wrap style={{ textAlign: 'center' }}>
          {dSlices.map((dSlice, i) => (
            <button
              style={{
                borderBottom:
                  this.state.currentPage === i
                    ? '3px solid #2075c7'
                    : undefined,
              }}
              key={dSlice}
              onClick={() => this.changePage(i)}
            >
              {numItems * i + 1} - {Math.min(numItems * (i + 1), index)}
            </button>
          ))}
        </Constrained>
      ) : null;

    return (
      <div>
        <Helmet>
          <title>
            {P ? `Cindy - [${genre}${yami}] ${P.title}` : _(messages.title)}
          </title>
          <meta name="description" content="Description of PuzzleShowPage" />
        </Helmet>
        <Constrained>
          <Title>{`[${genre}${yami}] ${P.title}`}</Title>
        </Constrained>
        {(P.status <= 2 || P.user.rowid === U) && (
          <Frame
            user={P.user}
            text={P.content}
            created={P.created}
            safe={P.contentSafe}
          />
        )}
        {P.status >= 3 &&
          P.user.rowid !== U && (
            <FormattedMessage {...messages.hiddenFrame}>
              {(msg) => (
                <Frame
                  user={P.user}
                  text={msg}
                  created={P.created}
                  solved={P.solved}
                  safe={P.contentSafe}
                />
              )}
            </FormattedMessage>
          )}
        {(P.status <= 2 || P.user.rowid === U) && (
          <div>
            {DialoguePaginationBar}
            {dEdges
              .slice(
                dSlices[this.state.currentPage - 1],
                dSlices[this.state.currentPage]
              )
              .map((edge) => {
                const type = f(edge.node.id)[0];
                if (type === 'DialogueNode') {
                  if (
                    P.yami &&
                    U !== edge.node.user.rowid &&
                    U !== P.user.rowid &&
                    P.status === 0
                  ) {
                    return null;
                  }
                  return (
                    <Dialogue
                      key={edge.node.id}
                      index={edge.index}
                      status={P.status}
                      node={edge.node}
                      settings={this.props.settings}
                      owner={P.user}
                    />
                  );
                }
                return (
                  <Hint
                    key={edge.node.id}
                    owner={P.user}
                    status={P.status}
                    node={edge.node}
                  />
                );
              })}
            {DialoguePaginationBar}
          </div>
        )}
        {(P.status <= 2 || P.user.rowid === U) &&
          P.status !== 0 && (
            <Frame text={P.solution} solved={P.modified} safe={P.contentSafe} />
          )}
        {P.status === 0 &&
          U !== P.user.rowid && (
            <QuestionPutBox
              puzzleId={puzzleId}
              currentUserId={this.props.user.userId}
              sendPolicy={this.props.settings.sendQuestion}
            />
          )}
        {(P.status === 1 || P.status === 2) &&
          U && (
            <BookmarkBox
              puzzleId={puzzleId}
              existingBookmark={this.props.allBookmarks.edges}
            />
          )}
        {(P.status === 1 || P.status === 2) &&
          U &&
          U !== P.user.rowid && (
            <RewardingBox
              puzzleId={puzzleId}
              existingComment={this.props.allComments.edges}
              existingStar={this.props.allStars.edges}
            />
          )}
        {U === P.user.rowid && (
          <PuzzleModifyBox puzzle={P} puzzleId={puzzleId} />
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
  user: PropTypes.object.isRequired,
  settings: PropTypes.shape({
    sendQuestion: PropTypes.string.isRequired,
    sendAnswer: PropTypes.string.isRequired,
    modifyQuestion: PropTypes.string.isRequired,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
  puzzleShowUnion: PropTypes.object,
  puzzle: PropTypes.object,
  allComments: PropTypes.object,
  allStars: PropTypes.object,
  allBookmarks: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  subscribeToPuzzleUpdates: PropTypes.func.isRequired,
  subscribeToUnionUpdates: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  user: createSelector(selectUserNavbarDomain, (substate) =>
    substate.get('user').toJS()
  ),
  settings: makeSelectSettings(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withData = graphql(PuzzleShowQuery, {
  options: (props) => ({
    variables: {
      id: t('PuzzleNode', props.match.params.id),
      userId: t('UserNode', props.user.userId || '-1'),
    },
    fetchPolicy: 'cache-and-network',
  }),
  props({ data }) {
    const {
      puzzleShowUnion,
      puzzle,
      allComments,
      allStars,
      allBookmarks,
      loading,
      subscribeToMore,
    } = data;
    return {
      puzzleShowUnion,
      puzzle,
      allComments,
      allStars,
      allBookmarks,
      loading,
      subscribeToPuzzleUpdates: ({ id }) =>
        subscribeToMore({
          document: PuzzleShowSubscription,
          variables: { id },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const update = subscriptionData.data.puzzleSub;
            if (!update) return prev;

            return {
              ...prev,
              puzzle: {
                ...prev.puzzle,
                ...update,
              },
            };
          },
        }),
      subscribeToUnionUpdates: ({ id }) =>
        subscribeToMore({
          document: PuzzleShowUnionSubscription,
          variables: { id },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newNode = subscriptionData.data.puzzleShowUnionSub;
            if (!newNode) return prev;

            let update = false;
            const prevEdges = prev.puzzleShowUnion.edges.map((edge) => {
              if (edge.node.id === newNode.id) {
                update = true;
                return { ...edge, node: newNode };
              }
              return edge;
            });

            if (update) {
              return {
                ...prev,
                puzzleShowUnion: {
                  ...prev.puzzleShowUnion,
                  edges: prevEdges,
                },
              };
            }

            return {
              ...prev,
              puzzleShowUnion: {
                ...prev.puzzleShowUnion,
                edges: [
                  ...prev.puzzleShowUnion.edges,
                  { __typename: 'PuzzleShowUnionEdge', node: newNode },
                ],
              },
            };
          },
        }),
    };
  },
});

export default compose(withConnect, withData)(PuzzleShowPage);
