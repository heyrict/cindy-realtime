/*
*
* GoogleAd
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { googleAdClientToken } from 'settings';

export class GoogleAd extends React.PureComponent {
  componentDidMount() {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    const optionalAttr = {
      'data-ad-layout-key': this.props.layoutKey,
    };
    return (
      <div style={this.props.wrapperDivStyle}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          {...optionalAttr}
          data-ad-client={this.props.client}
          data-ad-slot={this.props.slot}
          data-ad-format={this.props.format}
        />
      </div>
    );
  }
}

GoogleAd.propTypes = {
  client: PropTypes.string.isRequired,
  slot: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  wrapperDivStyle: PropTypes.object,
  layoutKey: PropTypes.string,
};

GoogleAd.defaultProps = {
  wrapperDivStyle: {
    overflow: 'hidden',
  },
};

export const RegisterGoogleAd = ({ clientToken }) => (Wrapped) => (props) =>
  clientToken && <Wrapped client={clientToken} {...props} />;

export default RegisterGoogleAd({ clientToken: googleAdClientToken })(GoogleAd);
