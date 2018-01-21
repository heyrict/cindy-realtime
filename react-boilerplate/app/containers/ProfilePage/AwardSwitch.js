import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonOutline } from 'style-store';
import { Flex } from 'rebass';
import { connect } from 'react-redux';
import { commitMutation } from 'react-relay';
import environment from 'Environment';
import bootbox from 'bootbox';
import { from_global_id as f } from 'common';
import { createStructuredSelector } from 'reselect';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
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
  }
  componentWillUnmount() {
    if (this.state.selectedAward === this.props.currentAwardId) return;
    commitMutation(environment, {
      mutation: UpdateCurrentAwardMutation,
      variables: { input: { userawardId: f(this.state.selectedAward)[1] } },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert({
            title: 'Error',
            message: errors.map((error) => error.message).join(','),
          });
        }
      },
      onError: (err) => console.error(err),
    });
  }
  render() {
    if (this.props.currentUser.userId === this.props.currentUser.rowid) {
      return (
        <ProfRow
          heading={<FormattedMessage {...messages.awardSelect} />}
          content={
            <Flex>
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
  currentAwardId: PropTypes.string,
  userawardSet: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectUserNavbar(),
});

export default connect(mapStateToProps)(AwardSwitch);
