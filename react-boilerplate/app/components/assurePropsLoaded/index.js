/**
 *
 * assurePropsLoaded
 *
 */

import React from 'react';
// import styled from 'styled-components';

export function assurePropsLoaded(config) {
  const { requiredProps = [], loadingIndicator = null } = config;
  return (Wrapped) => (props) => {
    let isLoading = false;
    requiredProps.every((propList) => {
      if (typeof propList === 'string') {
        isLoading = !props[propList];
        return !isLoading;
      }
      let tempProp = props;
      propList.every((prop) => {
        tempProp = tempProp[prop];
        isLoading = !tempProp;
        return !isLoading;
      });
      return !isLoading;
    });
    if (isLoading) {
      return loadingIndicator;
    }
    return <Wrapped {...props} />;
  };
}

export default assurePropsLoaded;
