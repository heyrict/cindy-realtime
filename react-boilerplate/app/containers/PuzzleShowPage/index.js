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

import { selectUserNavbarDomain } from 'containers/UserNavbar/selectors';
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
          <Frame user={P.user} text={P.content} created={P.created} />
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
                />
              )}
            </FormattedMessage>
          )}
        {(P.status <= 2 || P.user.rowid === U) &&
          D.edges.map((edge) => {
            const type = f(edge.node.id)[0];
            if (type === 'DialogueNode') {
              index += 1;
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
                  index={index}
                  status={P.status}
                  node={edge.node}
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
        {(P.status <= 2 || P.user.rowid === U) &&
          P.status !== 0 && <Frame text={P.solution} solved={P.modified} />}
        {P.status === 0 &&
          U !== P.user.rowid && (
            <QuestionPutBox
              puzzleId={puzzleId}
              currentUserId={this.props.user.userId}
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
      userId: props.user.userId || '-1',
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
