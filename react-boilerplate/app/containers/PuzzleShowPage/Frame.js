import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { text2md, withLocale } from 'common';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Box } from 'rebass';
import { PuzzleFrame } from 'style-store';

import Constrained from 'components/Constrained';
import UserLabel from 'components/UserLabel';

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

function Frame(props) {
  return (
    <Constrained mt={2} mb={2}>
      <PuzzleFrame>
        <ContentBox
          pl={10}
          dangerouslySetInnerHTML={{ __html: text2md(props.text, props.safe) }}
        />
        <br />
        {props.user ? (
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
  user: PropTypes.object,
  created: PropTypes.string,
  solved: PropTypes.string,
  safe: PropTypes.bool,
};

Frame.defaultProps = {
  safe: false,
};

export default Frame;
