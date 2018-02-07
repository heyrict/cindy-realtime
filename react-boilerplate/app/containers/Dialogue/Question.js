import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { line2md, from_global_id as f } from 'common';
import { commitMutation } from 'react-relay';
import environment from 'Environment';
import { createStructuredSelector, createSelector } from 'reselect';
import { selectUserNavbarDomain } from 'containers/UserNavbar/selectors';
import { FormattedMessage } from 'react-intl';
import updateQuestionMutation from 'graphql/UpdateQuestionMutation';
import bootbox from 'bootbox';
import { Flex, Box } from 'rebass';
import UserAwardPopover from 'components/UserAwardPopover';
import {
  DarkNicknameLink as NicknameLink,
  EditButton,
  ButtonOutline,
  ImgXs,
  Indexer,
  Textarea,
  PuzzleFrame,
  Splitter,
  Time,
} from 'style-store';
import tick from 'images/tick.svg';
import cross from 'images/cross.svg';

import messages from './messages';

const StyledButton = ButtonOutline.extend`
  padding: 5px 15px;
  margin-bottom: 5px;
  border-radius: 10px;
  width: 100%;
`;

class Question extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { editMode: false, question: props.question };
    this.handleChange = (e) => this.setState({ question: e.target.value });
    this.toggleEditMode = () =>
      this.setState((s) => ({ editMode: !s.editMode }));
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // When a user has two windows open, escape editMode
    // if the answer is updated.
    if (this.props.question !== nextProps.question) {
      this.setState({
        editMode: false,
        question: nextProps.question,
      });
    }
  }

  handleSubmit() {
    const id = parseInt(f(this.props.id)[1], 10);
    commitMutation(environment, {
      mutation: updateQuestionMutation,
      variables: {
        input: {
          question: this.state.question,
          dialogueId: id,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
        }
        this.toggleEditMode();
      },
    });
  }

  render() {
    if (this.state.editMode === true) {
      return (
        <PuzzleFrame>
          <Flex align="center" mx={-1}>
            <Box w={[2 / 3, 5 / 6, 7 / 8]} mx={1}>
              <Textarea
                value={this.state.question}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
              />
            </Box>
            <Box w={[1 / 3, 1 / 6, 1 / 8]} mr={1}>
              <StyledButton onClick={this.toggleEditMode}>
                <ImgXs src={cross} />
              </StyledButton>
              <StyledButton onClick={this.handleSubmit}>
                <ImgXs src={tick} />
              </StyledButton>
            </Box>
          </Flex>
        </PuzzleFrame>
      );
    }
    return (
      <PuzzleFrame>
        <Box width={1}>
          <Indexer>{this.props.index}</Indexer>
          <NicknameLink to={`/profile/show/${this.props.user.rowid}`}>
            {this.props.user.nickname}
          </NicknameLink>
          <UserAwardPopover
            style={{ color: '#006388', fontSize: '1em' }}
            userAward={this.props.user.currentAward}
          />
          <Time>{moment(this.props.created).format('YYYY-MM-DD HH:mm')}</Time>
        </Box>
        <Splitter />
        <Box width={1}>
          <span
            style={{ overflow: 'auto' }}
            dangerouslySetInnerHTML={{ __html: line2md(this.props.question) }}
          />
          {this.props.questionEditTimes > 0 && (
            <Time>
              <FormattedMessage
                {...messages.edited}
                values={{ times: this.props.questionEditTimes }}
              />
            </Time>
          )}
          {this.props.user.rowid === this.props.currentUser.userId &&
            this.props.status === 0 &&
            !this.props.answered && (
              <FormattedMessage {...messages.edit}>
                {(msg) => (
                  <EditButton onClick={this.toggleEditMode}>{msg}</EditButton>
                )}
              </FormattedMessage>
            )}
        </Box>
      </PuzzleFrame>
    );
  }
}

Question.propTypes = {
  index: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  answered: PropTypes.bool.isRequired,
  question: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  created: PropTypes.string.isRequired,
  questionEditTimes: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: createSelector(selectUserNavbarDomain, (substate) =>
    substate.get('user').toJS()
  ),
});

export default connect(mapStateToProps)(Question);
