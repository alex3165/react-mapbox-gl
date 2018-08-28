import { MapboxOptions } from 'mapbox-gl';
let mockfitBounds = jest.fn();
let mockon = jest.fn();
let mockCenter = jest.fn();

jest.mock('mapbox-gl', () => ({
  Map(opts: MapboxOptions) {
    return {
      opts,
      fitBounds: mockfitBounds,
      on: mockon,
      getCenter: mockCenter
    };
  }
}));

import React from 'react';
import ReactMapboxGl, { FitBounds } from '../map';
import { mount } from 'enzyme';

describe('Map', () => {
  let mapState;
  beforeEach(() => {
    mockfitBounds = jest.fn();
    mockon = jest.fn();
    mockCenter = jest.fn();

    mapState = {
      getCenter: jest.fn(() => ({ lng: 1, lat: 2 })),
      getZoom: jest.fn(() => 2),
      getBearing: jest.fn(),
      getPitch: jest.fn()
    };
  });

  it('Should render the map correctly', () => {
    const MapboxMap = ReactMapboxGl({ accessToken: '' });
    mount(<MapboxMap mapStyle="" />);
  });

  it('Should call fitBounds with the right parameters', () => {
    const fitBoundsValues: FitBounds = [[0, 1], [2, 3]];
    const fitBoundsOptions = { linear: true };
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    mount(
      <MapboxMap
        mapStyle=""
        fitBounds={fitBoundsValues}
        fitBoundsOptions={fitBoundsOptions}
      />
    );

    expect(mockfitBounds).toBeCalledWith(fitBoundsValues, fitBoundsOptions);
  });

  it('Should update fitBounds if fitBoundsOptions changes', () => {
    const flyTo = jest.fn();
    const fitBoundsValues: FitBounds = [[0, 1], [2, 3]];
    const fitBoundsOptions = { offset: [150, 0] };
    const newFitBoundsOptions = { offset: [0, 0] };
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    const wrapper = mount(
      <MapboxMap
        mapStyle=""
        fitBounds={fitBoundsValues}
        fitBoundsOptions={fitBoundsOptions}
      />
    );
    wrapper.setState({
      map: {
        ...mapState,
        flyTo,
        fitBounds: mockfitBounds
      }
    });

    wrapper.setProps({ fitBoundsOptions: newFitBoundsOptions });

    expect(mockfitBounds.mock.calls[1][1]).toBe(newFitBoundsOptions);
  });

  it('Should calc the center from fitbounds if center is not given', () => {
    const fitBoundsValues: FitBounds = [[0, 3], [2, 9]];
    const MapboxMap = ReactMapboxGl({ accessToken: '' });
    const mapBoxMap = mount(
      <MapboxMap mapStyle="" fitBounds={fitBoundsValues} />
    );
    // tslint:disable-next-line:no-any
    const opts = (mapBoxMap.state('map') as any).opts as MapboxOptions;
    expect(opts.center).toEqual([1, 6]);
  });

  it('Should listen onStyleLoad event', () => {
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    mount(<MapboxMap mapStyle="" onStyleLoad={jest.fn()} />);

    expect(mockon).toBeCalledWith('load', jasmine.any(Function));
  });

  it('Should update the map center position', () => {
    const flyTo = jest.fn();
    const center = [3, 4];
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    const wrapper = mount(<MapboxMap mapStyle="" center={[1, 2]} />);

    wrapper.setState({
      map: {
        ...mapState,
        flyTo
      }
    });

    wrapper.setProps({ center });

    expect(flyTo.mock.calls[0][0].center).toEqual(center);
  });

  it('Should update maxBounds', () => {
    const flyTo = jest.fn();
    const maxBoundsProps = [[1, 0], [0, 1]];
    const mockMaxBounds = jest.fn();

    const MapboxMap = ReactMapboxGl({ accessToken: '' });
    const wrapper = mount(<MapboxMap mapStyle="" />);
    wrapper.setState({
      map: {
        setMaxBounds: mockMaxBounds,
        ...mapState,
        flyTo
      }
    });
    wrapper.setProps({ maxBounds: maxBoundsProps });

    expect(mockMaxBounds).toBeCalledWith(maxBoundsProps);
  });

  // Handling zoom prop
  it('Should not update zoom when using same reference equality', () => {
    const MapboxMap = ReactMapboxGl({ accessToken: '' });
    const flyTo = jest.fn();
    const zoom: [number] = [3];

    const wrapper = mount(<MapboxMap mapStyle="" zoom={zoom} />);

    wrapper.setState({
      map: {
        ...mapState,
        flyTo
      }
    });
    wrapper.setProps({ zoom });

    expect(flyTo).not.toHaveBeenCalled();
  });

  it('Should update the zoom on broken reference equality', () => {
    const flyTo = jest.fn();
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    const wrapper = mount(<MapboxMap mapStyle="" zoom={[1]} />);

    wrapper.setState({
      map: {
        ...mapState,
        flyTo
      }
    });
    wrapper.setProps({ zoom: [1] });

    expect(flyTo).toHaveBeenCalled();
  });

  // Handling bearing prop
  it('Should not update bearing when using same reference equality', () => {
    const MapboxMap = ReactMapboxGl({ accessToken: '' });
    const flyTo = jest.fn();
    const bearing: [number] = [3];

    const wrapper = mount(<MapboxMap mapStyle="" bearing={bearing} />);

    wrapper.setState({
      map: {
        ...mapState,
        flyTo
      }
    });
    wrapper.setProps({ bearing });

    expect(flyTo).not.toHaveBeenCalled();
  });

  it('Should update the bearing on broken reference equality', () => {
    const flyTo = jest.fn();
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    const wrapper = mount(<MapboxMap mapStyle="" bearing={[1]} />);

    wrapper.setState({
      map: {
        ...mapState,
        flyTo
      }
    });
    wrapper.setProps({ bearing: [1] });

    expect(flyTo).toHaveBeenCalled();
  });

  // Handling pitch prop
  it('Should not update pitch when using same reference equality', () => {
    const MapboxMap = ReactMapboxGl({ accessToken: '' });
    const flyTo = jest.fn();
    const pitch: [number] = [3];

    const wrapper = mount(<MapboxMap mapStyle="" pitch={pitch} />);

    wrapper.setState({
      map: {
        ...mapState,
        flyTo
      }
    });
    wrapper.setProps({ pitch });

    expect(flyTo).not.toHaveBeenCalled();
  });

  it('Should update the pitch on broken reference equality', () => {
    const flyTo = jest.fn();
    const MapboxMap = ReactMapboxGl({ accessToken: '' });

    const wrapper = mount(<MapboxMap mapStyle="" pitch={[1]} />);

    wrapper.setState({
      map: {
        ...mapState,
        flyTo
      }
    });
    wrapper.setProps({ pitch: [1] });

    expect(flyTo).toHaveBeenCalled();
  });

  it('Should pass animation options and flyTo options', () => {
    const MapboxMap = ReactMapboxGl({ accessToken: '' });
    const flyTo = jest.fn();
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
        mapStyle=""
        zoom={zoom}
        flyToOptions={flyToOptions}
        animationOptions={animationOptions}
      />
    );

    wrapper.setState({
      map: {
        ...mapState,
        flyTo
      }
    });

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
