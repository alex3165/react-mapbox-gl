import * as React from 'react';
import ZoomControl from '../zoom-control';
import { mountWithMap, getMapMock } from '../jest/util';

describe('ZoomControl', () => {
  const zoomIn = '#zoomIn';
  const zoomOut = '#zoomOut';

  it('should render the component', () => {
    const wrapper = mountWithMap(<ZoomControl />, getMapMock());
    expect(wrapper).toBeDefined();
  });

  describe('hovering over buttons', () => {
    it('should highlight buttons on mouseover', () => {
      const wrapper = mountWithMap(<ZoomControl />, getMapMock());
      const getButtonStyle = (tag: string) => {
        const style = wrapper.find(tag).props().style;
        return style!;
      };

      expect(getButtonStyle(zoomIn).opacity).toBe(0.95);
      expect(getButtonStyle(zoomOut).opacity).toBe(0.95);

      wrapper.find(zoomIn).simulate('mouseover');

      expect(getButtonStyle(zoomIn).opacity).toBe(1);
      expect(getButtonStyle(zoomOut).opacity).toBe(0.95);

      wrapper.find(zoomOut).simulate('mouseover');
      expect(getButtonStyle(zoomIn).opacity).toBe(0.95);
      expect(getButtonStyle(zoomOut).opacity).toBe(1);

      wrapper.find(zoomIn).simulate('mouseover');
      expect(getButtonStyle(zoomIn).opacity).toBe(1);
      expect(getButtonStyle(zoomOut).opacity).toBe(0.95);
    });

    it('should remove highlight from plus button on mouseout', () => {
      const wrapper = mountWithMap(<ZoomControl />, getMapMock());
      const getButtonStyle = (tag: string) => {
        const style = wrapper.find(tag).props().style;
        return style!;
      };

      expect(getButtonStyle(zoomIn).opacity).toBe(0.95);

      wrapper.find(zoomIn).simulate('mouseover');
      expect(getButtonStyle(zoomIn).opacity).toBe(1);

      wrapper.find(zoomOut).simulate('mouseout');
      expect(getButtonStyle(zoomIn).opacity).toBe(0.95);
    });

    it('should remove highlight from minus button on mouseout', () => {
      const wrapper = mountWithMap(<ZoomControl />, getMapMock());
      const getButtonStyle = (tag: string) => {
        const style = wrapper.find(tag).props().style;
        return style!;
      };

      expect(getButtonStyle(zoomOut).opacity).toBe(0.95);

      wrapper.find(zoomOut).simulate('mouseover');
      expect(getButtonStyle(zoomOut).opacity).toBe(1);

      wrapper.find(zoomOut).simulate('mouseout');
      expect(getButtonStyle(zoomOut).opacity).toBe(0.95);
    });
  });
});
