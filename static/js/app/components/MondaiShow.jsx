// {{{1 Imports
import React from "react";
import ReactDOM from "react-dom";
import { Grid, ProgressBar, PageHeader, Button } from "react-bootstrap";
import "jquery";

import {
  MondaiCreatedLabel,
  MondaiGiverLabel,
  MondaiProcessLabel,
  MondaiScoreLabel,
  MondaiStatusLable,
  MondaiTitleLabel
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
class MondaiShow extends React.Component {
  render() {
    return <div>Now you are visiting mondai:{this.props.mondaiId}</div>;
  }
}

class MondaiShowQnA extends React.Component {
  render() {
    return <div>{this.props.qna.shitumon}</div>;
  }
}

class MondaiShowQnAList extends React.Component {
  render() {
    return <div>QnAList</div>;
  }
}

// {{{1 Containers
// {{{2 const MondaiShowFragment
const MondaiShowFragment = createFragmentContainer(MondaiShowQnA, {
  qna: graphql`
    fragment MondaiShow_qna on ShitumonNode {
      id
      rowid
      shitumon
      kaitou
      good
      true
      askedtime
      answeredtime
      user {
        ...MondaiShow_giver
      }
    }
  `
});

// {{{2 const MondaiShowListFragment
const MondaiShowListFragment = createFragmentContainer(MondaiShowQnAList, {
  qnaList: graphql`
    fragment MondaiShow_qnaList on ShitumonNodeConnection {
      edges {
        node {
          ...MondaiShow_qna
        }
      }
    }
  `
});

// {{{1 Body
// {{{2 class MondaiShowBody
export class MondaiShowBody extends React.Component {
  render() {
    const mondaiId = this.props.match.params.mondaiId;
    return <MondaiShow mondaiId={mondaiId} />
  }
}
