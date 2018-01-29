/**
 *
 * CommentLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ImgXs } from 'style-store';
import comment from 'images/comment.svg';

const PuzzleComments = styled.span`
  background-color: mediumslateblue;
  font-family: monaco;
  font-weight: bold;
  font-size: 0.9em;
  color: #fcf4dc;
  border: 2px solid mediumslateblue;
  border-radius: 10px;
  padding: 0 2px;
`;

function CommentLabel(props) {
  const { commentCount } = props;
  if (commentCount > 0) {
    return (
      <PuzzleComments>
        <ImgXs src={comment} alt="comment" />
        <span style={{ paddingLeft: '2px' }}>{commentCount}</span>
      </PuzzleComments>
    );
  }
  return null;
}

CommentLabel.propTypes = {
  commentCount: PropTypes.number.isRequired,
};

export default CommentLabel;
