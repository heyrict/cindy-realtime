// {{{1 Imports
import React from "react";
import { Grid, ProgressBar, PageHeader, Button } from "react-bootstrap";
import "jquery";

import {
  MondaiCreatedLabel,
  MondaiProcessLabel,
  MondaiScoreLabel,
  MondaiStatusLable,
  MondaiTitleLabel,
  ComponentsFragmentUserLabel
} from "./components.jsx";
import {
  QueryRenderer,
  graphql,
  createFragmentContainer,
  createPaginationContainer
} from "react-relay";
import { environment } from "../Environment";
import common from "../common";

// {{{1 Elements
// {{{2 function MondaiListItem
export function MondaiListItem(props) {
  const node = props.node;

  var starCount = 0,
    starSum = 0;

  node.starSet.edges.forEach(s => {
    starSum += s.node.value;
    starCount++;
  });

  return (
    <div className="row show-grid">
      <div className="col-xs-4 col-sm-2 col-md-2 col-lg-1 text-center">
        <MondaiStatusLable status={node.status} />
      </div>
      <div className="col-xs-2 col-sm-1 col-md-1 col-lg-1 text-center">
        <MondaiProcessLabel
          qCount={node.quesCount}
          uaCount={node.uaquesCount}
        />
      </div>
      <div className="visible-xs-block col-xs-6 text-right">
        <ComponentsFragmentUserLabel user={node.user} />
        <MondaiCreatedLabel time={node.created} />
      </div>
      <span className="visible-xs-block clearfix" />
      <div className="col-xs-12 col-sm-9 col-md-9 col-lg-10">
        <MondaiTitleLabel
          mondaiId={node.rowid}
          genre={node.genre}
          title={node.title}
        />
        <MondaiScoreLabel starCount={starCount} starSum={starSum} />
      </div>
      <div className="hidden-xs col-sm-12 text-right">
        <ComponentsFragmentUserLabel user={node.user} />
        <MondaiCreatedLabel time={node.created} />
      </div>
      <span className="clearfix" />
    </div>
  );
}

// {{{2 class MondaiListList
class MondaiListList extends React.Component {
  constructor(props) {
    super(props);
    this._loadMore = this._loadMore.bind(this);
  }
  render() {
    return (
      <div>
        {this.props.list.allMondais.edges.map(edge => (
          <MondaiListFragmentItem node={edge.node} key={edge.node.__id} />
        ))}
        {this.props.relay.hasMore() ? (
          <Button onClick={this._loadMore} block={true} bsStyle="info">Load More ...</Button>
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
// {{{2 const MondaiListFragmentItem
export const MondaiListFragmentItem = createFragmentContainer(MondaiListItem, {
  node: graphql`
    fragment MondaiList_node on MondaiNode {
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
// {{{2 const MondaiListFragmentList
export const MondaiListFragmentList = createPaginationContainer(
  MondaiListList,
  {
    list: graphql`
      fragment MondaiList_list on Query
        @argumentDefinitions(
          count: { type: Int, defaultValue: 3 }
          cursor: { type: String }
          orderBy: { type: "[String]", defaultValue: "-id" }
          status: { type: Float, defaultValue: null }
          status__gt: { type: Float, defaultValue: null }
        ) {
        allMondais(
          first: $count
          after: $cursor
          orderBy: $orderBy
          status: $status
          status_Gt: $status__gt
        ) @connection(key: "MondaiNode_allMondais") {
          edges {
            node {
              id
              ...MondaiList_node
            }
          }
        }
      }
    `
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.list && props.list.allMondais;
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
      query MondaiListInitQuery(
        $count: Int
        $cursor: String
        $orderBy: [String]
        $status: Float
        $status__gt: Float
      ) {
        ...MondaiList_list
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

// {{{2 query MondaiListQuery
const mondaiListBodyQuery = graphql`
  query MondaiListInitQuery(
    $count: Int
    $cursor: String
    $orderBy: [String]
    $status: Float
    $status__gt: Float
  ) {
    ...MondaiList_list
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
// {{{2 function MondaiListQueryRenderer
function MondaiListQueryRenderer(props) {
  return (
    <QueryRenderer
      environment={environment}
      component={MondaiListFragmentList}
      query={mondaiListBodyQuery}
      variables={props.variables}
      render={({ error, props }) => {
        if (error) {
          return <div>{error.message}</div>;
        } else if (props) {
          return <MondaiListFragmentList list={props} />;
        }
        return <ProgressBar now={100} label={"Loading..."} striped active />;
      }}
    />
  );
}

// {{{2 class MondaiListBody
export class MondaiListBody extends React.Component {
  render() {
    return (
      <Grid>
        <PageHeader>{gettext("All Soups")}</PageHeader>
        <MondaiListQueryRenderer
          variables={{
            orderBy: ["-modified", "-id"],
            status: 0,
            status__gt: null
          }}
        />
        <hr />
        <MondaiListQueryRenderer
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
