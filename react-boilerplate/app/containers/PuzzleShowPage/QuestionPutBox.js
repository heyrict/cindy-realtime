import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { ButtonOutline, Box, Flex } from 'rebass';
import Constrained from 'components/Constrained';

import { commitMutation, graphql } from 'react-relay';
import environment from 'Environment';

import messages from './messages';

// {{{ const putQuestionMutation
const putQuestionMutation = graphql`
  mutation QuestionPutBoxMutation($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      clientMutationId
    }
  }
`;
// }}}

export const StyledButton = styled(ButtonOutline)`
  border-radius: 0 10px 10px 0;
  color: #2075c7;
  font-weight: bold;
  &:hover {
    color: blanchdalmond;
    background-color: #2075c7;
  }
`;

export const StyledInput = styled.input`
  border-radius: 10px 0 0 10px;
  border-color: #2075c7;
  padding: 5px;
  width: 100%;
  color: #073642;
  font-size: 1.1em;
  box-shadow: inset 0 0 0 1px #2075c7;
  &:focus {
    box-shadow: inset 0 0 0 2px #2075c7;
  }
`;

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
              <StyledInput
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
                <StyledButton
                  onClick={this.handleSubmit}
                  disabled={this.props.currentUserId === undefined}
                  style={{ wordBreak: 'keep-all' }}
                >
                  {msg}
                </StyledButton>
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
