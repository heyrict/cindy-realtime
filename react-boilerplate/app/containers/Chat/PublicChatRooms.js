import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'rebass';
import { Button, ImgXs } from 'style-store';

import ChatRoomList from 'components/ChatRoomList';
import chevronLeft from 'images/chevron-orange-left.svg';

import { changeTab } from './actions';
import messages from './messages';

const PublicChatRooms = (props) => (
  <div>
    <Flex bg="burlywood" style={{ height: '35px', overflow: 'hidden' }}>
      <Button
        p={2}
        bg="burlywood"
        color="gray0"
        onClick={() => props.changeTab('TAB_CHANNEL')}
      >
        <ImgXs alt="< Back" src={chevronLeft} />
      </Button>
      <Box m="auto">
        <FormattedMessage {...messages.publicChannels} />
      </Box>
    </Flex>
    <div style={{ overflowY: 'auto', height: props.height - 35 }}>
      <ChatRoomList
        variables={{ private: false }}
        order="-created"
        fetchPolicy="cache-first"
        tune={props.tune}
        itemsPerPage={10}
      />
    </div>
  </div>
);

PublicChatRooms.propTypes = {
  height: PropTypes.number.isRequired,
  tune: PropTypes.func.isRequired,
  changeTab: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changeTab: (tab) => dispatch(changeTab(tab)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(PublicChatRooms);
