/**
 *
 * TitleLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import { Flex, Box } from 'rebass';
import { ImgMd as Img } from 'style-store';
import { FormattedMessage } from 'react-intl';
import { withLocale } from 'common';

import classicJp from 'images/classicJp.svg';
import twentyQuestionsJp from 'images/twentyQuestionsJp.svg';
import littleAlbatJp from 'images/littleAlbatJp.svg';
import othersJp from 'images/othersJp.svg';
import yamiJp from 'images/yamiJp.svg';

import sortMessages from 'components/FilterableList/messages';
import messages from './messages';

const PuzzleTitle = styled(Link)`
  display: inline-block;
  color: brown;
  padding: 0.05em 0.2em;
  @media (min-width: 760px) {
    font-size: 1.25em;
  }
  @media (max-width: 760px) {
    font-size: 1.15em;
  }
`;

const PuzzleDate = styled.span`
  color: gray;
  @media (max-width: 760px) {
    font-size: 0.9em;
  }
`;

const TranslatedGenre = ({ genre }) => {
  switch (genre) {
    case 0:
      return <FormattedMessage {...messages.classic} />;
    case 1:
      return <FormattedMessage {...messages.twentyQuestions} />;
    case 2:
      return <FormattedMessage {...messages.littleAlbat} />;
    case 3:
      return <FormattedMessage {...messages.others} />;
    default:
      return null;
  }
};

const genreInfo = [
  {
    name: 'classic',
    pictureJp: classicJp,
  },
  {
    name: 'twentyQuestions',
    pictureJp: twentyQuestionsJp,
  },
  {
    name: 'littleAlbat',
    pictureJp: littleAlbatJp,
  },
  {
    name: 'others',
    pictureJp: othersJp,
  },
];

TranslatedGenre.propTypes = {
  genre: PropTypes.number.isRequired,
};

function TitleLabel(props) {
  const { yami, locale, puzzleId, genre, title, created } = props;
  if (locale === 'ja') {
    return (
      <Flex alignItems="center">
        <Img src={genreInfo[genre].pictureJp} alt={genreInfo[genre].name} />
        {yami && <Img src={yamiJp} alt="yami" />}
        <Flex w={1} ml={1} flexWrap="wrap">
          <Box>
            <PuzzleTitle to={withLocale(`/puzzle/show/${puzzleId}`)}>
              {title}
            </PuzzleTitle>
          </Box>
          <Box ml="auto" style={{ alignSelf: 'center' }}>
            <PuzzleDate>
              <FormattedMessage {...sortMessages.created} />:{' '}
              {moment(created).format('YYYY-MM-DD HH:mm')}
            </PuzzleDate>
          </Box>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex flexWrap="wrap">
      <Box>
        <PuzzleTitle to={withLocale(`/puzzle/show/${puzzleId}`)}>
          [{<FormattedMessage {...messages[genreInfo[genre].name]} />}
          {yami ? ' x ' : null}
          {yami ? <FormattedMessage {...messages.yami} /> : null}]
          {title}
        </PuzzleTitle>
      </Box>
      <Box ml="auto" style={{ alignSelf: 'center' }}>
        <PuzzleDate>
          <FormattedMessage {...sortMessages.created} />:{' '}
          {moment(created).format('YYYY-MM-DD HH:mm')}
        </PuzzleDate>
      </Box>
    </Flex>
  );
}

TitleLabel.propTypes = {
  genre: PropTypes.number.isRequired,
  yami: PropTypes.bool.isRequired,
  puzzleId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
};

export default TitleLabel;
