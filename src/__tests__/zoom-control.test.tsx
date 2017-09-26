import * as React from 'react';
import ZoomControl from '../zoom-control';
import { shallow } from 'enzyme';

describe('ZoomControl', () => {
  it('should render the component', () => {
    const wrapper = shallow(<ZoomControl />);
    expect(wrapper).toBeDefined();
  });
});
