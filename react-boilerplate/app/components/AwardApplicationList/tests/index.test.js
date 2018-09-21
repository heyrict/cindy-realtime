import React from 'react';
import { shallow } from 'enzyme';
import LoadingDots from 'components/LoadingDots';
import { ButtonOutline } from 'style-store';

import { AwardApplicationList } from '../index';

import currentUserData from '../graphql/currentUserData.json';
import awardApplicationListData from '../graphql/awardApplicationListData.json';

describe('<AwardApplicationList />', () => {
  it('Before Apollo finishing fetching data', () => {
    const rendered = shallow(
      <AwardApplicationList
        currentUserId="VXNlck5vZGU6MQ=="
        hasMore={() => undefined}
        loadMore={() => {
          throw Error();
        }}
        loading
        allowPagination
      />,
    );
    expect(rendered.contains(<LoadingDots py={50} size={8} />)).toEqual(true);
    expect(rendered.contains('button')).toEqual(false);
  });
  it('After Apollo finishing fetching data', () => {
    const loadMoreSpy = jest.fn();
    const rendered = shallow(
      <AwardApplicationList
        currentUserId="VXNlck5vZGU6MQ=="
        currentUser={currentUserData.user}
        allAwardApplications={awardApplicationListData.allAwardApplications}
        hasMore={() => true}
        loadMore={loadMoreSpy}
        loading={false}
        allowPagination
      />,
    );
    rendered.tap((n) => console.log(n.debug()));
    expect(rendered.contains(<LoadingDots py={50} size={8} />)).toEqual(false);
    rendered.find(ButtonOutline).simulate('click');
    expect(loadMoreSpy).toHaveBeenCalled();
  });
});
