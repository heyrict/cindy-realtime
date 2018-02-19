import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonOutline } from 'style-store';
import { Flex } from 'rebass';
import { compose } from 'redux';
import { connect } from 'react-redux';
import bootbox from 'bootbox';
import { from_global_id as f } from 'common';
import { createStructuredSelector } from 'reselect';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ProfileShowQuery from 'graphql/ProfileShowQuery';
import UpdateCurrentAwardMutation from 'graphql/UpdateCurrentAwardMutation';

import ProfRow from './ProfRow';
import messages from './messages';

const StyledButtonOutline = ButtonOutline.extend`
  border-radius: 10px;
  padding: 10px;
`;

const StyledButton = Button.extend`
  border-radius: 10px;
  padding: 10px;
`;

class AwardSwitch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedAward: props.currentAwardId,
    };
    this.selectAward = (a) => this.setState({ selectedAward: a });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    if (this.state.selectedAward === this.props.currentAwardId) return;
    this.props
      .mutate({
        variables: { input: { userawardId: f(this.state.selectedAward)[1] } },
        update: (proxy) => {
          const data = proxy.readQuery({
            query: ProfileShowQuery,
            variables: { id: this.props.userId },
          });
          if (this.state.selectedAward === null) {
            data.user.currentAward = null;
          } else {
            data.user.currentAward = {
              id: this.state.selectedAward,
              __typename: 'UserAwardNode',
            };
          }
          proxy.writeQuery({
            query: ProfileShowQuery,
            variables: { id: this.props.userId },
            data,
          });
        },
        optimisticResponse: {
          updateCurrentAward: {
            clientMutationId: null,
            __typename: 'UpdateCurrentAwardPayload',
          },
        },
      })
      .then(() => {})
      .catch((error) => {
        bootbox.alert({
          title: 'Error',
          message: error.message,
        });
      });
  }

  render() {
    if (this.props.currentUser.userId === this.props.currentUser.rowid) {
      return (
        <ProfRow
          heading={<FormattedMessage {...messages.awardSelect} />}
          content={
            <Flex wrap>
              <StyledButtonOutline onClick={() => this.selectAward(null)}>
                <FormattedMessage {...messages.nullAward} />
              </StyledButtonOutline>
              {this.props.userawardSet.edges.map((edge) => (
                <span key={edge.node.id}>
                  {edge.node.id === this.state.selectedAward ? (
                    <StyledButton onClick={() => this.selectAward(null)}>
                      {edge.node.award.name}
                    </StyledButton>
                  ) : (
                    <StyledButtonOutline
                      onClick={() => this.selectAward(edge.node.id)}
                    >
                      {edge.node.award.name}
                    </StyledButtonOutline>
                  )}
                </span>
              ))}
              <StyledButtonOutline onClick={this.handleSubmit} w={1} mt={2}>
                <FormattedMessage {...messages.save} />
              </StyledButtonOutline>
            </Flex>
          }
        />
      );
    }
    return null;
  }
}

AwardSwitch.propTypes = {
  currentUser: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  currentAwardId: PropTypes.string,
  userawardSet: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  mutate: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectUserNavbar(),
});

const withConnect = connect(mapStateToProps);

const withMutation = graphql(UpdateCurrentAwardMutation);

export default compose(withConnect, withMutation)(AwardSwitch);
