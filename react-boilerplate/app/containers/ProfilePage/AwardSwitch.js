import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonOutline } from 'style-store';
import { Flex } from 'rebass';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { from_global_id as f } from 'common';
import { nAlert } from 'containers/Notifier/actions';
import { createStructuredSelector } from 'reselect';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
import ButtonSelect from 'components/ButtonSelect';

import { graphql } from 'react-apollo';
import ProfileShowQuery from 'graphql/ProfileShowQuery';
import UpdateCurrentAwardMutation from 'graphql/UpdateCurrentAwardMutation';

import ProfRow from './ProfRow';
import messages from './messages';

class AwardSwitch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedAward: props.currentAwardId,
    };
    this.handleChange = (option) =>
      this.setState({
        selectedAward: option.value,
      });
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
      .then(() => {
        this.props.alert('Save Successful');
      })
      .catch((error) => {
        this.props.alert(error.message);
      });
  }

  render() {
    if (this.props.currentUser.userId === this.props.currentUser.rowid) {
      return (
        <ProfRow
          heading={<FormattedMessage {...messages.awardSelect} />}
          content={
            <div>
              <ButtonSelect
                value={this.state.selectedAward}
                onChange={this.handleChange}
                options={[
                  {
                    value: null,
                    label: <FormattedMessage {...messages.nullAward} />,
                  },
                  ...this.props.userawardSet.edges.map((edge) => ({
                    value: edge.node.id,
                    label: edge.node.award.name,
                  })),
                ]}
              />
              <ButtonOutline p={1} onClick={this.handleSubmit} w={1} mt="5px">
                <FormattedMessage {...messages.save} />
              </ButtonOutline>
            </div>
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
  alert: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectUserNavbar(),
});

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withMutation = graphql(UpdateCurrentAwardMutation);

export default compose(
  withConnect,
  withMutation,
)(AwardSwitch);
