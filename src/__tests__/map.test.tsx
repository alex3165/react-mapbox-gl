let mockfitBounds = jest.fn();
let mockon = jest.fn();

const mockMap = jest.fn(() => ({
  fitBounds: mockfitBounds,
  on: mockon
}));

jest.mock('mapbox-gl', () => ({
  Map: mockMap
}));

import * as React from 'react';
import ReactMapboxGl, { FitBounds } from '../map';
import { mount } from 'enzyme';

describe('Map', () => {
  let mapState;

  beforeEach(() => {
    mockfitBounds = jest.fn();
    mockon = jest.fn();

    mapState = {
      getCenter: jest.fn(() => ({ lng: 1, lat: 2 })),
      getZoom: jest.fn(() => 2),
      getBearing: jest.fn(),
      getPitch: jest.fn()
    };
  });

  it('Should render the map correctly', () => {
    const MapboxMap = ReactMapboxGl({ accessToken: '' });
    mount(<MapboxMap style="" />);
  });

  it('Should call fitBounds with the right parameters', () => {
    const fitBoundsValues: FitBounds = [[0, 1], [2, 3]];
    const fitBoundsOptions = { linear: true };
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    mount(
      <MapboxMap
        style=""
        fitBounds={fitBoundsValues}
        fitBoundsOptions={fitBoundsOptions}
      />
    );

    expect(mockfitBounds).toBeCalledWith(fitBoundsValues, fitBoundsOptions);
  });

  it('Should calc the center from fitbounds if center is not given', () => {
    const fitBoundsValues: FitBounds = [[0, 3], [2, 9]];
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    mount(<MapboxMap style="" fitBounds={fitBoundsValues} />);

    const lastCall = mockMap.mock.calls[mockMap.mock.calls.length - 1];
    expect(lastCall[0].center).toEqual([1, 6]);
  });

  it('Should listen onStyleLoad event', () => {
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    mount(<MapboxMap style="" onStyleLoad={jest.fn()} />);

    expect(mockon).toBeCalledWith('load', jasmine.any(Function));
  });

  it('Should update the map center position', () => {
    const flyTo = jest.fn();
    const center = [3, 4];
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    const wrapper = mount(<MapboxMap style="" center={[1, 2]} />);

    wrapper.setState({
      map: {
        ...mapState,
        flyTo
      }
    });

    wrapper.setProps({ center });

    expect(flyTo.mock.calls[0][0].center).toEqual(center);
  });

  it('Should update the zoom on broken reference equality', () => {
    const flyTo = jest.fn();
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    const wrapper = mount(<MapboxMap style="" zoom={[1]} />);

    wrapper.setState({
      map: {
        ...mapState,
        flyTo
      }
    });
    wrapper.setProps({ zoom: [1] });

    expect(flyTo.mock.calls[0][0].zoom).toEqual(1);
  });

  it('Should not update zoom when using same reference equality', () => {
    const MapboxMap = ReactMapboxGl({ accessToken: '' });
    const flyTo = jest.fn();
    const zoom = [3];

    const wrapper = mount(<MapboxMap style="" zoom={zoom} />);

    wrapper.setState({
      map: {
        ...mapState,
        flyTo
      }
    });
    wrapper.setProps({ zoom });

    expect(flyTo).not.toHaveBeenCalled();
  });
});
