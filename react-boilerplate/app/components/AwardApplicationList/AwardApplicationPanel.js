import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import moment from 'moment';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'rebass';
import { RoundedPanel, Button, ButtonOutline, ImgXs } from 'style-store';

import { graphql } from 'react-apollo';
import UpdateAwardApplication from 'graphql/UpdateAwardApplicationMutation';
import AwardApplicationFragment from 'graphql/AwardApplication';

import UserLabel from 'components/UserLabel';
import UserAwardPopover from 'components/UserAwardPopover';
import switcher from 'images/switcher.svg';

import messages from './messages';

class AwardApplicationPanel extends React.Component {
  constructor(props) {
    super(props);
    this.MODE = {
      DISPLAY: 'DISPLAY',
      REVIEW: 'REVIEW',
      CONTROL: 'CONTROL',
    };
    this.STATUS = {
      WAITING: 0,
      ACCEPTED: 1,
      DENIED: 2,
    };
    this.state = {
      mode: this.MODE.DISPLAY,
    };
    this.changeMode = (mode) => this.setState({ mode });
    this.toggleMode = () =>
      this.setState(
        (p) =>
          p.mode === this.MODE.DISPLAY
            ? { mode: this.MODE.REVIEW }
            : { mode: this.MODE.DISPLAY }
      );
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDeny = this.handleDeny.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.node &&
      this.props.node &&
      nextProps.node.status !== this.props.node.status
    ) {
      this.setState({ mode: this.MODE.DISPLAY });
    }
  }
  handleAccept() {
    const id = this.props.node.id;
    const ACCEPTED = this.STATUS.ACCEPTED;
    const currentUser = this.props.currentUser;
    const now = new Date();
    this.props
      .mutate({
        variables: {
          input: {
            awardApplicationId: this.props.node.id,
            status: this.STATUS.ACCEPTED,
          },
        },
        update(proxy) {
          const data = proxy.readFragment({
            id,
            fragment: AwardApplicationFragment,
            fragmentName: 'AwardApplication',
          });
          proxy.writeFragment({
            id,
            fragment: AwardApplicationFragment,
            fragmentName: 'AwardApplication',
            data: {
              ...data,
              status: ACCEPTED,
              reviewer: currentUser,
              reviewed: now.toISOString(),
            },
          });
        },
        optimisticResponse: {
          updateAwardApplication: {
            __typename: 'UpdateAwardApplicationPayload',
            clientMutationId: null,
          },
        },
      })
      .catch((error) => {
        bootbox.alert(error.message);
      });
  }
  handleDeny() {
    const id = this.props.node.id;
    const DENIED = this.STATUS.DENIED;
    const currentUser = this.props.currentUser;
    const now = new Date();
    this.props
      .mutate({
        variables: {
          input: {
            awardApplicationId: this.props.node.id,
            status: this.STATUS.DENIED,
          },
        },
        update(proxy) {
          const data = proxy.readFragment({
            id,
            fragment: AwardApplicationFragment,
            fragmentName: 'AwardApplication',
          });
          proxy.writeFragment({
            id,
            fragment: AwardApplicationFragment,
            fragmentName: 'AwardApplication',
            data: {
              ...data,
              status: DENIED,
              reviewer: currentUser,
              reviewed: now.toISOString(),
            },
          });
        },
        optimisticResponse: {
          updateAwardApplication: {
            __typename: 'UpdateAwardApplicationPayload',
            clientMutationId: null,
          },
        },
      })
      .catch((error) => {
        bootbox.alert(error.message);
      });
  }
  render() {
    const node = this.props.node;
    return (
      <RoundedPanel wrap p={1} m={1}>
        <Flex>
          <Box w={1}>
            {this.state.mode === this.MODE.DISPLAY && (
              <Flex wrap align="center">
                <Box w={[1, 2 / 3]}>
                  <div>
                    <FormattedMessage {...messages.applier} />:{' '}
                    <UserLabel user={{ ...node.applier, currentAward: null }} />
                  </div>
                  <div>
                    <FormattedMessage {...messages.award} />:{' '}
                    <UserAwardPopover
                      userAward={{ id: node.id, award: node.award }}
                    />
                  </div>
                  <div>
                    <FormattedMessage {...messages.created} />:{' '}
                    {moment(node.created).format('YYYY-MM-DD HH:mm')}
                  </div>
                  {node.reviewer && (
                    <div style={{ marginTop: '10px' }}>
                      <FormattedMessage {...messages.reviewer} />:{' '}
                      <UserLabel
                        user={{ ...node.reviewer, currentAward: null }}
                      />
                    </div>
                  )}
                  {node.reviewed && (
                    <div>
                      <FormattedMessage {...messages.reviewed} />:{' '}
                      {moment(node.reviewed).format('YYYY-MM-DD HH:mm')}
                    </div>
                  )}
                </Box>
                <Box w={[1, 1 / 3]}>
                  {node.status === this.STATUS.WAITING && (
                    <FormattedMessage {...messages.WAITING} />
                  )}
                  {node.status === this.STATUS.ACCEPTED && (
                    <FormattedMessage {...messages.ACCEPTED} />
                  )}
                  {node.status === this.STATUS.DENIED && (
                    <FormattedMessage {...messages.DENIED} />
                  )}
                </Box>
              </Flex>
            )}
            {this.state.mode === this.MODE.REVIEW && (
              <Flex wrap align="center" justify="center">
                <Box w={1} p={1}>
                  <div>
                    <FormattedMessage {...messages.applier} />:{' '}
                    <UserLabel user={{ ...node.applier, currentAward: null }} />
                  </div>
                  <div>
                    <FormattedMessage {...messages.award} />:{' '}
                    <UserAwardPopover
                      userAward={{ id: node.id, award: node.award }}
                    />
                  </div>
                  <div>
                    <FormattedMessage {...messages.comment} />: {node.comment}
                  </div>
                </Box>
                {node.status === this.STATUS.WAITING && (
                  <Flex w={1}>
                    {this.props.currentUser.canReviewAwardApplication && (
                      <Box w={1 / 2}>
                        <ButtonOutline w={1} p={1} onClick={this.handleAccept}>
                          <FormattedMessage {...messages.accept} />
                        </ButtonOutline>
                      </Box>
                    )}
                    {this.props.currentUser.canReviewAwardApplication && (
                      <Box w={1 / 2}>
                        <ButtonOutline w={1} p={1} onClick={this.handleDeny}>
                          <FormattedMessage {...messages.deny} />
                        </ButtonOutline>
                      </Box>
                    )}
                  </Flex>
                )}
              </Flex>
            )}
          </Box>
          {this.props.currentUser && (
            <Button ml={1} px={1} onClick={this.toggleMode}>
              <ImgXs src={switcher} alt="Switch" />
            </Button>
          )}
        </Flex>
      </RoundedPanel>
    );
  }
}

AwardApplicationPanel.propTypes = {
  node: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  mutate: PropTypes.func.isRequired,
};

const withMutation = graphql(UpdateAwardApplication);

export default compose(withMutation)(AwardApplicationPanel);
