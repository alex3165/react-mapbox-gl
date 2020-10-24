jest.mock('mapbox-gl', () => ({
  Map: jest.fn()
}));

import * as React from 'react';
import ReactMapboxGl, { FitBounds } from '../map';
import { mount } from 'enzyme';
import { getMapMock } from '../jest/util';

let mockfitBounds = jest.fn();
let mockon = jest.fn();

const getMock = (override = {}) =>
  getMapMock({
    fitBounds: mockfitBounds,
    on: mockon,
    remove: jest.fn(),
    getCenter: jest.fn().mockReturnValue({ lat: 2, lng: 1 }),
    getZoom: jest.fn(),
    getBearing: jest.fn(),
    getPitch: jest.fn(),
    flyTo: jest.fn(),
    ...override
  });
describe('Map', () => {
  // tslint:disable-next-line:no-any
  beforeEach(() => {
    mockfitBounds = jest.fn();
    mockon = jest.fn();
  });

  it('Should render the map correctly', () => {
    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock() as any
    });
    mount(<MapboxMap style="" />);
  });

  it('Should call fitBounds with the right parameters', () => {
    const fitBoundsValues: FitBounds = [[0, 1], [2, 3]];
    const fitBoundsOptions = { linear: true };
    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock() as any
    });

    mount(
      <MapboxMap
        style=""
        fitBounds={fitBoundsValues}
        fitBoundsOptions={fitBoundsOptions}
      />
    );

    expect(mockfitBounds).toBeCalledWith(fitBoundsValues, fitBoundsOptions, {
      fitboundUpdate: true
    });
  });

  it('Should update fitBounds if fitBoundsOptions changes', () => {
    const flyTo = jest.fn();
    const fitBoundsValues: FitBounds = [[0, 1], [2, 3]];
    const fitBoundsOptions = { offset: [150, 0] as [number, number] };
    const newFitBoundsOptions = { offset: [0, 0] };

    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock({
        flyTo,
        fitBounds: mockfitBounds
      }) as any
    });

    const wrapper = mount(
      <MapboxMap
        style=""
        fitBounds={fitBoundsValues}
        fitBoundsOptions={fitBoundsOptions}
      />
    );

    wrapper.setProps({ fitBoundsOptions: newFitBoundsOptions });

    expect(mockfitBounds.mock.calls[1][1]).toBe(newFitBoundsOptions);
  });

  it.skip('Should calc the center from fitbounds if center is not given', () => {
    const fitBoundsValues: FitBounds = [[0, 3], [2, 9]];
    const mockMap = getMock() as any;
    const MapboxMap = ReactMapboxGl({ accessToken: '', mapInstance: mockMap });

    mount(<MapboxMap style="" fitBounds={fitBoundsValues} />);

    // tslint:disable-next-line:no-any
    const lastCall: any = mockMap.mock.calls[mockMap.mock.calls.length - 1];
    expect(lastCall[0].center).toEqual([1, 6]);
  });

  it('Should listen onStyleLoad event', () => {
    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock() as any
    });

    mount(<MapboxMap style="" onStyleLoad={jest.fn()} />);

    expect(mockon).toBeCalledWith('load', jasmine.any(Function));
  });

  it('Should update the map center position', () => {
    const flyTo = jest.fn();
    const center = [3, 4];
    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock({
        flyTo
      }) as any
    });

    const wrapper = mount(<MapboxMap style="" center={[1, 2]} />);

    wrapper.setProps({ center });

    expect(flyTo.mock.calls[0][0].center).toEqual(center);
  });

  it('Should update maxBounds', () => {
    const flyTo = jest.fn();
    const maxBoundsProps = [[1, 0], [0, 1]];
    const mockMaxBounds = jest.fn();

    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock({
        setMaxBounds: mockMaxBounds,
        flyTo
      }) as any
    });

    const wrapper = mount(<MapboxMap style="" />);
    wrapper.setProps({ maxBounds: maxBoundsProps });

    expect(mockMaxBounds).toBeCalledWith(maxBoundsProps);
  });

  // Handling zoom prop
  it('Should not update zoom when using same reference equality', () => {
    const flyTo = jest.fn();
    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock({
        flyTo
      }) as any
    });

    const zoom: [number] = [3];

    const wrapper = mount(<MapboxMap style="" zoom={zoom} />);

    wrapper.setProps({ zoom });

    expect(flyTo).not.toHaveBeenCalled();
  });

  it('Should update the zoom on broken reference equality', () => {
    const flyTo = jest.fn();
    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock({
        flyTo
      }) as any
    });

    const wrapper = mount(<MapboxMap style="" zoom={[1]} />);

    wrapper.setProps({ zoom: [1] });

    expect(flyTo).toHaveBeenCalled();
  });

  // Handling bearing prop
  it('Should not update bearing when using same reference equality', () => {
    const flyTo = jest.fn();
    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock({
        flyTo
      }) as any
    });
    const bearing: [number] = [3];

    const wrapper = mount(<MapboxMap style="" bearing={bearing} />);

    wrapper.setProps({ bearing });

    expect(flyTo).not.toHaveBeenCalled();
  });

  it('Should update the bearing on broken reference equality', () => {
    const flyTo = jest.fn();
    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock({
        flyTo
      }) as any
    });

    const wrapper = mount(<MapboxMap style="" bearing={[1]} />);

    wrapper.setProps({ bearing: [1] });

    expect(flyTo).toHaveBeenCalled();
  });

  // Handling pitch prop
  it('Should not update pitch when using same reference equality', () => {
    const flyTo = jest.fn();
    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock({
        flyTo
      }) as any
    });
    const pitch: [number] = [3];

    const wrapper = mount(<MapboxMap style="" pitch={pitch} />);

    wrapper.setProps({ pitch });

    expect(flyTo).not.toHaveBeenCalled();
  });

  it('Should update the pitch on broken reference equality', () => {
    const flyTo = jest.fn();
    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock({
        flyTo
      }) as any
    });

    const wrapper = mount(<MapboxMap style="" pitch={[1]} />);

    wrapper.setProps({ pitch: [1] });

    expect(flyTo).toHaveBeenCalled();
  });

  it('Should pass animation options and flyTo options', () => {
    const flyTo = jest.fn();
    const MapboxMap = ReactMapboxGl({
      accessToken: '',
      mapInstance: getMock({
        flyTo
      }) as any
    });
    const zoom: [number] = [3];
    const flyToOptions = {
      speed: 0.1,
      curve: 0.9
    };
    const animationOptions = {
      offset: [20, 60]
    };

    const wrapper = mount(
      <MapboxMap
        style=""
        zoom={zoom}
        flyToOptions={flyToOptions}
        animationOptions={animationOptions}
      />
    );

    wrapper.setProps({ zoom: [1] });

    expect(flyTo.mock.calls[0][0]).toEqual({
      ...flyToOptions,
      ...animationOptions,
      bearing: undefined,
      center: { lat: 2, lng: 1 },
      pitch: undefined,
      zoom: 1
    });
  });
});
