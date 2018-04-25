import React from 'react';
// import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import HomePage from '../index';
import MainFrame from '../MainFrame';
import PuzzleDescribeList from '../PuzzleDescribeList';
// import messages from '../messages';

describe('<HomePage />', () => {
  it('should render the contents', () => {
    const renderedComponent = shallow(
      <HomePage />
    );
    expect(renderedComponent.contains(
      <MainFrame />
    )).toEqual(true);
    expect(renderedComponent.contains(
      <PuzzleDescribeList />
    )).toEqual(true);
  });
});
