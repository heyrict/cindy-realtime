import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { nAlert } from 'containers/Notifier/actions';

import { Switch } from 'style-store';
import { Flex } from 'rebass';

import { graphql } from 'react-apollo';
import UpdateUserMutation from 'graphql/UpdateUserMutation';

import ProfRow from './ProfRow';
import messages from './messages';

class AwardSwitch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hideBookmark: props.hideBookmark,
    };
    this.switch = () =>
      this.setState((p) => ({ hideBookmark: !p.hideBookmark }));
  }

  componentWillUnmount() {
    if (this.state.hideBookmark === this.props.hideBookmark) {
      return;
    }
    this.props
      .mutate({
        variables: { input: { hideBookmark: this.state.hideBookmark } },
      })
      .then(() => {})
      .catch((error) => {
        this.props.alert(error.message);
      });
  }

  render() {
    return (
      <ProfRow
        heading={<FormattedMessage {...messages.hideBookmark} />}
        content={
          <Flex flexWrap="wrap">
            <Switch
              checked={this.state.hideBookmark}
              onClick={() => this.switch()}
            />
          </Flex>
        }
      />
    );
  }
}

AwardSwitch.propTypes = {
  hideBookmark: PropTypes.bool.isRequired,
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(null, mapDispatchToProps);

const withMutate = graphql(UpdateUserMutation);

export default compose(withMutate, withConnect)(AwardSwitch);
