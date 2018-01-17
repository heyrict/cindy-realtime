/**
 *
 * PuzzleAddForm
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { commitMutation } from 'react-relay';
import bootbox from 'bootbox';

import { Button, Form, FormControl } from 'react-bootstrap';
import FieldGroup from 'components/FieldGroup';
import PreviewEdit from 'components/PreviewEdit';
import environment from 'Environment';
import genreMessages from 'components/TitleLabel/messages';
import PuzzleAddFormMutation from 'graphql/PuzzleAddFormMutation';

import makeSelectPuzzleAddForm from './selectors';
import messages from './messages';

export class PuzzleAddForm extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  // {{{ constructor
  constructor(props) {
    super(props);
    this.state = {
      puzzleTitle: '',
      puzzleGenre: 0,
      puzzleYami: false,
      puzzleContent: '',
      puzzleSolution: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // }}}
  // {{{ handleChange
  handleChange(e) {
    const target = e.target;
    if (target.id === 'formPuzzleAddContent') {
      this.setState({ puzzleContent: target.value });
    } else if (target.id === 'formPuzzleAddSolution') {
      this.setState({ puzzleSolution: target.value });
    } else if (target.id === 'formPuzzleAddTitle') {
      this.setState({ puzzleTitle: target.value });
    } else if (target.id === 'formPuzzleAddGenre') {
      this.setState({ puzzleGenre: target.value });
    } else if (target.id === 'formPuzzleAddYami') {
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
            title: 'Error',
            message: errors.map((error) => error.message).join(','),
          });
        } else if (response) {
          const puzzleId = response.createPuzzle.puzzle.rowid;
          this.props.history.push(`/puzzle/show/${puzzleId}`);
        }
      },
      onError: (err) => console.error(err),
    });
  }
  // }}}
  // {{{ render
  render() {
    return (
      <Form horizontal>
        <FieldGroup
          id="formPuzzleAddTitle"
          label={<FormattedMessage {...messages.titleLabel} />}
          Ctl={FormControl}
          type="text"
          value={this.state.puzzleTitle}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formPuzzleAddGenre"
          label={<FormattedMessage {...messages.genreLabel} />}
          Ctl={() => (
            <FormControl
              componentClass="select"
              value={this.state.puzzleGenre}
              onChange={this.handleChange}
            >
              <FormattedMessage {...genreMessages.classic}>
                {(msg) => (
                  <option value={0} key={0}>
                    {msg}
                  </option>
                )}
              </FormattedMessage>
              <FormattedMessage {...genreMessages.twentyQuestions}>
                {(msg) => (
                  <option value={1} key={1}>
                    {msg}
                  </option>
                )}
              </FormattedMessage>
              <FormattedMessage {...genreMessages.littleAlbat}>
                {(msg) => (
                  <option value={2} key={2}>
                    {msg}
                  </option>
                )}
              </FormattedMessage>
              <FormattedMessage {...genreMessages.others}>
                {(msg) => (
                  <option value={3} key={3}>
                    {msg}
                  </option>
                )}
              </FormattedMessage>
            </FormControl>
          )}
        />
        <FieldGroup
          id="formPuzzleAddYami"
          label={<FormattedMessage {...messages.yamiLabel} />}
          Ctl={FormControl}
          type="checkbox"
          checked={this.state.puzzleYami}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formPuzzleAddContent"
          label={<FormattedMessage {...messages.contentLabel} />}
          Ctl={PreviewEdit}
          content={this.state.puzzleContent}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formPuzzleAddSolution"
          label={<FormattedMessage {...messages.solutionLabel} />}
          Ctl={PreviewEdit}
          content={this.state.puzzleSolution}
          onChange={this.handleChange}
        />
        <Button type="submit" block onClick={this.handleSubmit}>
          {<FormattedMessage {...messages.submitLabel} />}
        </Button>
      </Form>
    );
  }
  // }}}
}

PuzzleAddForm.propTypes = {
  history: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  puzzleaddform: makeSelectPuzzleAddForm(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(PuzzleAddForm);
