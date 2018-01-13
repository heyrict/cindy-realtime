import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ButtonOutline, Box, Flex } from 'rebass';
import Constrained from 'components/Constrained';

import { commitMutation, graphql } from 'react-relay';
import environment from 'Environment';

import { putQuestion } from './actions';

// {{{ const putQuestionMutation
const putQuestionMutation = graphql`
  mutation QuestionPutBoxMutation($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      dialogue {
        id
        user {
          rowid
          nickname
          currentAward {
            id
            created
            award {
              id
              name
              description
            }
          }
        }
        good
        true
        question
        answer
        created
        answeredtime
      }
    }
  }
`;
// }}}

const StyledButton = styled(ButtonOutline)`
  border-radius: 0 10px 10px 0;
  color: violet;
  font-weight: bold;
  &:hover {
    color: blanchdalmond;
    background-color: violet;
  }
`;

const StyledInput = styled.input`
  border-radius: 10px 0 0 10px;
  border-color: violet;
  padding: 5px;
  width: 100%;
  color: #073642;
  font-size: 1.1em;
  box-shadow: inset 0 0 0 1px #ccc;
  &:focus {
    box-shadow: inset 0 0 0 2px violet;
  }
`;

class QuestionPutBox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(e) {
    this.setState({ content: e.target.value });
  }

  handleSubmit() {
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
        } else if (response) {
          const dialogue = response.createQuestion.dialogue;
          // TODO: Update Global User Interface here
          this.props.dispatch(
            putQuestion({
              dialogue,
            })
          );
        }
      },
    });
    this.setState({ content: '' });
  }

  render() {
    return (
      <Constrained level={3}>
        <Flex mx={-1}>
          <StyledInput
            value={this.state.content}
            placeholder="Input"
            onChange={this.handleInput}
          />
          <Box>
            <StyledButton onClick={this.handleSubmit}>Submit</StyledButton>
          </Box>
        </Flex>
      </Constrained>
    );
  }
}

QuestionPutBox.propTypes = {
  dispatch: PropTypes.func.isRequired,
  puzzleId: PropTypes.number.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(null, mapDispatchToProps)(QuestionPutBox);
