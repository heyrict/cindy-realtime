import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
import { ImgMd } from 'style-store';

import { stamps } from 'stamps';

const StampTooltipContent = (props) => (
      <Flex style={{ maxHeight: '8em' }}>
        {Object.entries(stamps).map(([name, src]) => (
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
};

export default StampTooltipContent;
