import React from 'react';
import PropTypes from 'prop-types';
import { Box, Row } from 'rebass';
import Constrained from 'components/Constrained';

import Question from './Question';
import Answer from './Answer';

const Dialogue = (props) => (
  <Constrained level={4} my={10}>
    <Row mx={-1}>
      <Box width={1 / 2} mr={5}>
        <Question
          index={props.index}
          question={props.node.question}
          id={props.node.id}
          user={props.node.user}
          created={props.node.created}
          answered={Boolean(props.node.answer)}
          questionEditTimes={props.node.questionEditTimes}
          status={props.status}
        />
      </Box>
      <Box width={1 / 2} ml={5}>
        <Answer
          id={props.node.id}
          answeredtime={props.node.answeredtime}
          answer={props.node.answer}
          answerEditTimes={props.node.answerEditTimes}
          good={props.node.good}
          true={props.node.true}
          status={props.status}
        />
      </Box>
    </Row>
  </Constrained>
);

Dialogue.propTypes = {
  index: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    good: PropTypes.bool.isRequired,
    true: PropTypes.bool.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string,
    created: PropTypes.string.isRequired,
    answeredtime: PropTypes.string,
    answerEditTimes: PropTypes.number.isRequired,
    questionEditTimes: PropTypes.number.isRequired,
  }),
};

export default Dialogue;
