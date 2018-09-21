import React from 'react';
import { shallow } from 'enzyme';

import FieldGroup from '../index';

const ctlId = 'ctlId';
const label = 'label';

describe('<FieldGroup />', () => {
  it('Rendering with Ctl', () => {
    const Ctl = ({ ctlId }) => <div id={ctlId} />;
    const rendered = shallow(
      <FieldGroup label={label} Ctl={Ctl} ctlId={ctlId} />,
    );
    expect(rendered.containsMatchingElement(<Ctl ctlId={ctlId} />)).toBe(true);
  });

  it('Rendering with CtlElement', () => {
    const CtlElement = <div id={ctlId} />;
    const rendered = shallow(
      <FieldGroup label={label} CtlElement={CtlElement} ctlId={ctlId} />,
    );
    expect(rendered.containsMatchingElement(<div id={ctlId} />)).toBe(true);
  });

  it('Rendering with help', () => {
    const helpStr = 'help';
    const rendered = shallow(
      <FieldGroup label={label} ctlId={ctlId} help={helpStr} />,
    );
    expect(rendered.contains(helpStr)).toBe(true);
  });
});
