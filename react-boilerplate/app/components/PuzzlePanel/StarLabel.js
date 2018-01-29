/**
 *
 * StarLabel
 *
 */

/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { OverlayTrigger, Popover } from 'react-bootstrap';

const PuzzleScore = styled.button`
  background-color: darkorchid;
  font-family: monaco;
  font-weight: bold;
  font-size: 0.9em;
  color: #fcf4dc;
  border: 2px solid darkorchid;
  border-radius: 10px;
  padding: 0 2px;
`;

function StarLabel(props) {
  const { starSet } = props;
  let starCount = 0;
  let starSum = 0;
  const starDict = [[], [], [], [], []];
  starSet.edges.forEach((edge) => {
    starCount += 1;
    starSum += edge.node.value;
    if (edge.node.value - 1 in starDict) {
      starDict[edge.node.value - 1] = starDict[edge.node.value - 1].concat(
        edge.node.user.nickname
      );
    }
  });
  const overlay = (
    <Popover id={`popover-${props.puzzleId}`}>
      {starDict.map(
        (list, index) =>
          list.length > 0 && (
            <div key={`popover-${props.puzzleId}-${index}`}>
              {index + 1}★: {list.join(', ')}
            </div>
          )
      )}
    </Popover>
  );
  if (starCount > 0) {
    return (
      <OverlayTrigger
        trigger="click"
        placement="top"
        rootClose
        overlay={overlay}
      >
        <PuzzleScore>
          <span className="glyphicon glyphicon-star" />
          <span>{`${starCount}(${starSum})`}</span>
        </PuzzleScore>
      </OverlayTrigger>
    );
  }
  return null;
}

StarLabel.propTypes = {
  starSet: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  puzzleId: PropTypes.string.isRequired,
};

export default StarLabel;
