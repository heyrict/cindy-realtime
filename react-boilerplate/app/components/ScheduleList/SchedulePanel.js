import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Time } from 'style-store';
import { line2md } from 'common';
import moment from 'moment';

import UserLabel from 'components/UserLabel';

const ScheduleTime = styled(Time)`
  background-color: #2d52a0;
  color: blanchedalmond;
  border-radius: 5px;
  padding: 2px;
`;

const ScheduleWrap = styled.div`
  border-bottom: 1px solid #aaa;
  padding: 0 3px;
`;

const ContentBox = styled.div`
  margin: 0 5px 5px 5px;
`;

function SchedulePanel(props) {
  return (
    <ScheduleWrap>
      <ScheduleTime>{moment(props.node.scheduled).format('lll')}</ScheduleTime>
      <UserLabel user={props.node.user} />
      <ContentBox
        dangerouslySetInnerHTML={{ __html: line2md(props.node.content) }}
      />
    </ScheduleWrap>
  );
}

SchedulePanel.propTypes = {
  node: PropTypes.object.isRequired,
};

export default SchedulePanel;
