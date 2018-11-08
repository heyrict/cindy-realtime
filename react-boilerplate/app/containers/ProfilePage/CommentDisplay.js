import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'rebass';

import FilterableList from 'components/FilterableList';
import CommentList from 'components/CommentList';

import messages from './messages';

const SubTitle = styled.div`
  font-size: 2em;
  color: chocolate;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  text-align: center;
`;

function CommentDisplay(props) {
  return (
    <Flex w={1} flexWrap="wrap">
      <Box w={[1, 1, 1 / 2]}>
        <SubTitle>
          <FormattedMessage {...messages.commentsPosted} />
        </SubTitle>
        <FilterableList
          component={CommentList}
          variables={{ user: props.user.id }}
          order="-id"
          orderList={['id', 'puzzle__created']}
          hintMessageId="commentNoUser"
          itemsPerPage={8}
        />
      </Box>
      <Box w={[1, 1, 1 / 2]}>
        <SubTitle>
          <FormattedMessage {...messages.commentsReceived} />
        </SubTitle>
        <FilterableList
          component={CommentList}
          variables={{ puzzle_User: props.user.id }}
          order="-id"
          orderList={['id', 'puzzle__created']}
          hintMessageId="commentNoPuzzleUser"
          itemsPerPage={8}
        />
      </Box>
    </Flex>
  );
}

CommentDisplay.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default CommentDisplay;
