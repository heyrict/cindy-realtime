/**
 *
 * UserPanel
 *
 */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Box, Row } from 'rebass';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { RoundedPanel } from 'style-store';

import UserLabel from 'components/UserLabel';
import sortMessages from 'components/FilterableList/messages';

const UserCol = styled(Box)`
  text-align: center;
  align-self: center;
  margin-top: 5px;
`;

export class UserPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rewardingShown: false,
    };
    this.toggleRewardingPanel = (s) => this.setState({ rewardingShown: s });
  }
  render() {
    const node = this.props.node;
    return (
      <RoundedPanel my={10}>
        <Row mx={10} py={10}>
          <UserCol px={10}>
            <UserLabel user={node} />
          </UserCol>
          <Box ml="auto" px={10}>
            <FormattedMessage {...sortMessages.date_joined} />:{' '}
            {moment(node.dateJoined).format('YYYY-MM-DD HH:mm')}
          </Box>
        </Row>
      </RoundedPanel>
    );
  }
}

UserPanel.propTypes = {
  node: PropTypes.object.isRequired,
};

export default UserPanel;
