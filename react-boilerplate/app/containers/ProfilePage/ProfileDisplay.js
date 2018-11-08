import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'rebass';
import { intlShape } from 'react-intl';
import moment from 'moment';

import UserAwardPopover from 'components/UserAwardPopover';

import AwardSwitch from './AwardSwitch';
import ProfRow from './ProfRow';
import ProfileRow from './ProfileRow';
import BookmarkHideRow from './BookmarkHideRow';

import messages from './messages';

function ProfileDisplay(props, context) {
  const _ = context.intl.formatMessage;
  const userId = props.user.id;
  return (
    <Flex flexWrap="wrap">
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
        heading={_(messages.rcommentCount)}
        content={props.user.rcommentCount || 0}
      />
      <ProfRow
        heading={_(messages.starReceivedCount)}
        content={props.user.rstarCount || 0}
      />
      <ProfRow
        heading={_(messages.starReceivedSum)}
        content={props.user.rstarSum || 0}
      />
      <ProfRow
        heading={_(messages.dateJoined)}
        content={<div>{moment(props.user.dateJoined).format('lll')}</div>}
      />
      <ProfRow
        heading={_(messages.lastLogin)}
        content={<div>{moment(props.user.lastLogin).format('lll')}</div>}
      />
      {userId === props.currentUserId && (
        <AwardSwitch
          userId={userId}
          currentAwardId={
            props.user.currentAward ? props.user.currentAward.id : null
          }
          userawardSet={props.user.userawardSet}
        />
      )}
      {userId === props.currentUserId && (
        <BookmarkHideRow hideBookmark={props.user.hideBookmark} />
      )}
      <ProfileRow
        userId={userId}
        profile={props.user.profile}
        currentUserId={props.currentUserId}
      />
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
