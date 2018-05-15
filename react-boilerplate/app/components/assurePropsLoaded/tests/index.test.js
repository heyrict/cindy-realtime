import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import assurePropsLoaded from '../index';

const TestElement = (props) => (
  <div id="test">
    {props.text}
    {props.parent.child}
  </div>
);

TestElement.propTypes = {
  text: PropTypes.string.isRequired,
  parent: PropTypes.shape({
    child: PropTypes.string.isRequired,
  }),
};

TestElement.defaultProps = {
  text: 'DefaultText',
  parent: { child: 'DefaultText' },
};

describe('withAssurePropsLoaded', () => {
  const testText = 'TestText';
  it('Expect mount wrapped component if props meet requirement', () => {
    const Element = assurePropsLoaded({ requiredProps: ['text'] })(TestElement);
    const rendered = mount(<Element text={testText} />);
    expect(rendered.contains(TestElement)).toBe(true);
  });
  it('Expect to mount nested props', () => {
    const Element = assurePropsLoaded({ requiredProps: [['parent', 'child']] })(
      TestElement
    );
    const rendered = mount(<Element parent={{ child: 'TestText' }} />);
    expect(rendered.contains(TestElement)).toBe(true);
  });
  it('Expect mount null if props not meet requirement', () => {
    const Element = assurePropsLoaded({ requiredProps: ['text'] })(TestElement);
    const rendered = mount(<Element />);
    expect(rendered.contains(TestElement)).toBe(false);
  });
  it('Expect mount loadingIndicator', () => {
    const loadingIndicator = <div id="loadingIndicator">li</div>;
    const Element = assurePropsLoaded({
      requiredProps: ['text'],
      loadingIndicator,
    })(TestElement);
    const rendered = mount(<Element />);
    expect(rendered.contains(loadingIndicator)).toBe(true);
  });
});
