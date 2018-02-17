/**
 *
 * PuzzleActiveList
 *
 */

/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { from_global_id as f } from 'common';

import { graphql } from 'react-apollo';
import PuzzleListQuery from 'graphql/PuzzleList';
import PuzzleSubscription from 'graphql/PuzzleSubscription';
import DialogueCountSubscription from 'graphql/DialogueCountSubscription';

import PuzzlePanel from 'components/PuzzlePanel';
import LoadingDots from 'components/LoadingDots';

import { PUZZLE_ADDED } from 'containers/PuzzleActiveList/constants';

class PuzzleActiveList extends React.Component {
  componentWillMount() {
    this.props.subscribeToNewPuzzles();
    this.props.subscribeToDialogueUpdates();
  }
  render() {
    if (this.props.loading || !this.props.allPuzzles) {
      return <LoadingDots py={50} size={8} />;
    }
    return (
      <div>
        {this.props.allPuzzles.edges.map((edge) => (
          <PuzzlePanel node={edge.node} key={edge.node.id} />
        ))}
      </div>
    );
  }
}

PuzzleActiveList.propTypes = {
  loading: PropTypes.bool.isRequired,
  allPuzzles: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  subscribeToNewPuzzles: PropTypes.func.isRequired,
  subscribeToDialogueUpdates: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const withConnect = connect(null, mapDispatchToProps);

const withPuzzleActiveList = graphql(PuzzleListQuery, {
  options: {
    variables: {
      status: 0,
      orderBy: '-modified',
    },
  },
  props({ data, ownProps }) {
    const { allPuzzles, loading, subscribeToMore } = data;
    const { dispatch } = ownProps;
    return {
      allPuzzles,
      loading,
      subscribeToNewPuzzles: () =>
        subscribeToMore({
          document: PuzzleSubscription,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newNode = subscriptionData.data.puzzleSub;
            if (!newNode) return prev;

            let update = false;
            const prevEdges = prev.allPuzzles.edges.map((edge) => {
              if (edge.node.id === newNode.id) {
                update = true;
                return { ...edge, node: newNode };
              }
              const pk = (id) => parseInt(f(id)[1], 10);
              if (pk(edge.node.id) > pk(newNode.id)) {
                update = true;
              }
              return edge;
            });

            if (update) {
              return {
                ...prev,
                allPuzzles: {
                  ...prev.allPuzzles,
                  edges: prevEdges,
                },
              };
            }

            dispatch({
              type: PUZZLE_ADDED,
              data: {
                id: newNode.id,
                title: newNode.title,
                nickname: newNode.user.nickname,
              },
            });

            return {
              ...prev,
              allPuzzles: {
                ...prev.allPuzzles,
                edges: [
                  { __typename: 'PuzzleNodeEdge', node: newNode },
                  ...prev.allPuzzles.edges,
                ],
              },
            };
          },
        }),
      subscribeToDialogueUpdates: () =>
        subscribeToMore({
          document: DialogueCountSubscription,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newNode = subscriptionData.data.dialogueSub;
            if (!newNode) return prev;

            const prevEdges = prev.allPuzzles.edges.map((edge) => {
              if (edge.node.id === newNode.puzzle.id) {
                return { ...edge, node: { ...edge.node, ...newNode.puzzle } };
              }
              return edge;
            });

            return {
              ...prev,
              allPuzzles: {
                ...prev.allPuzzles,
                edges: prevEdges,
              },
            };
          },
        }),
    };
  },
});

export default compose(withConnect, withPuzzleActiveList)(PuzzleActiveList);
