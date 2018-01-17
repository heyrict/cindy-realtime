import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Box, Flex } from 'rebass';
import Constrained from 'components/Constrained';
import { ButtonOutline, Input } from 'style-store';

import { commitMutation } from 'react-relay';
import putQuestionMutation from 'graphql/CreateQuestionMutation';
import environment from 'Environment';

import messages from './messages';

class QuestionPutBox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
    };
    this.handleKeyDown = (e) => {
      if (e.key === 'Enter') this.handleSubmit();
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(e) {
    this.setState({ content: e.target.value });
  }

  handleSubmit() {
    if (this.state.content === '') return;

    commitMutation(environment, {
      mutation: putQuestionMutation,
      variables: {
        input: {
          content: this.state.content,
          puzzleId: this.props.puzzleId,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          console.log(errors);
        }
      },
    });
    this.setState({ content: '' });
  }

  render() {
    return (
      <Constrained level={3}>
        <Flex mx={-1}>
          <FormattedMessage
            {...messages[
              this.props.currentUserId === undefined ? 'disableInput' : 'input'
            ]}
          >
            {(msg) => (
              <Input
                value={this.state.content}
                disabled={this.props.currentUserId === undefined}
                placeholder={msg}
                onChange={this.handleInput}
                onKeyDown={this.handleKeyDown}
              />
            )}
          </FormattedMessage>
          <Box>
            <FormattedMessage {...messages.putQuestion}>
              {(msg) => (
                <ButtonOutline
                  onClick={this.handleSubmit}
                  disabled={this.props.currentUserId === undefined}
                  style={{ wordBreak: 'keep-all' }}
                >
                  {msg}
                </ButtonOutline>
              )}
            </FormattedMessage>
          </Box>
        </Flex>
      </Constrained>
    );
  }
}

QuestionPutBox.propTypes = {
  dispatch: PropTypes.func.isRequired,
  puzzleId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(null, mapDispatchToProps)(QuestionPutBox);
