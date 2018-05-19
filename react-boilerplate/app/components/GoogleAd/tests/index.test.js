import React from 'react';
import { shallow } from 'enzyme';

import { RegisterGoogleAd, GoogleAd } from '../index';

const FakeGoogleAd = () => <div id="fakeGoogleAd" />;
const fakeToken = 'fakeToken';
const fakeSlot = '000000';
const fakeFormat = 'auto';

describe('<GoogleAd />', () => {
  describe('RegisterGoogleAd', () => {
    it('renders null if clientToken is null', () => {
      const Element = RegisterGoogleAd({ clientToken: null })(FakeGoogleAd);
      const rendered = shallow(<Element />);
      expect(rendered.contains(<FakeGoogleAd />)).toEqual(false);
    });

    it('renders null if clientToken is undefined', () => {
      const Element = RegisterGoogleAd({})(FakeGoogleAd);
      const rendered = shallow(<Element />);
      expect(rendered.contains(<FakeGoogleAd />)).toEqual(false);
    });

    it('renders GoogleAd if clientToken is defined', () => {
      const Element = RegisterGoogleAd({ clientToken: fakeToken })(
        FakeGoogleAd
      );
      const rendered = shallow(<Element />);
      expect(rendered.contains(<FakeGoogleAd client={fakeToken} />)).toEqual(
        true
      );
    });
  });
  describe('GoogleAd', () => {
    it('Expect to accept required props', () => {
      window.adsbygoogle = [];
      expect(window.adsbygoogle.length).toBe(0);
      const rendered = shallow(
        <GoogleAd client={fakeToken} slot={fakeSlot} format={fakeFormat} />
      );
      expect(window.adsbygoogle.length).toBe(1);
      expect(rendered).toMatchSnapshot();
    });
    it('Expect to accept all props', () => {
      const rendered = shallow(
        <GoogleAd
          client={fakeToken}
          slot={fakeSlot}
          format={fakeFormat}
          wrapperDivStyle={{ width: '100%' }}
          layoutKey="-gw-3+1f-3d+2z"
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
