/**
 *
 * Settings
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Switch, Button } from 'style-store';

import withModal from 'components/withModal';
import Bar from 'containers/Chat/Bar';
import ProfRow from 'containers/ProfilePage/ProfRow';
import ButtonSelect from 'components/ButtonSelect';

import SendPolicySwitch from './SendPolicySwitch';
import makeSelectSettings from './selectors';
import messages from './messages';
import { changeSetting, saveSettings } from './actions';

const StyledButton = styled(Button)`
  font-weight: bold;
  color: #fcf4dc;
  background: darkgoldenrod;
  border-radius: 10px;
  text-align: center;
  &:active {
    color: #fcf4dc;
    background: darkgoldenrod;
  }
  &:hover {
    color: #fcf4dc;
    background: darkgoldenrod;
  }
`;

function Settings(props) {
  const { settings, dispatch, onHide } = props;

  return (
    <div>
      <Bar open>
        <FormattedMessage {...messages.msgSendPolicy} />
      </Bar>
      <SendPolicySwitch
        name="sendChat"
        curVal={settings.sendChat}
        onChange={({ value }) => dispatch(changeSetting('sendChat', value))}
      />
      <SendPolicySwitch
        name="sendQuestion"
        curVal={settings.sendQuestion}
        onChange={({ value }) => dispatch(changeSetting('sendQuestion', value))}
      />
      <SendPolicySwitch
        name="sendAnswer"
        curVal={settings.sendAnswer}
        onChange={({ value }) => dispatch(changeSetting('sendAnswer', value))}
      />
      <SendPolicySwitch
        name="modifyQuestion"
        curVal={settings.modifyQuestion}
        onChange={({ value }) =>
          dispatch(changeSetting('modifyQuestion', value))
        }
      />
      <Bar open>
        <FormattedMessage {...messages.display} />
      </Bar>
      <ProfRow
        heading={<FormattedMessage {...messages.enableGenreIcon} />}
        content={
          <Switch
            checked={settings.enableGenreIcon}
            onClick={() =>
              dispatch(
                changeSetting('enableGenreIcon', !settings.enableGenreIcon),
              )
            }
          />
        }
      />
      <Bar open>
        <FormattedMessage {...messages.others} />
      </Bar>
      <ProfRow
        heading={<FormattedMessage {...messages.canFilterMultipleUser} />}
        content={
          <Switch
            checked={settings.canFilterMultipleUser}
            onClick={() =>
              dispatch(
                changeSetting(
                  'canFilterMultipleUser',
                  !settings.canFilterMultipleUser,
                ),
              )
            }
          />
        }
      />
      <ProfRow
        heading={<FormattedMessage {...messages.displayChatroomDescription} />}
        content={
          <ButtonSelect
            value={settings.displayChatroomDescription}
            options={[
              { value: 'Auto', label: <FormattedMessage {...messages.auto} /> },
              { value: 'True', label: '○' },
              { value: 'False', label: '×' },
            ]}
            onChange={({ value }) =>
              dispatch(changeSetting('displayChatroomDescription', value))
            }
          />
        }
      />
      <StyledButton
        w={1}
        py={1}
        mt={1}
        onClick={() => {
          dispatch(saveSettings());
          onHide();
        }}
      >
        <FormattedMessage {...messages.save} />
      </StyledButton>
    </div>
  );
}

Settings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  settings: makeSelectSettings(),
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withModal({
    header: 'Settings',
  }),
)(Settings);
