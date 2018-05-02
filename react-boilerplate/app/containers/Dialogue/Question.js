import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { line2md, from_global_id as f } from 'common';
import { nAlert } from 'containers/Notifier/actions';
import { createStructuredSelector, createSelector } from 'reselect';
import { selectUserNavbarDomain } from 'containers/UserNavbar/selectors';

import { graphql } from 'react-apollo';
import updateQuestionMutation from 'graphql/UpdateQuestionMutation';

import { Flex, Box } from 'rebass';
import { OPTIONS_SEND } from 'containers/Settings/constants';
import {
  EditButton,
  ButtonOutline,
  ImgXs,
  Indexer,
  AutoResizeTextarea as DefaultTextarea,
  PuzzleFrame,
  Splitter,
  Time,
} from 'style-store';
import UserLabel from 'components/UserLabel';
import tick from 'images/tick.svg';
import cross from 'images/cross.svg';

import messages from './messages';

const Textarea = DefaultTextarea.extend`
  min-height: 75px;
  max-height: 200px;
`;

const StyledButton = ButtonOutline.extend`
  padding: 5px 15px;
  margin-bottom: 5px;
  width: 100%;
`;

class Question extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { editMode: false, question: props.question };
    this.handleChange = (e) => this.setState({ question: e.target.value });
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.toggleEditMode = (m) =>
      this.setState((s) => ({ editMode: m || !s.editMode }));
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleKeyPress(e) {
    const content = this.state.question;
    switch (this.props.sendPolicy) {
      case OPTIONS_SEND.NONE:
        break;
      case OPTIONS_SEND.ON_SHIFT_RETURN:
        if (e.nativeEvent.keyCode === 13 && e.nativeEvent.shiftKey) {
          this.handleSubmit();
        }
        break;
      case OPTIONS_SEND.ON_RETURN:
        if (e.nativeEvent.keyCode === 13 && !e.nativeEvent.shiftKey) {
          if (content[content.length - 1] === '\n') {
            this.handleSubmit();
          }
        }
        break;
      default:
    }
  }

  handleSubmit() {
    this.setState((p) => ({ question: p.question.trimRight() }));

    if (this.state.question.trimRight() === this.props.question.trimRight()) {
      this.toggleEditMode(false);
      return;
    }

    const id = parseInt(f(this.props.id)[1], 10);
    this.props
      .mutate({
        variables: {
          input: {
            question: this.state.question.trimRight(),
            dialogueId: id,
          },
        },
      })
      .then(() => {
        this.toggleEditMode(false);
      })
      .catch((error) => {
        this.props.alert(error.message);
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
                onKeyUp={this.handleKeyPress}
              />
            </Box>
            <Box w={[1 / 3, 1 / 6, 1 / 8]} mr={1}>
              <StyledButton onClick={() => this.toggleEditMode(false)}>
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
          <UserLabel user={this.props.user} />
          <Time>{moment(this.props.created).format('YYYY-MM-DD HH:mm')}</Time>
        </Box>
        <Splitter />
        <Box width={1} style={{ overflow: 'auto' }}>
          <span
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
                  <EditButton onClick={() => this.toggleEditMode(true)}>
                    {msg}
                  </EditButton>
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
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
  sendPolicy: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: createSelector(selectUserNavbarDomain, (substate) =>
    substate.get('user').toJS()
  ),
});

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withMutation = graphql(updateQuestionMutation);

export default compose(withConnect, withMutation)(Question);
