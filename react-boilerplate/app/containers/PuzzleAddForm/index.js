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
import { withLocale, to_global_id as t, text2md } from 'common';
import { nAlert } from 'containers/Notifier/actions';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
import { MIN_CONTENT_SAFE_CREDIT } from 'settings';

import { Input, Select, ButtonOutline, ImgXs } from 'style-store';
import ButtonSelect from 'components/ButtonSelect';
import FieldGroup from 'components/FieldGroup';
import PreviewEdit from 'components/PreviewEdit';
import HelpPopper from 'components/HelpPopper';
import genreMessages from 'components/TitleLabel/messages';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PuzzleAddFormMutation from 'graphql/PuzzleAddFormMutation';
import UserLabel from 'graphql/UserLabel';

import cross from 'images/cross.svg';
import tick from 'images/tick.svg';

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
      puzzleAnonymous: false,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = (target, value) =>
      this.setState({ [target]: value });
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // }}}
  // {{{ handleChange
  handleChange(e) {
    const { target } = e;
    if (target.id === 'formPuzzleAddTitle') {
      this.setState({ puzzleTitle: target.value });
    } else if (target.id === 'formPuzzleAddGenre') {
      this.setState({ puzzleGenre: target.value });
    } else if (target.id === 'formPuzzleAddYami') {
      this.setState({ puzzleYami: target.value });
    } else if (target.id === 'formPuzzleAddAnonymous') {
      this.setState({ puzzleAnonymous: target.value });
    }
  }
  // }}}
  // {{{ handleSubmit
  handleSubmit(e) {
    e.preventDefault();
    const {
      loading,
      puzzleTitle,
      puzzleGenre,
      puzzleYami,
      puzzleAnonymous,
    } = this.state;
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
            puzzleAnonymous,
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
            <ButtonSelect
              value={this.state.puzzleGenre}
              onChange={(option) =>
                this.handleSelectChange('puzzleGenre', option.value)
              }
              options={[
                {
                  value: 0,
                  label: <FormattedMessage {...genreMessages.classic} />,
                },
                {
                  value: 1,
                  label: (
                    <FormattedMessage {...genreMessages.twentyQuestions} />
                  ),
                },
                {
                  value: 2,
                  label: <FormattedMessage {...genreMessages.littleAlbat} />,
                },
                {
                  value: 3,
                  label: <FormattedMessage {...genreMessages.others} />,
                },
              ]}
            />
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
            <ButtonSelect
              value={this.state.puzzleYami}
              onChange={(option) =>
                this.handleSelectChange('puzzleYami', option.value)
              }
              options={[
                {
                  value: 0,
                  label: <FormattedMessage {...genreMessages.none} />,
                },
                {
                  value: 1,
                  label: <FormattedMessage {...genreMessages.yami} />,
                },
                {
                  value: 2,
                  label: <FormattedMessage {...genreMessages.longtermYami} />,
                },
              ]}
            />
          }
        />
        <FieldGroup
          id="formPuzzleAddAnonymous"
          label={<FormattedMessage {...messages.anonymousLabel} />}
          CtlElement={
            <ButtonSelect
              value={this.state.puzzleAnonymous}
              onChange={(option) =>
                this.handleSelectChange('puzzleAnonymous', option.value)
              }
              options={[
                { value: false, label: '×' },
                { value: true, label: '○' },
              ]}
            />
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
        <FieldGroup
          CtlElement={
            <FormattedMessage {...messages.previewEditUsage}>
              {(msg) => (
                <span
                  style={{ overflowY: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: text2md(msg) }}
                />
              )}
            </FormattedMessage>
          }
        />
        {!this.state.loading && (
          <ButtonOutline
            w={1}
            py={1}
            onClick={this.handleSubmit}
            disabled={!this.props.currentUser}
          >
            {<FormattedMessage {...messages.submitLabel} />}
          </ButtonOutline>
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
    (usernav) => usernav.user && usernav.user.userId,
  ),
});

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
  goto: (url) => dispatch(push(url)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
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
  },
);

export default compose(
  withConnect,
  withCurrentUser,
  withMutation,
)(PuzzleAddForm);
