import * as React from 'react';
import ZoomControl from '../zoom-control';
import { shallow } from 'enzyme';

describe('ZoomControl', () => {
  it('should render the component', () => {
    const wrapper = shallow(<ZoomControl />);
    expect(wrapper).toBeDefined();
  });

  describe('hovering over buttons', () => {
    it('should highlight buttons on mouseover', () => {
      const wrapper = shallow(<ZoomControl />);
      const plus = () => wrapper.childAt(0);
      const minus = () => wrapper.childAt(1);

      expect(plus().props().style.opacity).toBe(0.95);
      expect(minus().props().style.opacity).toBe(0.95);

      plus().simulate('mouseover');
      expect(plus().props().style.opacity).toBe(1);
      expect(minus().props().style.opacity).toBe(0.95);

      minus().simulate('mouseover');
      expect(plus().props().style.opacity).toBe(0.95);
      expect(minus().props().style.opacity).toBe(1);

      plus().simulate('mouseover');
      expect(plus().props().style.opacity).toBe(1);
      expect(minus().props().style.opacity).toBe(0.95);
    });

    it('should remove highlight from plus button on mouseout', () => {
      const wrapper = shallow(<ZoomControl />);
      const plus = () => wrapper.childAt(0);
      const minus = () => wrapper.childAt(1);

      expect(plus().props().style.opacity).toBe(0.95);

      plus().simulate('mouseover');
      expect(plus().props().style.opacity).toBe(1);

      minus().simulate('mouseout');
      expect(plus().props().style.opacity).toBe(0.95);
    });

    it('should remove highlight from minus button on mouseout', () => {
      const wrapper = shallow(<ZoomControl />);
      const minus = () => wrapper.childAt(1);

      expect(minus().props().style.opacity).toBe(0.95);

      minus().simulate('mouseover');
      expect(minus().props().style.opacity).toBe(1);

      minus().simulate('mouseout');
      expect(minus().props().style.opacity).toBe(0.95);
    });
  });
});
