/**
 *
 * PuzzleAddForm
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { push } from 'react-router-redux';
import { withLocale } from 'common';
import { nAlert } from 'containers/Notifier/actions';

import { Button, Form, FormControl } from 'react-bootstrap';
import FieldGroup from 'components/FieldGroup';
import PreviewEdit from 'components/PreviewEdit';
import genreMessages from 'components/TitleLabel/messages';
import { graphql } from 'react-apollo';
import PuzzleAddFormMutation from 'graphql/PuzzleAddFormMutation';

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
      loading: false,
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
    const { loading, ...input } = this.state;
    if (loading) return;
    this.setState({ loading: true });
    this.props
      .mutate({
        variables: { input: { ...input } },
      })
      .then(({ data }) => {
        const puzzleId = data.createPuzzle.puzzle.rowid;
        this.props.goto(withLocale(`/puzzle/show/${puzzleId}`));
      })
      .catch((error) => {
        this.props.alert(error.message);
        this.setState({ loading: false });
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
        {!this.state.loading && (
          <Button type="submit" block onClick={this.handleSubmit}>
            {<FormattedMessage {...messages.submitLabel} />}
          </Button>
        )}
      </Form>
    );
  }
  // }}}
}

PuzzleAddForm.propTypes = {
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
  goto: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
  goto: (url) => dispatch(push(url)),
});

const withConnect = connect(null, mapDispatchToProps);

const withMutation = graphql(PuzzleAddFormMutation);

export default compose(withConnect, withMutation)(PuzzleAddForm);
