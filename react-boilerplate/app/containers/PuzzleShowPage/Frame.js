import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { text2md } from 'common';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Box } from 'rebass';
import { ImgSm, PuzzleFrame } from 'style-store';

import Constrained from 'components/Constrained';
import UserLabel from 'components/UserLabel';
import anonymousIcon from 'images/anonymous.png';

import userLabelMessages from 'components/UserLabel/messages';
import messages from './messages';

const Label = styled.span`
  padding: 5px;
  font-size: 1.1em;
  color: #4877d7;
`;

const RightBox = styled(Box)`
  text-align: right;
`;

const ContentBox = styled(Box)`
  overflow: auto;
  font-size: 1.2em;
  font-family: 'Dejavu Sans';
`;

const IconSm = ImgSm.extend`
  border: 1px solid #333;
  border-radius: 9999px;
  margin: 5px;
`;

function Frame(props) {
  return (
    <Constrained mt={2} mb={2}>
      <PuzzleFrame>
        <ContentBox
          px={2}
          dangerouslySetInnerHTML={{ __html: text2md(props.text, props.safe) }}
        />
        <br />
        {props.anonymous && (
          <FormattedMessage {...messages.creator}>
            {(c) => (
              <RightBox>
                <Label>{c}:</Label>
                <IconSm alt="anonymous" src={anonymousIcon} />
                <FormattedMessage {...userLabelMessages.anonymous} />
              </RightBox>
            )}
          </FormattedMessage>
        )}
        {props.user && !props.anonymous ? (
          <FormattedMessage {...messages.creator}>
            {(c) => (
              <RightBox>
                <Label>{c}:</Label>
                <UserLabel user={props.user} />
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
  anonymous: PropTypes.bool,
  user: PropTypes.object,
  created: PropTypes.string,
  solved: PropTypes.string,
  safe: PropTypes.bool,
};

Frame.defaultProps = {
  safe: false,
};

export default Frame;
