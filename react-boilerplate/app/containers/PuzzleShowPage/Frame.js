import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { text2md } from 'common';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Flex, Box } from 'rebass';
import { StyledNicknameLink } from 'components/UserLabel';
import UserAwardPopover from 'components/UserAwardPopover';

import messages from './messages';

const PuzzleFrame = styled(Box)`
  border-radius: 10px;
  border: 2px solid #b928d7;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.5);
`;

const Label = styled.span`
  padding: 5px;
  font-size: 1.1em;
  color: #4877d7;
`;

const PuzzleUserLabel = StyledNicknameLink.extend`
  padding: 5px;
  font-size: 1.1em;
  color: #033393;
`;

const RightBox = styled(Box)`
  text-align: right;
`;

const ContentBox = styled(Box)`
  font-size: 1.2em;
  font-family: 'Dejavu Sans';
`;

function Frame(props) {
  return (
    <Flex wrap ml={-2} pl={2} mb={20} justify="center" align="center">
      <Box width={[1 / 16, 1 / 12, 1 / 10, 1 / 8]} />
      <PuzzleFrame width={[7 / 8, 5 / 6, 4 / 5, 3 / 4]}>
        <ContentBox
          pl={10}
          dangerouslySetInnerHTML={{ __html: text2md(props.text) }}
        />
        <br />
        {props.user ? (
          <FormattedMessage {...messages.creator}>
            {(c) => (
              <RightBox>
                <Label>{c}:</Label>
                <PuzzleUserLabel to={`/profile/${props.user.rowid}`}>
                  {props.user.nickname}
                </PuzzleUserLabel>
                <UserAwardPopover
                  style={{ color: '#033393' }}
                  userAward={props.user.currentAward}
                />
              </RightBox>
            )}
          </FormattedMessage>
        ) : null}
        {props.time ? (
          <FormattedMessage {...messages.created}>
            {(c) => (
              <RightBox>
                <Label>
                  {c}: {moment(props.time).format('llll')}
                </Label>
              </RightBox>
            )}
          </FormattedMessage>
        ) : null}
      </PuzzleFrame>
      <Box width={[1 / 16, 1 / 12, 1 / 10, 1 / 8]} />
    </Flex>
  );
}

Frame.propTypes = {
  text: PropTypes.string.isRequired,
  user: PropTypes.object,
  time: PropTypes.string,
};

export default Frame;
