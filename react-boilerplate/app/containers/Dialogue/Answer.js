import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import bulb from 'images/bulb.svg';
import cracker from 'images/cracker.svg';
import { ImgMd } from 'style-store';

import { PuzzleFrame } from 'containers/PuzzleShowPage/Frame';

import messages from './messages';

const Img = ImgMd.extend`
  padding-right: 10px;
`;

function Answer(props) {
  if (props.answer !== null) {
    return (
      <PuzzleFrame>
        {props.good && <Img src={bulb} alt="Good!" />}
        {props.true && <Img src={cracker} alt="Congratulations!" />}
        {props.answer}
      </PuzzleFrame>
    );
  }
  return (
    <PuzzleFrame>
      <FormattedMessage {...messages.waiting} />
    </PuzzleFrame>
  );
}

Answer.propTypes = {
  id: PropTypes.string.isRequired,
  good: PropTypes.bool.isRequired,
  true: PropTypes.bool.isRequired,
  answer: PropTypes.string,
  answeredTime: PropTypes.string,
};

export default Answer;
