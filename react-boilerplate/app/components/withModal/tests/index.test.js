import React from 'react';
import { shallowWithIntl } from 'test/helpers';

import withModal from '../index';

const Header = 'header';
const bodyConfirmSpy = jest.fn();
const Body = () => <div id="test-body" />;

describe('<ModalContainer />', () => {
  describe('Default Props', () => {
    const Element = withModal({})(Body);
    const onHideSpy = jest.fn();
    const rendered = shallowWithIntl(<Element show onHide={onHideSpy} />);
    it('mounts with only body', () => {
      expect(rendered.find('.cindy-modal-header')).not.toExist();
      expect(rendered.find('.cindy-modal-footer')).not.toExist();
      expect(rendered.find(Body)).toExist();
    });
  });

  describe('All Props', () => {
    const header = 'TestHeader';
    const footer = { close: true, confirm: true };
    const Element = withModal({
      header,
      footer,
    })(Body);
    const onHideSpy = jest.fn();
    const rendered = shallowWithIntl(<Element show onHide={onHideSpy} />);
    it('mounts with header', () => {
      expect(
        rendered
          .find('.cindy-modal-header')
          .dive()
          .text(),
      ).toContain(header);
      rendered
        .find('.cindy-modal-header')
        .find('[onClick]')
        .simulate('click');
      expect(onHideSpy).toHaveBeenCalledTimes(1);
    });
    it('mounts with body', () => {
      expect(rendered.find(Body)).toExist();
    });
    it('mounts with footer', () => {
      expect(rendered.find('.cindy-modal-footer-confirm')).toExist();
      rendered.find('.cindy-modal-footer-close').simulate('click');
      expect(onHideSpy).toHaveBeenCalledTimes(2);
    });
  });
});
