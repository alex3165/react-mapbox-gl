import * as React from 'react';
import ScaleControl from '../scale-control';
import { mountWithMap, getMapMock } from '../jest/util';

describe('ScaleControl', () => {
  it.skip('should render the component', () => {
    const wrapper = mountWithMap(
      <ScaleControl />,
      getMapMock({
        _canvas: {
          clientwidth: 900
        },
        getBounds: jest.fn().mockReturnValue({
          _ne: { lng: 0, lat: 0 },
          _sw: { lng: 0, lat: 0 }
        })
      })
    );

    expect(wrapper).toBeDefined();
  });
});
