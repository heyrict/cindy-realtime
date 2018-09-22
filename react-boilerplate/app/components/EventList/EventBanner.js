/**
 *
 * EventBanner
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import eventBorder from 'images/event-border.png';

const Banner = styled.div`
  align-items: center;
  background-color: #c6b571;
  border-image: url(${eventBorder}) 2 2;
  border-style: solid;
  border-width: 10px;
  color: #a0522d;
  display: flex;
  font-size: 2em;
  font-weight: bold;
  justify-content: center;
  margin: 0.2em 0;
  max-height: 128px;
  min-height: 64px;
  overflow: hidden;
  text-align: center;
`;

const BannerImg = styled.img`
  margin: 0.2em 0;
  width: 100%;
`;

const BannerWrapper = styled.a`
  cursor: ${({ href }) => (href ? 'pointer' : 'initial')};
`;

function EventBanner(props) {
  let content;
  const { node } = props;

  if (node.bannerImgUrl) {
    content = (
      <Banner>
        <BannerImg src={node.bannerImgUrl} />
      </Banner>
    );
  } else {
    content = <Banner>{node.title}</Banner>;
  }

  return <BannerWrapper href={node.pageLink || null}>{content}</BannerWrapper>;
}

EventBanner.propTypes = {
  node: PropTypes.shape({
    user: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    bannerImgUrl: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    pageLink: PropTypes.string,
  }),
};

export default EventBanner;
