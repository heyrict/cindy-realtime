/**
*
* UserAwardPopover
*
*/

import React from 'react';
import PropTypes from "prop-types";
// import styled from 'styled-components';


class UserAwardPopover extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const ua = props.userAward;
    if (!ua) {
      return null;
    } else {
      const popoverAward = (
        <Popover id={ua.id} title={ua.award.name}>
          {ua.award.description}
          <br />
          <span className="pull-right" style={{ color:"#ff582b", fontWeight:"bold"}}>
            🏆{ua.created}
          </span>
        </Popover>
      );
      return (
        <OverlayTrigger placement="top" trigger="focus" overlay={popoverAward}>
          <a
            href="javascript:void(0);"
            role="button"
            style={{ color: "black" }}
          >
            [{ua.award.name}]
          </a>
        </OverlayTrigger>
      );
    }
  }
}

UserAwardPopover.propTypes = {
  userAward: PropTypes.object.required
};

export default UserAwardPopover;
