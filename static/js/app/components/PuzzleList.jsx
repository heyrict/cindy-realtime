/* PuzzleList
 * ==========
 * exports PuzzleListBody for React Router to render a page.
 *
 * Use Redux to subscribe the `unsolved` puzzles (with updates),
 * Use Relay to paginate the `solved` puzzles.
 *
 * TODO: Find a better solution if subscriptions got implemented in
 *       graphene. [See](https://github.com/graphql-python/graphene/pull/500)
 */
// {{{1 Imports
import React from "react";
import { Grid, ProgressBar, PageHeader, Button } from "react-bootstrap";
import { connect } from "react-redux";
import "jquery";

import {
  PuzzleCreatedLabel,
  PuzzleProcessLabel,
  PuzzleScoreLabel,
  PuzzleStatusLable,
  PuzzleTitleLabel,
  PuzzleGiverLabel,
  ComponentsFragmentUserLabel
} from "./components.jsx";
import {
  QueryRenderer,
  graphql,
  createFragmentContainer,
  createPaginationContainer
} from "react-relay";
import { connectStream, disconnectStream } from "../redux/actions";
import { environment } from "../Environment";
import common from "../common";

// {{{1 Elements
// {{{2 function PuzzleListItem
export function PuzzleListItem(props) {
  const node = props.node;

  var starCount = 0,
    starSum = 0;

  node.starSet.edges.forEach(s => {
    starSum += s.node.value;
    starCount++;
  });

  const UserLabelCls = props.relay ? ComponentsFragmentUserLabel : PuzzleGiverLabel

  return (
    <div className="row show-grid">
      <div className="col-xs-4 col-sm-2 col-md-2 col-lg-1 text-center">
        <PuzzleStatusLable status={node.status} />
      </div>
      <div className="col-xs-2 col-sm-1 col-md-1 col-lg-1 text-center">
        <PuzzleProcessLabel
          qCount={node.quesCount}
          uaCount={node.uaquesCount}
        />
      </div>
      <div className="visible-xs-block col-xs-6 text-right">
        <UserLabelCls user={node.user} />
        <PuzzleCreatedLabel time={node.created} />
      </div>
      <span className="visible-xs-block clearfix" />
      <div className="col-xs-12 col-sm-9 col-md-9 col-lg-10">
        <PuzzleTitleLabel
          puzzleId={node.rowid}
          genre={node.genre}
          title={node.title}
        />
        <PuzzleScoreLabel starCount={starCount} starSum={starSum} />
      </div>
      <div className="hidden-xs col-sm-12 text-right">
        <UserLabelCls user={node.user} />
        <PuzzleCreatedLabel time={node.created} />
      </div>
      <span className="clearfix" />
    </div>
  );
}

// {{{2 class PuzzleListUnsolvedListAtom
class PuzzleListUnsolvedListAtom extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.initPuzzleList();
  }

  render() {
    return (
      <div>
        {this.props.list.allPuzzles.edges.map(edge => (
          <PuzzleListItem node={edge.node} key={edge.node.id} />
        ))}
      </div>
    );
  }

  componentWillUnmount() {
    this.props.destroyPuzzleList();
  }
}

const mapUnsolvedListStateToProps = state => ({
  list: state.puzzleList
});

const mapUnsolvedListDepatchToProps = (dispatch, ownProps) => ({
  initPuzzleList: () => dispatch(connectStream("puzzleList")),
  destroyPuzzleList: () => dispatch(disconnectStream("puzzleList"))
});

const PuzzleListUnsolvedList = connect(
  mapUnsolvedListStateToProps,
  mapUnsolvedListDepatchToProps
)(PuzzleListUnsolvedListAtom);

// {{{2 class PuzzleListList
class PuzzleListList extends React.Component {
  constructor(props) {
    super(props);
    this._loadMore = this._loadMore.bind(this);
  }
  render() {
    return (
      <div>
        {this.props.list.allPuzzles.edges.map(edge => (
          <PuzzleListFragmentItem node={edge.node} key={edge.node.__id} />
        ))}
        {this.props.relay.hasMore() ? (
          <Button onClick={this._loadMore} block={true} bsStyle="info">
            Load More ...
          </Button>
        ) : (
          ""
        )}
      </div>
    );
  }

  _loadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(10, error => {
      console.log(error);
    });
  }
}

// {{{1 Containers
// {{{2 const PuzzleListFragmentItem
export const PuzzleListFragmentItem = createFragmentContainer(PuzzleListItem, {
  node: graphql`
    fragment PuzzleList_node on PuzzleNode {
      id
      rowid
      genre
      title
      status
      created
      quesCount
      uaquesCount
      starSet {
        edges {
          node {
            value
          }
        }
      }
      user {
        ...components_user
      }
    }
  `
});
// {{{2 const PuzzleListFragmentList
export const PuzzleListFragmentList = createPaginationContainer(
  PuzzleListList,
  {
    list: graphql`
      fragment PuzzleList_list on Query
        @argumentDefinitions(
          count: { type: Int, defaultValue: 3 }
          cursor: { type: String }
          orderBy: { type: "[String]", defaultValue: "-id" }
          status: { type: Float, defaultValue: null }
          status__gt: { type: Float, defaultValue: null }
        ) {
        allPuzzles(
          first: $count
          after: $cursor
          orderBy: $orderBy
          status: $status
          status_Gt: $status__gt
        ) @connection(key: "PuzzleNode_allPuzzles") {
          edges {
            node {
              id
              ...PuzzleList_node
            }
          }
        }
      }
    `
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.list && props.list.allPuzzles;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        orderBy: fragmentVariables.orderBy,
        status: fragmentVariables.status,
        status__gt: fragmentVariables.status__gt
      };
    },
    query: graphql`
      query PuzzleListInitQuery(
        $count: Int
        $cursor: String
        $orderBy: [String]
        $status: Float
        $status__gt: Float
      ) {
        ...PuzzleList_list
          @arguments(
            count: $count
            cursor: $cursor
            orderBy: $orderBy
            status__gt: $status__gt
            status: $status
          )
      }
    `
  }
);

// {{{2 query PuzzleListQuery
const puzzleListBodyQuery = graphql`
  query PuzzleListInitQuery(
    $count: Int
    $cursor: String
    $orderBy: [String]
    $status: Float
    $status__gt: Float
  ) {
    ...PuzzleList_list
      @arguments(
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        status: $status
        status__gt: $status__gt
      )
  }
`;

// {{{1 Body
// {{{2 function PuzzleListQueryRenderer
function PuzzleListQueryRenderer(props) {
  return (
    <QueryRenderer
      environment={environment}
      component={PuzzleListFragmentList}
      query={puzzleListBodyQuery}
      variables={props.variables}
      render={({ error, props }) => {
        if (error) {
          return <div>{error.message}</div>;
        } else if (props) {
          return <PuzzleListFragmentList list={props} />;
        }
        return <ProgressBar now={100} label={"Loading..."} striped active />;
      }}
    />
  );
}

// {{{2 class PuzzleListBody
export class PuzzleListBody extends React.Component {
  render() {
    return (
      <Grid>
        <PageHeader>{gettext("All Puzzles")}</PageHeader>
        <PuzzleListUnsolvedList />
        <hr />
        <PuzzleListQueryRenderer
          variables={{
            orderBy: ["-modified", "-id"],
            count: 3,
            status: null,
            status__gt: 0
          }}
        />
      </Grid>
    );
  }
}
