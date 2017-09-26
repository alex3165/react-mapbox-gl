import * as React from 'react';
import ZoomControl from '../zoom-control';
import { shallow } from 'enzyme';

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
Enzyme.configure({ adapter: new Adapter() });

describe('ZoomControl', () => {
  it('should render the component', () => {
    const wrapper = shallow(<ZoomControl />);
    expect(wrapper).toBeDefined();
  });
});
