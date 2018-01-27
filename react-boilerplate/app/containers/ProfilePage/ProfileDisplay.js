import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'rebass';
import { intlShape } from 'react-intl';
import moment from 'moment';
import UserAwardPopover from 'components/UserAwardPopover';
import AwardSwitch from './AwardSwitch';
import ProfRow from './ProfRow';
import ProfileRow from './ProfileRow';

import messages from './messages';

function ProfileDisplay(props, context) {
  const _ = context.intl.formatMessage;
  return (
    <Flex wrap>
      <ProfRow
        heading={_(messages.nickname)}
        content={
          <div>
            {props.user.nickname}
            {props.user.userawardSet.edges.map((edge) => (
              <UserAwardPopover
                userAward={edge.node}
                placement="bottom"
                key={edge.node.id}
                style={{
                  color: 'darkslategray',
                  padding: '0 3px',
                }}
              />
            ))}
          </div>
        }
      />
      <ProfRow
        heading={_(messages.puzzleCount)}
        content={props.user.puzzleCount}
      />
      <ProfRow heading={_(messages.quesCount)} content={props.user.quesCount} />
      <ProfRow
        heading={_(messages.goodQuesCount)}
        content={props.user.goodQuesCount}
      />
      <ProfRow
        heading={_(messages.trueQuesCount)}
        content={props.user.trueQuesCount}
      />
      <ProfRow
        heading={_(messages.commentCount)}
        content={props.user.commentCount}
      />
      <ProfRow
        heading={_(messages.dateJoined)}
        content={
          <div>{moment(props.user.dateJoined).format('YYYY-MM-DD HH:mm')}</div>
        }
      />
      <ProfRow
        heading={_(messages.lastLogin)}
        content={
          <div>{moment(props.user.lastLogin).format('YYYY-MM-DD HH:mm')}</div>
        }
      />
      {props.user.userId === props.currentUserId && (
        <AwardSwitch
          currentAwardId={
            props.user.currentAward ? props.user.currentAward.id : null
          }
          userawardSet={props.user.userawardSet}
        />
      )}
      <ProfileRow userId={props.user.userId} profile={props.user.profile} />
    </Flex>
  );
}

ProfileDisplay.propTypes = {
  user: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

ProfileDisplay.contextTypes = {
  intl: intlShape,
};

export default ProfileDisplay;
