import {
  MapboxConfiguration,
  MapboxProvider
} from '../providers/mapbox-provider';
import * as React from 'react';
import Map, { FitBounds } from '../map';
import { mount } from 'enzyme';
import { getMapMock } from '../jest/util';

jest.mock('mapbox-gl', () => ({
  Map: jest.fn()
}));

let mockfitBounds = jest.fn();
let mockon = jest.fn();

// tslint:disable-next-line:no-any
const getMock = (override = {}): any =>
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

const mountWithProvider = (
  component: JSX.Element,
  providerProps?: Partial<MapboxConfiguration>
) => {
  return mount(component, {
    wrappingComponent: MapboxProvider,
    wrappingComponentProps: {
      accessToken: '',
      mapInstance: getMock(),
      ...providerProps
    }
  });
};

describe('Map', () => {
  // tslint:disable-next-line:no-any
  beforeEach(() => {
    mockfitBounds = jest.fn();
    mockon = jest.fn();
  });

  it('Should render the map correctly', () => {
    mountWithProvider(<Map style="" />);
  });

  it('Should call fitBounds with the right parameters', () => {
    const fitBoundsValues: FitBounds = [[0, 1], [2, 3]];
    const fitBoundsOptions = { linear: true };

    mountWithProvider(
      <Map
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

    const mapInstance = getMock({
      flyTo,
      fitBounds: mockfitBounds
    });

    const wrapper = mountWithProvider(
      <Map
        style=""
        fitBounds={fitBoundsValues}
        fitBoundsOptions={fitBoundsOptions}
      />,
      { mapInstance }
    );

    wrapper.setProps({ fitBoundsOptions: newFitBoundsOptions });

    expect(mockfitBounds.mock.calls[1][1]).toBe(newFitBoundsOptions);
  });

  it.skip('Should calc the center from fitbounds if center is not given', () => {
    const fitBoundsValues: FitBounds = [[0, 3], [2, 9]];
    const mapInstance = getMock();

    mountWithProvider(<Map style="" fitBounds={fitBoundsValues} />, {
      mapInstance
    });

    // tslint:disable-next-line:no-any
    const lastCall: any =
      mapInstance.mock.calls[mapInstance.mock.calls.length - 1];
    expect(lastCall[0].center).toEqual([1, 6]);
  });

  it('Should listen onStyleLoad event', () => {
    mountWithProvider(<Map style="" onStyleLoad={jest.fn()} />);

    expect(mockon).toBeCalledWith('load', jasmine.any(Function));
  });

  it('Should update the map center position', () => {
    const flyTo = jest.fn();
    const center = [3, 4];
    const mapInstance = getMock({
      flyTo
    });

    const wrapper = mountWithProvider(<Map style="" center={[1, 2]} />, {
      mapInstance
    });

    wrapper.setProps({ center });

    expect(flyTo.mock.calls[0][0].center).toEqual(center);
  });

  it('Should update maxBounds', () => {
    const flyTo = jest.fn();
    const maxBoundsProps = [[1, 0], [0, 1]];
    const mockMaxBounds = jest.fn();

    const mapInstance = getMock({
      setMaxBounds: mockMaxBounds,
      flyTo
    });

    const wrapper = mountWithProvider(<Map style="" />, { mapInstance });

    wrapper.setProps({ maxBounds: maxBoundsProps });

    expect(mockMaxBounds).toBeCalledWith(maxBoundsProps);
  });

  // Handling zoom prop
  it('Should not update zoom when using same reference equality', () => {
    const flyTo = jest.fn();

    const mapInstance = getMock({
      flyTo
    });

    const zoom: [number] = [3];

    const wrapper = mountWithProvider(<Map style="" zoom={zoom} />, {
      mapInstance
    });

    wrapper.setProps({ zoom });

    expect(flyTo).not.toHaveBeenCalled();
  });

  it('Should update the zoom on broken reference equality', () => {
    const flyTo = jest.fn();
    const mapInstance = getMock({
      flyTo
    });

    const wrapper = mountWithProvider(<Map style="" zoom={[1]} />, {
      mapInstance
    });

    wrapper.setProps({ zoom: [1] });

    expect(flyTo).toHaveBeenCalled();
  });

  // Handling bearing prop
  it('Should not update bearing when using same reference equality', () => {
    const flyTo = jest.fn();

    const mapInstance = getMock({
      flyTo
    });

    const bearing: [number] = [3];

    const wrapper = mountWithProvider(<Map style="" bearing={bearing} />, {
      mapInstance
    });

    wrapper.setProps({ bearing });

    expect(flyTo).not.toHaveBeenCalled();
  });

  it('Should update the bearing on broken reference equality', () => {
    const flyTo = jest.fn();
    const mapInstance = getMock({
      flyTo
    });

    const wrapper = mountWithProvider(<Map style="" bearing={[1]} />, {
      mapInstance
    });

    wrapper.setProps({ bearing: [1] });

    expect(flyTo).toHaveBeenCalled();
  });

  // Handling pitch prop
  it('Should not update pitch when using same reference equality', () => {
    const flyTo = jest.fn();
    const mapInstance = getMock({
      flyTo
    });
    const pitch: [number] = [3];

    const wrapper = mountWithProvider(<Map style="" pitch={pitch} />, {
      mapInstance
    });

    wrapper.setProps({ pitch });

    expect(flyTo).not.toHaveBeenCalled();
  });

  it('Should update the pitch on broken reference equality', () => {
    const flyTo = jest.fn();
    const mapInstance = getMock({
      flyTo
    });

    const wrapper = mountWithProvider(<Map style="" pitch={[1]} />, {
      mapInstance
    });

    wrapper.setProps({ pitch: [1] });

    expect(flyTo).toHaveBeenCalled();
  });

  it('Should pass animation options and flyTo options', () => {
    const flyTo = jest.fn();

    const mapInstance = getMock({
      flyTo
    });

    const zoom: [number] = [3];
    const flyToOptions = {
      speed: 0.1,
      curve: 0.9
    };
    const animationOptions = {
      offset: [20, 60]
    };

    const wrapper = mountWithProvider(
      <Map
        style=""
        zoom={zoom}
        flyToOptions={flyToOptions}
        animationOptions={animationOptions}
      />,
      { mapInstance }
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
