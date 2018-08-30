import React from 'react';
import { ScaleControl } from '../scale-control';
import { shallow } from 'enzyme';

describe('ScaleControl', () => {
  // tslint:disable:no-any
  let map: any;
  // tslint:enable:no-any

  beforeEach(() => {
    map = {
      getBounds: () => ({
        _ne: { lng: 0, lat: 0 },
        _sw: { lng: 0, lat: 0 }
      }),
      _canvas: {
        clientWidth: 10
      },
      on: jest.fn()
    };
  });

  it('should render the component', () => {
    const wrapper = shallow(<ScaleControl map={map} />);
    expect(wrapper).toBeDefined();
  });
});
