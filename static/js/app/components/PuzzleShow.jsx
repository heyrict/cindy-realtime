// {{{1 Imports
import React from "react";
import ReactDOM from "react-dom";
import { Grid, ProgressBar, PageHeader, Button } from "react-bootstrap";
import "jquery";

import {
  PuzzleCreatedLabel,
  PuzzleGiverLabel,
  PuzzleProcessLabel,
  PuzzleScoreLabel,
  PuzzleStatusLable,
  PuzzleTitleLabel
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
class PuzzleShow extends React.Component {
  render() {
    return <div>Now you are visiting puzzle:{this.props.puzzleId}</div>;
  }
}

class PuzzleShowQnA extends React.Component {
  render() {
    return <div>{this.props.qna.question}</div>;
  }
}

class PuzzleShowQnAList extends React.Component {
  render() {
    return <div>QnAList</div>;
  }
}

// {{{1 Containers
// {{{2 const PuzzleShowFragment
const PuzzleShowFragment = createFragmentContainer(PuzzleShowQnA, {
  qna: graphql`
    fragment PuzzleShow_qna on DialogueNode {
      id
      rowid
      question
      answer
      good
      true
      askedtime
      answeredtime
      user {
        ...PuzzleShow_giver
      }
    }
  `
});

// {{{2 const PuzzleShowListFragment
const PuzzleShowListFragment = createFragmentContainer(PuzzleShowQnAList, {
  qnaList: graphql`
    fragment PuzzleShow_qnaList on DialogueNodeConnection {
      edges {
        node {
          ...PuzzleShow_qna
        }
      }
    }
  `
});

// {{{1 Body
// {{{2 class PuzzleShowBody
export class PuzzleShowBody extends React.Component {
  render() {
    const puzzleId = this.props.match.params.puzzleId;
    return <PuzzleShow puzzleId={puzzleId} />
  }
}
