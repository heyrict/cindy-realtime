import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Box, Flex } from 'rebass';
import Constrained from 'components/Constrained';
import { ButtonOutline, Input } from 'style-store';

import { graphql } from 'react-apollo';
import putQuestionMutation from 'graphql/CreateQuestionMutation';

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
    if (!this.props.currentUserId) return;

    this.props
      .mutate({
        variables: {
          input: {
            content: this.state.content,
            puzzleId: this.props.puzzleId,
          },
        },
      })
      .then(() => {})
      .catch((error) => {
        bootbox.alert(error.message);
      });
    this.setState({ content: '' });
  }

  render() {
    return (
      <Constrained level={3}>
        <Flex mx={-1}>
          <FormattedMessage
            {...messages[this.props.currentUserId ? 'input' : 'disableInput']}
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
                  disabled={!this.props.currentUserId}
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
  mutate: PropTypes.func.isRequired,
  puzzleId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const withConnect = connect(null, mapDispatchToProps);

const withMutation = graphql(putQuestionMutation);

export default compose(withConnect, withMutation)(QuestionPutBox);
