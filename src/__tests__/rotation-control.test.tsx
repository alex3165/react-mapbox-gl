import * as React from 'react';
import RotationControl from '../rotation-control';
import { shallow } from 'enzyme';

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
Enzyme.configure({ adapter: new Adapter() });

describe('RotationControl', () => {
  it('should render the component', () => {
    const wrapper = shallow(<RotationControl />);

    expect(wrapper).toBeDefined();
  });
});
