/**
*
* StarLabel
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';


function StarLabel() {
    const scale_one = num => Math.floor(num * 10) / 10;
    const starCount = props.starCount,
      starSum = props.starSum;
    if (starCount > 0) {
      return (
        <span className="puzzle_score">
          {"✯" + starSum + "(" + starCount + ")"}
        </span>
      );
    } else {
      return "";
    }
}

StarLabel.propTypes = {
  starCount: PropTypes.number.isRequired,
  starSum: PropTypes.number.isRequired
};

export default StarLabel;
