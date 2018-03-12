import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import ProfRow from 'containers/ProfilePage/ProfRow';
import BtnSwitch from './BtnSwitch';
import { OPTIONS_SEND } from './constants';
import messages from './messages';

const SendPolicySwitch = (props) => {
  const { name, curVal, onChange } = props;
  return (
    <ProfRow
      heading={
        name in messages ? <FormattedMessage {...messages[name]} /> : name
      }
      content={
        <BtnSwitch
          selected={curVal}
          options={Object.entries(OPTIONS_SEND).map((entry) => ({
            id: entry[1],
            label:
              entry[0] in messages ? (
                <FormattedMessage {...messages[entry[0]]} />
              ) : (
                entry[0]
              ),
          }))}
          onChange={onChange}
        />
      }
    />
  );
};

SendPolicySwitch.propTypes = {
  name: PropTypes.any.isRequired,
  curVal: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default SendPolicySwitch;
