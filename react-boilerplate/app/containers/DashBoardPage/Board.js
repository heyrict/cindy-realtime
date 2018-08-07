import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Panel } from 'rebass';

const BoardHeader = styled.div`
  background-color: #a02d92;
  color: blanchedalmond;
  font-size: 1.2em;
  padding: 5px;
  width: 100%;
`;

const BoardPanel = styled(Panel)`
  min-height: 200px;
  height: 100%;
`;

function Board(props) {
  return (
    <BoardPanel>
      <BoardHeader>{props.title}</BoardHeader>
      {props.content}
    </BoardPanel>
  );
}

Board.propTypes = {
  title: PropTypes.any,
  content: PropTypes.any,
};

export default Board;
