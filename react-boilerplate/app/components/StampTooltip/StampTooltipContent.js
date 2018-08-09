import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
import { ImgMd } from 'style-store';

import { chatStamps, puzzleStamps } from 'stamps';

const StampTooltipContent = (props) => (
  <Flex style={{ maxHeight: '8em', overflowY: 'auto' }} flexWrap="wrap">
    {Object.entries(
      Object.assign(
        {},
        props.chatStamps ? chatStamps : {},
        props.puzzleStamps ? puzzleStamps : {},
      ),
    ).map(([name, src]) => (
      <Box
        is="button"
        w={0.25}
        key={name}
        onClick={() => props.onClick(name, src)}
      >
        <ImgMd alt={name} src={src} />
      </Box>
    ))}
  </Flex>
);

StampTooltipContent.propTypes = {
  onClick: PropTypes.func.isRequired,
  chatStamps: PropTypes.bool,
  puzzleStamps: PropTypes.bool,
};

export default StampTooltipContent;
