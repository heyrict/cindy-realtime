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
  border-radius: 10px;
  border: 2px solid mediumslateblue;
  color: #fcf4dc;
  display: inline-block;
  font-family: monaco;
  font-size: 0.9em;
  font-weight: bold;
  margin-bottom: 3px;
  margin-right: 6px;
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
