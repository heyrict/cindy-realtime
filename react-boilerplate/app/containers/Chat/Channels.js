import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'rebass';
import { ButtonOutline } from 'style-store';
import { PublicChannels } from './constants';
import messages from './messages';

const StyledButton = ButtonOutline.extend`
  border-radius: 5px;
`;

function Channels(props) {
  return (
    <div>
      <StyledButton w={1} py={20} my={5} onClick={() => props.tune(null)}>
        <FormattedMessage {...messages.defaultChannel} />
      </StyledButton>
      {PublicChannels.map((c) => (
        <StyledButton
          w={1}
          py={20}
          my={5}
          onClick={() => props.tune(c)}
          key={c}
        >
          {c}
        </StyledButton>
      ))}
    </div>
  );
}

Channels.propTypes = {
  tune: PropTypes.func.isRequired,
};

export default Channels;
