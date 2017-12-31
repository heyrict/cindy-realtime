// {{{1 Imports
import React from "react";
import {
  Button,
  Form,
  FormControl,
  Grid,
  PageHeader,
  Panel
} from "react-bootstrap";
import { commitMutation } from "react-relay";
import bootbox from "bootbox";

import { connect } from "react-redux";
import { addPuzzle } from "../redux/actions";

import { FieldGroup, PreviewEditor } from "./components.jsx";
import common from "../common";
import { environment } from "../Environment";

// {{{1 Elements
// {{{2 class PuzzleAddFormAtom
export class PuzzleAddFormAtom extends React.Component {
  // {{{ constructor
  constructor(props) {
    super(props);
    this.state = {
      puzzleTitle: "",
      puzzleGenre: 0,
      puzzleYami: false,
      puzzleContent: "",
      puzzleKaisetu: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // }}}
  // {{{ render
  render() {
    return (
      <Form horizontal>
        <FieldGroup
          id="formPuzzleAddTitle"
          label={gettext("Title")}
          Ctl={FormControl}
          type="text"
          value={this.state.puzzleTitle}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formPuzzleAddGenre"
          label={gettext("Genre")}
          Ctl={() => (
            <FormControl
              componentClass="select"
              value={this.state.puzzleGenre}
              onChange={this.handleChange}
            >
              {Object.entries(common.genre_code_dict).map(entry => (
                <option value={entry[0]} key={entry[0]}>
                  {entry[1]}
                </option>
              ))}
            </FormControl>
          )}
        />
        <FieldGroup
          id="formPuzzleAddYami"
          label={gettext("Yami")}
          Ctl={FormControl}
          type="checkbox"
          checked={this.state.puzzleYami}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formPuzzleAddContent"
          label={gettext("Content")}
          Ctl={PreviewEditor}
          content={this.state.puzzleContent}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formPuzzleAddKaisetu"
          label={gettext("Kaisetu")}
          Ctl={PreviewEditor}
          content={this.state.puzzleKaisetu}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formPuzzleAddSubmit"
          label={gettext("Submit")}
          Ctl={() => (
            <Button type="submit" block onClick={this.handleSubmit}>
              {gettext("Click me")}
            </Button>
          )}
        />
      </Form>
    );
  }
  // }}}
  // {{{ handleChange
  handleChange(e) {
    var target = e.target;
    if (target.id == "formPuzzleAddContent") {
      this.setState({ puzzleContent: target.value });
    } else if (target.id == "formPuzzleAddKaisetu") {
      this.setState({ puzzleKaisetu: target.value });
    } else if (target.id == "formPuzzleAddTitle") {
      this.setState({ puzzleTitle: target.value });
    } else if (target.id == "formPuzzleAddGenre") {
      this.setState({ puzzleGenre: target.value });
    } else if (target.id == "formPuzzleAddYami") {
      this.setState({ puzzleYami: target.checked });
    }
  }
  // }}}
  // {{{ handleSubmit
  handleSubmit(e) {
    e.preventDefault();
    commitMutation(environment, {
      mutation: PuzzleAddMutation,
      variables: { input: { ...this.state } },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(
            errors.map(e => (
              <Panel header={e.message} key={e.message} bsStyle="danger" />
            ))
          );
        } else if (response) {
          const puzzleId = response.createPuzzle.puzzle.rowid,
            nodeId = response.createPuzzle.puzzle.id;
          this.props.history.push(`/puzzle/show/${puzzleId}`);
          this.props.onNewPuzzleAdded(nodeId)
        }
      },
      onError: err => console.error(err)
    });
  }
  // }}}
}

// {{{2 const PuzzleAddForm
const mapDispatchToProps = (dispatch, ownProps) => ({
  onNewPuzzleAdded: puzzleId => dispatch(addPuzzle(puzzleId))
});

const PuzzleAddForm = connect(null, mapDispatchToProps)(PuzzleAddFormAtom);

// {{{1 Fragments
// {{{2 mutation PuzzleAddMutation
export const PuzzleAddMutation = graphql`
  mutation PuzzleAddMutation($input: CreatePuzzleInput!) {
    createPuzzle(input: $input) {
      puzzle {
        id
        rowid
      }
    }
  }
`;
// {{{1 Body
// {{{2 const PuzzleAddBody
export const PuzzleAddBody = props => (
  <Grid>
    <PageHeader>{gettext("New Puzzle")}</PageHeader>
    <PuzzleAddForm {...props} />
  </Grid>
);
