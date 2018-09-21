import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { nAlert } from 'containers/Notifier/actions';

import { graphql } from 'react-apollo';
import UpdateAwardApplication from 'graphql/UpdateAwardApplicationMutation';
import AwardApplicationFragment from 'graphql/AwardApplication';

import { Flex, Box } from 'rebass';
import {
  RoundedPanel,
  Button,
  ButtonOutline,
  ImgXs,
  Textarea,
} from 'style-store';
import UnhandledTextarea from 'components/UnhandledTextarea';
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
            : { mode: this.MODE.DISPLAY },
      );
    this.handleReview = this.handleReview.bind(this);
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
  handleReview(status) {
    const id = this.props.node.id;
    const currentUser = this.props.currentUser;
    const reason = this.reasonInput.getContent().trim();
    const now = new Date();
    this.props
      .mutate({
        variables: {
          input: {
            awardApplicationId: this.props.node.id,
            status,
            reason,
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
              status,
              reason,
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
        this.props.alert(error.message);
      });
  }
  render() {
    const node = this.props.node;
    const statusText = (
      <span>
        {node.status === this.STATUS.WAITING && (
          <FormattedMessage {...messages.WAITING} />
        )}
        {node.status === this.STATUS.ACCEPTED && (
          <FormattedMessage {...messages.ACCEPTED} />
        )}
        {node.status === this.STATUS.DENIED && (
          <FormattedMessage {...messages.DENIED} />
        )}
      </span>
    );
    return (
      <RoundedPanel p={1} m={1}>
        <Flex>
          <Box w={1}>
            {this.state.mode === this.MODE.DISPLAY && (
              <Flex flexWrap="wrap" alignItems="center">
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
                    {moment(node.created).format('lll')}
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
                      {moment(node.reviewed).format('lll')}
                    </div>
                  )}
                </Box>
                <Box w={[1, 1 / 3]}>{statusText}</Box>
              </Flex>
            )}
            {this.state.mode === this.MODE.REVIEW && (
              <Flex flexWrap="wrap" alignItems="center" justifyContent="center">
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
                  {node.comment && (
                    <div>
                      <FormattedMessage {...messages.comment} />: {node.comment}
                    </div>
                  )}
                  {
                    <div>
                      <FormattedMessage {...messages.status} />: {statusText}
                    </div>
                  }
                  {node.reason && (
                    <div>
                      <FormattedMessage {...messages.reason} />: {node.reason}
                    </div>
                  )}
                </Box>
                {node.status === this.STATUS.WAITING &&
                  this.props.currentUser &&
                  this.props.currentUser.canReviewAwardApplication &&
                  this.props.currentUser.id !== node.applier.id && (
                    <Flex flexWrap="wrap" w={1}>
                      <Box w={1}>
                        <UnhandledTextarea
                          ref={(ins) => (this.reasonInput = ins)}
                          component={Textarea}
                          minRows={3}
                          maxRows={5}
                        />
                      </Box>
                      <Box w={1 / 2}>
                        <ButtonOutline
                          w={1}
                          p={1}
                          onClick={() =>
                            this.handleReview(this.STATUS.ACCEPTED)
                          }
                        >
                          <FormattedMessage {...messages.accept} />
                        </ButtonOutline>
                      </Box>
                      <Box w={1 / 2}>
                        <ButtonOutline
                          w={1}
                          p={1}
                          onClick={() => this.handleReview(this.STATUS.DENIED)}
                        >
                          <FormattedMessage {...messages.deny} />
                        </ButtonOutline>
                      </Box>
                    </Flex>
                  )}
              </Flex>
            )}
          </Box>
          {this.props.currentUser &&
            (this.props.currentUser.id === node.applier.id ||
              this.props.currentUser.canReviewAwardApplication) && (
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
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withMutation = graphql(UpdateAwardApplication);

export default compose(
  withMutation,
  withConnect,
)(AwardApplicationPanel);
