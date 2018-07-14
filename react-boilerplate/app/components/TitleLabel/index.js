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

import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import makeSelectSettings from 'containers/Settings/selectors';

import sortMessages from 'components/FilterableList/messages';
import { genreInfo, yamiInfo } from './constants';
import messages from './messages';

const PuzzleTitle = styled(Link)`
  display: inline-block;
  color: brown;
  padding: 0.05em 0.2em;
  @media (min-width: 760px) {
    font-size: 1.25em;
  }
  @media (max-width: 760px) {
    font-size: 1.1em;
  }
`;

const PuzzleDate = styled.span`
  color: gray;
  @media (max-width: 760px) {
    font-size: 0.9em;
  }
`;

function TitleLabel(props) {
  const { yami, locale, puzzleId, genre, title, created, settings } = props;
  if (locale === 'ja' && settings.enableGenreIcon) {
    return (
      <Flex alignItems="center">
        <Img src={genreInfo[genre].pictureJp} alt={genreInfo[genre].name} />
        {yami ? (
          <Img src={yamiInfo[yami].pictureJp} alt={yamiInfo[yami].name} />
        ) : null}
        <Flex w={1} ml={1} flexWrap="wrap">
          <Box>
            <PuzzleTitle to={withLocale(`/puzzle/show/${puzzleId}`)}>
              {title}
            </PuzzleTitle>
          </Box>
          <Box ml="auto" style={{ alignSelf: 'center' }}>
            <PuzzleDate>
              <FormattedMessage {...sortMessages.created} />:{' '}
              {moment(created).format('lll')}
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
          {yami ? (
            <FormattedMessage {...messages[yamiInfo[yami].name]} />
          ) : null}]
          {title}
        </PuzzleTitle>
      </Box>
      <Box ml="auto" style={{ alignSelf: 'center' }}>
        <PuzzleDate>
          <FormattedMessage {...sortMessages.created} />:{' '}
          {moment(created).format('lll')}
        </PuzzleDate>
      </Box>
    </Flex>
  );
}

TitleLabel.propTypes = {
  genre: PropTypes.number.isRequired,
  yami: PropTypes.number.isRequired,
  puzzleId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    enableGenreIcon: PropTypes.bool.isRequired,
  }),
};

TitleLabel.defaultProps = {
  locale: 'ja',
};

const mapStateToProps = createStructuredSelector({
  locale: makeSelectLocale(),
  settings: makeSelectSettings(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(TitleLabel);
