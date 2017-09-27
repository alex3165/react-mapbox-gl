import * as React from 'react';
import RotationControl from '../rotation-control';
import { shallow } from 'enzyme';

describe('RotationControl', () => {
  it('should render the component', () => {
    const wrapper = shallow(<RotationControl />, {
      disableLifecycleMethods: true
    });

    expect(wrapper).toBeDefined();
  });
});
