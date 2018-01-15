import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { commitMutation, graphql } from 'react-relay';
import environment from 'Environment';
import moment from 'moment';
import bootbox from 'bootbox';
import { line2md, from_global_id as f } from 'common';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector, createSelector } from 'reselect';
import { selectUserNavbarDomain } from 'containers/UserNavbar/selectors';
import { selectPuzzleShowPageDomain } from 'containers/PuzzleShowPage/selectors';

import tick from 'images/tick.svg';
import bulb from 'images/bulb.svg';
import cracker from 'images/cracker.svg';
import { Switch, Box, Flex } from 'rebass';
import { ImgMd, ImgXs } from 'style-store';

import { PuzzleFrame } from 'containers/PuzzleShowPage/Frame';
import UserAwardPopover from 'components/UserAwardPopover';
import {
  StyledInput as Input,
  StyledButton as Button,
} from 'containers/PuzzleShowPage/QuestionPutBox';
import { Splitter, StyledNicknameLink, StyledTime } from './Question';

import messages from './messages';
import { updateAnswer } from './actions';

// {{{ const answerMutation
const answerMutation = graphql`
  mutation AnswerMutation($input: UpdateAnswerInput!) {
    updateAnswer(input: $input) {
      clientMutationId
    }
  }
`;
// }}}

const StyledInput = Input.extend`
  border-radius: 10px;
  margin-bottom: 5px;
`;

const StyledButton = Button.extend`
  padding: 5px 15px;
  border-radius: 10px;
  width: 100%;
`;

export const StyledEditButton = Button.extend`
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 10px;
`;

const Img = ImgMd.extend`
  padding-right: 10px;
`;

export const StyledSwitch = styled(Switch)`
  color: #2075c7;
  margin: 2px 5px;
  background-color: ${(props) => (props.checked ? '#2075C7' : 'transparent')};
  select: {
    padding: 10px;
  }
  &::after {
    background-color: ${(props) =>
      props.checked ? 'blanchedalmond' : '#2075C7'};
  }
`;

class Answer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: props.answer || '',
      good: props.good,
      true: props.true,
      editMode:
        props.owner.rowid === props.user.userId && props.answer === null,
    };

    this.handleChange = (e) => this.setState({ content: e.target.value });
    this.handleKeyDown = (e) => {
      if (e.key === 'Enter') this.handleSubmit();
    };
    this.toggleGood = () => this.setState((s) => ({ good: !s.good }));
    this.toggleTrue = () => this.setState((s) => ({ true: !s.true }));
    this.toggleEditMode = () =>
      this.setState((s) => ({ editMode: !s.editMode }));
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // When a user has two windows open, escape editMode
    // if the answer is updated.
    if (
      this.props.answer !== nextProps.answer ||
      this.props.good !== nextProps.good ||
      this.props.true !== nextProps.true
    ) {
      this.setState({
        editMode:
          nextProps.owner.rowid === nextProps.user.userId &&
          nextProps.answer === null,
      });
    }
  }

  handleSubmit() {
    if (this.state.content === '') return;
    if (
      this.state.content === this.props.answer &&
      this.state.good === this.props.good &&
      this.state.true === this.props.true
    ) {
      this.toggleEditMode();
      return;
    }

    const id = parseInt(f(this.props.id)[1], 10);
    commitMutation(environment, {
      mutation: answerMutation,
      variables: {
        input: {
          dialogueId: id,
          content: this.state.content,
          good: this.state.good,
          true: this.state.true,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
        }
      },
    });
    this.setState({ editMode: false });
  }

  render() {
    if (this.state.editMode === true) {
      return (
        <PuzzleFrame>
          <Box w={1}>
            <FormattedMessage {...messages.answerInputHint}>
              {(msg) => (
                <StyledInput
                  placeholder={msg}
                  value={this.state.content}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                />
              )}
            </FormattedMessage>
            <Flex align="center" justify="center" wrap>
              <Box w={[1, 1 / 2, 5 / 12]}>
                <FormattedMessage {...messages.good} />
                <StyledSwitch
                  checked={this.state.good}
                  onClick={this.toggleGood}
                />
              </Box>
              <Box w={[1, 1 / 2, 5 / 12]}>
                <FormattedMessage {...messages.true} />
                <StyledSwitch
                  checked={this.state.true}
                  onClick={this.toggleTrue}
                />
              </Box>
              <Box w={[1, null, 1 / 6]}>
                <StyledButton onClick={this.handleSubmit}>
                  <ImgXs src={tick} />
                </StyledButton>
              </Box>
            </Flex>
          </Box>
        </PuzzleFrame>
      );
    } else if (this.props.answer !== null && this.props.answer !== '') {
      return (
        <PuzzleFrame>
          <Box width={1}>
            <StyledNicknameLink to={`/profile/${this.props.owner.rowid}`}>
              {this.props.owner.nickname}
            </StyledNicknameLink>
            <UserAwardPopover
              style={{ color: '#006388', fontSize: '1em' }}
              userAward={this.props.owner.currentAward}
            />
            <StyledTime>
              {moment(this.props.answeredTime).format('YYYY-MM-DD HH:mm')}
            </StyledTime>
          </Box>
          <Splitter />
          {this.props.good && (
            <Img style={{ padding: '5px 2px' }} src={bulb} alt="Good!" />
          )}
          {this.props.true && <Img src={cracker} alt="Congratulations!" />}
          <span
            style={{
              fontSize:
                (this.props.true && '1.3em') ||
                (this.props.good && '1.15em') ||
                '1em',
            }}
            dangerouslySetInnerHTML={{ __html: line2md(this.props.answer) }}
          />
          {this.props.owner.rowid === this.props.user.userId &&
            this.props.puzzleStatus === 0 && (
              <FormattedMessage {...messages.edit}>
                {(msg) => (
                  <StyledEditButton onClick={this.toggleEditMode}>
                    {msg}
                  </StyledEditButton>
                )}
              </FormattedMessage>
            )}
        </PuzzleFrame>
      );
    }
    return (
      <PuzzleFrame>
        <FormattedMessage {...messages.waiting} />
      </PuzzleFrame>
    );
  }
}

Answer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  good: PropTypes.bool.isRequired,
  true: PropTypes.bool.isRequired,
  answer: PropTypes.string,
  answeredTime: PropTypes.string,
  owner: PropTypes.object.isRequired,
  user: PropTypes.object,
  puzzleStatus: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  owner: createSelector(
    selectPuzzleShowPageDomain,
    (substate) => substate.get('puzzle').user
  ),
  puzzleStatus: createSelector(
    selectPuzzleShowPageDomain,
    (substate) => substate.get('puzzle').status
  ),
  user: createSelector(selectUserNavbarDomain, (substate) =>
    substate.get('user').toJS()
  ),
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Answer);
