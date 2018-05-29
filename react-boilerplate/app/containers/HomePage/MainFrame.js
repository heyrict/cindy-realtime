import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'rebass';
import { Button } from 'style-store';
import { line2md, pushWithLocale } from 'common';
import cindychan from 'images/cindychan.png';

import messages from './messages';

const H1 = styled.h1`
  color: burlywood;
  font-family: inconsolata, consolas, arial;
  @media (max-width: 720px) {
    font-size: 2.3em;
  }
  @media (min-width: 720px) {
    font-size: 4em;
  }
`;

const IntroBox = styled(Box)`
  border-radius: 10px;
  background: burlywood;
  line-height: 1.5em;
  align-self: center;
  @media (max-width: 600px) {
    font-size: 1.1em;
  }
  @media (min-width: 600px) {
    font-size: 1.6em;
  }
`;

const StartBox = Button.extend`
  font-weight: bold;
  color: #4e182d;
  background: burlywood;
  border-radius: 10px;
  text-align: center;
  &:active {
    color: burlywood;
    background: #4e182d;
  }
  @media (max-width: 600px) {
    font-size: 2em;
  }
  @media (min-width: 600px) {
    font-size: 3em;
  }
`;

function MainFrame(props) {
  return (
    <div>
      <Flex justifyContent="center">
        <H1>
          <FormattedMessage
            {...messages.header}
            values={{ cindy: <b>Cindy</b> }}
          />
        </H1>
      </Flex>
      <Flex mx={1} pt={20} pb={20}>
        <IntroBox w={[0.5, 0.618, 0.7, 0.8]} m={20} p={10}>
          <FormattedMessage {...messages.body}>
            {(msg) => (
              <div dangerouslySetInnerHTML={{ __html: line2md(msg) }} />
            )}
          </FormattedMessage>
        </IntroBox>
        <Box w={[0.5, 0.382, 0.3, 0.2]}>
          <img style={{ width: '100%' }} src={cindychan} alt="Mrs. Cindy" />
        </Box>
      </Flex>
      <Flex>
        <StartBox
          w={1}
          mx={30}
          my={10}
          onClick={() => props.dispatch(pushWithLocale('/puzzle'))}
        >
          <FormattedMessage {...messages.start} />
        </StartBox>
      </Flex>
    </div>
  );
}

MainFrame.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(null, mapDispatchToProps)(MainFrame);
