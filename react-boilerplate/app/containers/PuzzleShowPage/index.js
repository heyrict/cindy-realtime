/**
 *
 * PuzzleShowPage
 *
 */

/* eslint-disable no-mixed-operators */
/* eslint-disable indent */

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
import { Flex } from 'rebass';

import { selectUserNavbarDomain } from 'containers/UserNavbar/selectors';
import makeSelectSettings from 'containers/Settings/selectors';
import { from_global_id as f, to_global_id as t, text2desc } from 'common';
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
import { ImgXs as Img, ButtonOutline } from 'style-store';
import { googleAdInfo } from 'settings';

import { graphql } from 'react-apollo';
import PuzzleShowQuery from 'graphql/PuzzleShow';
import PuzzleShowSubscription from 'graphql/PuzzleShowSubscription';
import PuzzleShowUnionSubscription from 'graphql/PuzzleShowUnionSubscription';

import { genreInfo, yamiInfo } from 'components/TitleLabel/constants';
import { dialogueSlicer } from './constants';
import Frame from './Frame';
import messages from './messages';
import QuestionPutBox from './QuestionPutBox';
import PuzzleModifyBox from './PuzzleModifyBox';
import RewardingBox from './RewardingBox';
import BookmarkBox from './BookmarkBox';

const FilterButton = styled.button`
  border-bottom: ${({ enabled }) => (enabled ? '3px solid #2075c7' : '0')};
`;

const FilterFrame = styled.div`
  border: 2px solid #c6b571;
  background-color: rgba(214, 197, 113, 0.6);
  border-radius: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

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
      userFilter: [],
    };
    this.changePage = (p) => this.setState({ currentPage: p });
    this.toggleUserFilter = this.toggleUserFilter.bind(this);
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
  componentWillReceiveProps(nextProps) {
    if (this.props.user.userId !== nextProps.user.userId) {
      this.setState({
        userFilter: [],
        currentPage: 0,
      });
    }
  }

  toggleUserFilter(user) {
    this.setState(({ userFilter: prevUserFilter }) => {
      if (prevUserFilter.indexOf(user) === -1) {
        return {
          userFilter: [...prevUserFilter, user],
          currentPage: 0,
        };
      }
      return {
        userFilter: Array.filter(prevUserFilter, (v) => v !== user),
        currentPage: 0,
      };
    });
  }

  render() {
    const P = this.props.puzzle;
    const D = this.props.puzzleShowUnion;
    const U = t('UserNode', this.props.user.userId);
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
    const genre = _(genreMessages[genreInfo[P.genre].name]);
    const yami = P.yami ? ` x ${_(genreMessages[yamiInfo[P.yami].name])}` : '';

    const numItems = 50;
    const isNotParticipantInYami = (edge) =>
      !(P.yami && U !== edge.node.user.id && U !== P.user.id && P.status === 0);
    const { slices: dSlices, edges: dEdges, participants } = dialogueSlicer({
      numItems,
      puzzleShowUnion: D,
      userFilter: this.state.userFilter,
      page: this.state.currentPage,
      extraFilter: isNotParticipantInYami,
    });
    const getTrueAnswInLtYami =
      P.yami === 2 && U && U in participants && participants[U].trueansw;

    const UserFilterBar = (
      <Constrained level={3}>
        <FilterFrame>
          <Flex flexWrap="wrap" mb={1} justifyContent="center">
            {Object.values(participants).map((participant) => (
              <FilterButton
                enabled={
                  this.state.userFilter.indexOf(participant.user.id) === -1
                }
                key={participant.user.id}
                onClick={() =>
                  this.props.settings.canFilterMultipleUser
                    ? this.toggleUserFilter(participant.user.id)
                    : this.setState({
                        userFilter: Array.filter(
                          Object.keys(participants),
                          (v) => v !== participant.user.id
                        ),
                        currentPage: 0,
                      })
                }
              >
                {participant.user.nickname}
                <sup>
                  {participant.uacount > 0
                    ? `${participant.uacount}/${participant.count}`
                    : participant.count}
                </sup>
              </FilterButton>
            ))}
          </Flex>
          <Flex
            flexWrap="wrap"
            mb={1}
            justifyContent="center"
            alignItems="center"
          >
            {this.props.settings.canFilterMultipleUser && (
              <ButtonOutline
                mt={1}
                p={1}
                w={1 / 3}
                onClick={() =>
                  this.setState({
                    userFilter: Object.keys(participants),
                    currentPage: 0,
                  })
                }
              >
                Remove All
              </ButtonOutline>
            )}
            <ButtonOutline
              mt={1}
              p={1}
              w={1 / 3}
              onClick={() => this.setState({ userFilter: [], currentPage: 0 })}
            >
              Reset
            </ButtonOutline>
          </Flex>
        </FilterFrame>
      </Constrained>
    );

    const DialoguePaginationBar = (
      <Constrained>
        <Flex flexWrap="wrap" mb={2} justifyContent="center">
          <button onClick={this.scrollToTop}>
            <Img src={top} alt="Top" />
          </button>
          {dSlices.map((dSlice, i) => (
            <FilterButton
              enabled={this.state.currentPage === i}
              key={dSlice}
              onClick={() => this.changePage(i)}
            >
              {i === 0 ? 1 : dSlices[i - 1] + 1} - {dSlice}
            </FilterButton>
          ))}
          <button onClick={this.scrollToBottom}>
            <Img src={bottom} alt="Bottom" />
          </button>
        </Flex>
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
        {(P.status <= 2 || P.user.id === U) && (
          <Frame
            user={P.user}
            text={P.content}
            created={P.created}
            safe={P.contentSafe}
          />
        )}
        {P.status >= 3 &&
          P.user.id !== U && (
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
        {(P.status === 1 ||
          P.status === 2 ||
          P.user.id === U ||
          (P.status === 0 && P.yami === 0)) && <div>{UserFilterBar}</div>}
        {(P.status <= 2 || P.user.id === U) && (
          <div>
            {DialoguePaginationBar}
            <PoseGroup>
              {dEdges.map((edge) => {
                const type = f(edge.node.id)[0];
                if (type === 'DialogueNode') {
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
        {P.status === 0 &&
          U !== P.user.id && (
            <QuestionPutBox
              puzzleId={puzzleId}
              currentUserId={this.props.user.userId}
              sendPolicy={this.props.settings.sendQuestion}
            />
          )}
        {(P.status === 1 ||
          P.status === 2 ||
          P.user.rowid === U ||
          getTrueAnswInLtYami) && (
          <Frame text={P.solution} solved={P.modified} safe={P.contentSafe} />
        )}
        {(P.status === 1 || P.status === 2 || getTrueAnswInLtYami) &&
          U && (
            <BookmarkBox
              puzzleId={puzzleId}
              existingBookmark={this.props.allBookmarks.edges}
            />
          )}
        {(P.status === 1 || P.status === 2 || getTrueAnswInLtYami) &&
          U &&
          U !== P.user.id && (
            <RewardingBox
              puzzleId={puzzleId}
              existingComment={this.props.allComments.edges}
              existingStar={this.props.allStars.edges}
            />
          )}
        {U === P.user.id && <PuzzleModifyBox puzzle={P} puzzleId={puzzleId} />}
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
    canFilterMultipleUser: PropTypes.bool.isRequired,
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

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

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

export default compose(
  withConnect,
  withData
)(PuzzleShowPage);
