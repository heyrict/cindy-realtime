import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { text2md, withLocale } from 'common';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Box } from 'rebass';
import { DarkNicknameLink as NicknameLink, PuzzleFrame } from 'style-store';
import UserAwardPopover from 'components/UserAwardPopover';

import Constrained from 'components/Constrained';
import GoogleAd from 'components/GoogleAd';
import { googleAdInfo } from 'settings';

import messages from './messages';

const Label = styled.span`
  padding: 5px;
  font-size: 1.1em;
  color: #4877d7;
`;

const PuzzleUserLabel = NicknameLink.extend`
  padding: 5px;
  font-size: 1.1em;
  color: #033393;
`;

const RightBox = styled(Box)`
  text-align: right;
`;

const ContentBox = styled(Box)`
  overflow: auto;
  font-size: 1.2em;
  font-family: 'Dejavu Sans';
`;

function Frame(props) {
  return (
    <Constrained mt={20} mb={20}>
      <PuzzleFrame>
        <ContentBox
          pl={10}
          dangerouslySetInnerHTML={{ __html: text2md(props.text) }}
        />
        <GoogleAd {...googleAdInfo.textAd} />
        <br />
        {props.user ? (
          <FormattedMessage {...messages.creator}>
            {(c) => (
              <RightBox>
                <Label>{c}:</Label>
                <PuzzleUserLabel
                  to={withLocale(`/profile/show/${props.user.rowid}`)}
                >
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
        {props.created ? (
          <FormattedMessage {...messages.created}>
            {(c) => (
              <RightBox>
                <Label>
                  {c}: {moment(props.created).format('llll')}
                </Label>
              </RightBox>
            )}
          </FormattedMessage>
        ) : null}
        {props.solved ? (
          <FormattedMessage {...messages.solved}>
            {(c) => (
              <RightBox>
                <Label>
                  {c}: {moment(props.solved).format('llll')}
                </Label>
              </RightBox>
            )}
          </FormattedMessage>
        ) : null}
      </PuzzleFrame>
    </Constrained>
  );
}

Frame.propTypes = {
  text: PropTypes.string.isRequired,
  user: PropTypes.object,
  created: PropTypes.string,
  solved: PropTypes.string,
};

export default Frame;
