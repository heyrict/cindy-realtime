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
import { createStructuredSelector, createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { withLocale, to_global_id as t } from 'common';
import { nAlert } from 'containers/Notifier/actions';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
import { MIN_CONTENT_SAFE_CREDIT } from 'settings';

import { Input, Select, ButtonOutline as Button } from 'style-store';
import FieldGroup from 'components/FieldGroup';
import PreviewEdit from 'components/PreviewEdit';
import HelpPopper from 'components/HelpPopper';
import genreMessages from 'components/TitleLabel/messages';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PuzzleAddFormMutation from 'graphql/PuzzleAddFormMutation';
import UserLabel from 'graphql/UserLabel';

import messages from './messages';

export class PuzzleAddForm extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  // {{{ constructor
  constructor(props) {
    super(props);
    this.state = {
      puzzleTitle: '',
      puzzleGenre: 0,
      puzzleYami: 0,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // }}}
  // {{{ handleChange
  handleChange(e) {
    const target = e.target;
    if (target.id === 'formPuzzleAddTitle') {
      this.setState({ puzzleTitle: target.value });
    } else if (target.id === 'formPuzzleAddGenre') {
      this.setState({ puzzleGenre: target.value });
    } else if (target.id === 'formPuzzleAddYami') {
      this.setState({ puzzleYami: target.value });
    }
  }
  // }}}
  // {{{ handleSubmit
  handleSubmit(e) {
    e.preventDefault();
    const { loading, puzzleTitle, puzzleGenre, puzzleYami } = this.state;
    const puzzleContent =
      this.contentTextarea && this.contentTextarea.getContent();
    const puzzleSolution =
      this.solutionTextarea && this.solutionTextarea.getContent();
    if (loading) return;
    this.setState({ loading: true });
    this.props
      .mutate({
        variables: {
          input: {
            puzzleTitle,
            puzzleGenre,
            puzzleYami,
            puzzleContent,
            puzzleSolution,
          },
        },
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
      <div>
        <FieldGroup
          id="formPuzzleAddTitle"
          label={<FormattedMessage {...messages.titleLabel} />}
          Ctl={Input}
          type="text"
          value={this.state.puzzleTitle}
          onChange={this.handleChange}
        />
        <FieldGroup
          label={
            <span>
              <FormattedMessage {...messages.genreLabel} />
              <HelpPopper messageId="puzzle_genre" />
            </span>
          }
          CtlElement={
            <Select
              componentClass="select"
              value={this.state.puzzleGenre}
              onChange={this.handleChange}
              id="formPuzzleAddGenre"
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
            </Select>
          }
        />
        <FieldGroup
          label={
            <span>
              <FormattedMessage {...messages.yamiLabel} />
              <HelpPopper messageId="puzzle_yami" />
            </span>
          }
          CtlElement={
            <Select
              componentClass="select"
              value={this.state.puzzleYami}
              onChange={this.handleChange}
              id="formPuzzleAddYami"
            >
              <FormattedMessage {...genreMessages.none}>
                {(msg) => (
                  <option value={0} key={0}>
                    {msg}
                  </option>
                )}
              </FormattedMessage>
              <FormattedMessage {...genreMessages.yami}>
                {(msg) => (
                  <option value={1} key={1}>
                    {msg}
                  </option>
                )}
              </FormattedMessage>
              <FormattedMessage {...genreMessages.longtermYami}>
                {(msg) => (
                  <option value={2} key={2}>
                    {msg}
                  </option>
                )}
              </FormattedMessage>
            </Select>
          }
        />
        <FieldGroup
          id="formPuzzleAddContent"
          label={
            <span>
              <FormattedMessage {...messages.contentLabel} />
              <HelpPopper messageId="puzzle_content" />
            </span>
          }
          CtlElement={
            <PreviewEdit
              ref={(ref) => (this.contentTextarea = ref)}
              safe={
                this.props.currentUser
                  ? this.props.currentUser.credit > MIN_CONTENT_SAFE_CREDIT
                  : true
              }
            />
          }
        />
        <FieldGroup
          id="formPuzzleAddSolution"
          label={
            <span>
              <FormattedMessage {...messages.solutionLabel} />
              <HelpPopper messageId="puzzle_solution" />
            </span>
          }
          CtlElement={
            <PreviewEdit
              ref={(ref) => (this.solutionTextarea = ref)}
              safe={
                this.props.currentUser
                  ? this.props.currentUser.credit > MIN_CONTENT_SAFE_CREDIT
                  : true
              }
            />
          }
        />
        {!this.state.loading && (
          <Button
            w={1}
            py={1}
            onClick={this.handleSubmit}
            disabled={!this.props.currentUser}
          >
            {<FormattedMessage {...messages.submitLabel} />}
          </Button>
        )}
      </div>
    );
  }
  // }}}
}

PuzzleAddForm.propTypes = {
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
  goto: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    credit: PropTypes.number,
  }),
};

const mapStateToProps = createStructuredSelector({
  currentUserId: createSelector(
    makeSelectUserNavbar(),
    (usernav) => usernav.user && usernav.user.userId
  ),
});

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
  goto: (url) => dispatch(push(url)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withMutation = graphql(PuzzleAddFormMutation);

const withCurrentUser = graphql(
  gql`
    query($id: ID!) {
      user(id: $id) {
        ...UserLabel_user
      }
    }
    ${UserLabel}
  `,
  {
    options: ({ currentUserId }) => ({
      variables: {
        id: t('UserNode', currentUserId || '-1'),
      },
      fetchPolicy: 'cache-first',
    }),
    props({ data }) {
      const { user: currentUser } = data;
      return { currentUser };
    },
  }
);

export default compose(
  withConnect,
  withCurrentUser,
  withMutation
)(PuzzleAddForm);
