jest.mock('mapbox-gl', () => ({
  Map: {}
}));

jest.mock('../util/overlays', () => ({
  overlayState: jest.fn(() => ({})),
  overlayTransform: jest.fn(() => []),
  anchors: []
}));

import * as React from 'react';
import Popup, { defaultClassName } from '../popup';
import { mountWithMap, getMapMock } from '../jest/util';

describe('Popup', () => {
  it('Should render component', () => {
    const wrapper = mountWithMap(<Popup coordinates={[0, 0]} />, getMapMock());
    expect(wrapper).toBeDefined();
  });

  it('Should add custom className', () => {
    const wrapper = mountWithMap(
      <Popup className="custom-classname" coordinates={[0, 0]} />,
      getMapMock()
    );

    expect(wrapper.find('Popup').hasClass('custom-classname')).toEqual(true);
  });

  it('Should concat custom className to defaultClassName', () => {
    const wrapper = mountWithMap(
      <Popup className="custom-classname" coordinates={[0, 0]} />,
      getMapMock()
    );

    expect(
      wrapper
        .find('Popup')
        .childAt(0)
        .hasClass(defaultClassName[0])
    ).toEqual(true);
  });
});
