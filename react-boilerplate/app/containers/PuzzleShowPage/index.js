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
import { easing, tween } from 'popmotion';
import posed, { PoseGroup } from 'react-pose';

import { selectUserNavbarDomain } from 'containers/UserNavbar/selectors';
import makeSelectSettings from 'containers/Settings/selectors';
import {
  from_global_id as f,
  to_global_id as t,
  genre_type_dict as genreType,
  text2desc,
} from 'common';
import genreMessages from 'components/TitleLabel/messages';
import { nAlert } from 'containers/Notifier/actions';
import Dialogue from 'containers/Dialogue/Loadable';
import Hint from 'containers/Hint';
import Constrained from 'components/Constrained';
import LoadingDots from 'components/LoadingDots';
import GoogleAd from 'components/GoogleAd';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import top from 'images/top.svg';
import bottom from 'images/bottom.svg';
import { ImgXs as Img } from 'style-store';
import { googleAdInfo } from 'settings';

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

const Title = styled.div`
  font-size: 2em;
  margin-bottom: 10px;
  margin-top: 20px;
  line-height: 1.1;
  text-align: center;
`;

const panelProps = {
  enter: {
    opacity: 1,
    scaleY: 1,
    transition: (props) =>
      tween({
        ...props,
        duration: 1000,
        ease: easing.anticipate,
      }),
  },
  exit: {
    opacity: 0,
    scaleY: 0,
  },
};

const AnimatedPanel = posed.div(panelProps);

export class PuzzleShowPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
    };
    this.changePage = (p) => this.setState({ currentPage: p });
    this.scrollToBottom = () => {
      this.adref.scrollIntoView({ behavior: 'smooth' });
    };
    this.scrollToTop = () => {
      this.titleref.scrollIntoView({ behavior: 'smooth' });
    };
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

    if (this.props.error) {
      this.props.alert(this.props.error.message);
      return <NotFoundPage />;
    }
    if (this.props.loading || !P) {
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

    const DialoguePaginationBar = (
      <Constrained wrap mb={2} style={{ textAlign: 'center' }}>
        <button onClick={this.scrollToTop}>
          <Img src={top} alt="Top" />
        </button>
        {dSlices.map((dSlice, i) => (
          <button
            style={{
              borderBottom:
                this.state.currentPage === i ? '3px solid #2075c7' : undefined,
            }}
            key={dSlice}
            onClick={() => this.changePage(i)}
          >
            {numItems * i + 1} - {Math.min(numItems * (i + 1), index)}
          </button>
        ))}
        <button onClick={this.scrollToBottom}>
          <Img src={bottom} alt="Bottom" />
        </button>
      </Constrained>
    );

    return (
      <div>
        <Helmet>
          <title>
            {P ? `[${genre}${yami}] ${P.title} - Cindy` : _(messages.title)}
          </title>
          <meta
            name="description"
            content={P ? text2desc(P.content) : _(messages.description)}
          />
        </Helmet>
        <div
          ref={(titleref) => {
            this.titleref = titleref;
          }}
        />
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
            <PoseGroup>
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
                      <AnimatedPanel key={edge.node.id}>
                        <Dialogue
                          index={edge.index}
                          status={P.status}
                          node={edge.node}
                          settings={this.props.settings}
                          owner={P.user}
                        />
                      </AnimatedPanel>
                    );
                  }
                  return (
                    <AnimatedPanel key={edge.node.id}>
                      <Hint owner={P.user} status={P.status} node={edge.node} />
                    </AnimatedPanel>
                  );
                })}
            </PoseGroup>
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
        <Constrained>
          <GoogleAd {...googleAdInfo.textAd} />
        </Constrained>
        <div
          ref={(adref) => {
            this.adref = adref;
          }}
        />
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
  error: PropTypes.object,
  alert: PropTypes.func.isRequired,
  subscribeToPuzzleUpdates: PropTypes.func.isRequired,
  subscribeToUnionUpdates: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  user: createSelector(selectUserNavbarDomain, (substate) =>
    substate.get('user').toJS()
  ),
  settings: makeSelectSettings(),
});

const mapDispatchToProps = (dispatch) => ({
  alert: (msg) => dispatch(nAlert(msg)),
});

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
      error,
      subscribeToMore,
    } = data;
    return {
      puzzleShowUnion,
      puzzle,
      allComments,
      allStars,
      allBookmarks,
      loading,
      error,
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
