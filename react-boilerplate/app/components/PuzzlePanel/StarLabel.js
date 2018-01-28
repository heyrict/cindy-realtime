/**
 *
 * StarLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PuzzleScore = styled.span`
  background-color: darkorchid;
  font-family: monaco;
  font-weight: bold;
  font-size: 0.9em;
  color: #fcf4dc;
  border: 2px solid darkorchid;
  border-radius: 10px;
  margin-right: 6px;
`;

function StarLabel(props) {
  const { starCount, starSum } = props;
  if (starCount > 0) {
    return (
      <PuzzleScore>
        <span className="glyphicon glyphicon-star" />
        <span>{`${starSum}(${starCount})`}</span>
      </PuzzleScore>
    );
  }
  return null;
}

StarLabel.propTypes = {
  starCount: PropTypes.number.isRequired,
  starSum: PropTypes.number.isRequired,
};

export default StarLabel;
