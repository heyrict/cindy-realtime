import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'rebass';
import { RoundedPanel, ButtonOutline } from 'style-store';

import { graphql } from 'react-apollo';
import UpdateAwardApplication from 'graphql/UpdateAwardApplicationMutation';
import AwardApplicationFragment from 'graphql/AwardApplication';

import UserLabel from 'components/UserLabel';
import UserAwardPopover from 'components/UserAwardPopover';

import messages from './messages';

const AcceptBtn = ButtonOutline.extend`
  border-radius: 10px;
  padding: 5px;
`;

const DenyBtn = ButtonOutline.extend`
  border-radius: 10px;
  padding: 5px;
`;

const ToggleBtn = ButtonOutline.extend`
  border-radius: 10px;
  padding: 5px;
  min-width: 30px;
`;

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
      this.setState((p) => {
        if (props.canReviewAwardApplication) {
          return p.mode === this.MODE.DISPLAY
            ? { mode: this.MODE.REVIEW }
            : { mode: this.MODE.DISPLAY };
        }
        return { mode: this.MODE.DISPLAY };
      });
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
    this.props.mutate({
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
          },
        });
      },
      optimisticResponse: {
        updateAwardApplication: {
          __typename: 'UpdateAwardApplicationPayload',
          clientMutationId: null,
        },
      },
    });
  }
  handleDeny() {
    const id = this.props.node.id;
    const DENIED = this.STATUS.DENIED;
    this.props.mutate({
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
          },
        });
      },
      optimisticResponse: {
        updateAwardApplication: {
          __typename: 'UpdateAwardApplicationPayload',
          clientMutationId: null,
        },
      },
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
                  <FormattedMessage {...messages.applier} />
                  {': '}
                  <UserLabel user={{ ...node.applier, currentAward: null }} />
                  <br />
                  <FormattedMessage {...messages.award} />
                  {': '}
                  <UserAwardPopover
                    userAward={{ id: node.id, award: node.award }}
                  />
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
                  {node.comment}
                </Box>
                <Box w={1 / 2}>
                  <AcceptBtn w={1} onClick={this.handleAccept}>
                    <FormattedMessage {...messages.accept} />
                  </AcceptBtn>
                </Box>
                <Box w={1 / 2}>
                  <DenyBtn w={1} onClick={this.handleDeny}>
                    <FormattedMessage {...messages.deny} />
                  </DenyBtn>
                </Box>
              </Flex>
            )}
          </Box>
          {node.status === this.STATUS.WAITING && (
            <ToggleBtn ml="auto" onClick={this.toggleMode}>
              O
            </ToggleBtn>
          )}
        </Flex>
      </RoundedPanel>
    );
  }
}

AwardApplicationPanel.propTypes = {
  node: PropTypes.object.isRequired,
  currentUserId: PropTypes.string,
  canReviewAwardApplication: PropTypes.bool.isRequired,
  mutate: PropTypes.func.isRequired,
};

const withMutation = graphql(UpdateAwardApplication);

export default compose(withMutation)(AwardApplicationPanel);
