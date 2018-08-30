jest.mock('mapbox-gl', () => ({
  Map: {}
}));
jest.mock('../util/overlays', () => ({
  overlayState: jest.fn(() => ({})),
  overlayTransform: jest.fn(() => []),
  anchors: []
}));
import React from 'react';
import Popup, { defaultClassName } from '../popup';
import { MapProvider } from '../map-context';
import { mount } from 'enzyme';

describe('Popup', () => {
  // tslint:disable:no-any
  let map: any;
  // tslint:enable:no-any

  beforeEach(() => {
    map = {
      on: jest.fn()
    };
  });

  it('Should render component', () => {
    const wrapper = mount(
      <MapProvider map={map}>
        <Popup coordinates={[0, 0]} />
      </MapProvider>
    );

    expect(wrapper).toBeDefined();
  });

  it('Should add custom className', () => {
    const wrapper = mount(
      <MapProvider map={map}>
        <Popup className="custom-classname" coordinates={[0, 0]} />
      </MapProvider>
    );

    expect(wrapper.find('Popup').hasClass('custom-classname')).toEqual(true);
  });

  it('Should concat custom className to defaultClassName', () => {
    const wrapper = mount(
      <MapProvider map={map}>
        <Popup className="custom-classname" coordinates={[0, 0]} />
      </MapProvider>
    );
    expect(
      wrapper
        .find('Popup')
        .childAt(0)
        .hasClass(defaultClassName[0])
    ).toEqual(true);
  });
});
