import React from 'react';
import PropTypes from 'prop-types';
import { Box, Row } from 'rebass';
import Constrained from 'components/Constrained';

import Question from './Question';
import Answer from './Answer';

class Dialog extends React.Component {
  render() {
    return (
      <Constrained level={4} my={10}>
        <Row mx={-1}>
          <Box width={1 / 2} mr={5}>
            <Question
              index={this.props.index}
              question={this.props.node.question}
              id={this.props.node.id}
              user={this.props.node.user}
              created={this.props.node.created}
            />
          </Box>
          <Box width={1 / 2} ml={5}>
            <Answer
              id={this.props.node.id}
              answeredTime={this.props.node.answeredTime}
              answer={this.props.node.answer}
              good={this.props.node.good}
              true={this.props.node.true}
            />
          </Box>
        </Row>
      </Constrained>
    );
  }
}

Dialog.propTypes = {
  index: PropTypes.number.isRequired,
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    good: PropTypes.bool.isRequired,
    true: PropTypes.bool.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string,
    created: PropTypes.string.isRequired,
    answeredTime: PropTypes.string,
  }),
};

export default Dialog;
