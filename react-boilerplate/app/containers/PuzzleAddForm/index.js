/**
 *
 * PuzzleAddForm
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import { commitMutation, graphql } from "react-relay";
import bootbox from "bootbox";

import {
  Button,
  Form,
  FormControl,
  Grid,
  PageHeader,
  Panel
} from "react-bootstrap";
import FieldGroup from "components/FieldGroup";
import PreviewEdit from "components/PreviewEdit";
import common from "common";
import environment from "Environment";

import injectReducer from "utils/injectReducer";
import makeSelectPuzzleAddForm from "./selectors";
import messages from "./messages";

// {{{ PuzzleAddFormMutation
const PuzzleAddFormMutation = graphql`
  mutation PuzzleAddFormMutation($input: CreatePuzzleInput!) {
    createPuzzle(input: $input) {
      puzzle {
        id
        rowid
      }
    }
  }
`;
// }}}

export class PuzzleAddForm extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
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
          Ctl={PreviewEdit}
          content={this.state.puzzleContent}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formPuzzleAddKaisetu"
          label={gettext("Kaisetu")}
          Ctl={PreviewEdit}
          content={this.state.puzzleKaisetu}
          onChange={this.handleChange}
        />
        <Button type="submit" block onClick={this.handleSubmit}>
          {gettext("Click me")}
        </Button>
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
      mutation: PuzzleAddFormMutation,
      variables: { input: { ...this.state } },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert({
            title: "Error",
            message: errors.map(e => e.message).join(",")
          });
        } else if (response) {
          const puzzleId = response.createPuzzle.puzzle.rowid,
            nodeId = response.createPuzzle.puzzle.id;
          this.props.history.push(`/puzzle/show/${puzzleId}`);
          this.props.onNewPuzzleAdded(nodeId);
        }
      },
      onError: err => console.error(err)
    });
  }
  // }}}
}

PuzzleAddForm.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  puzzleaddform: makeSelectPuzzleAddForm()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(PuzzleAddForm);
