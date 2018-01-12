import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import good from 'images/good.svg';
import victory from 'images/victory.svg';
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
        {props.good && <Img src={good} alt="Good!" />}
        {props.true && <Img src={victory} alt="Victory!" />}
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
