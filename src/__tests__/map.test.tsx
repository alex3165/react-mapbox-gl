let fitBounds = jest.fn();
let on = jest.fn();
const Map = jest.fn(() => ({
  fitBounds,
  on
}));

jest.mock('mapbox-gl', () => ({
  Map
}));

import * as React from 'react';
import ReactMapboxGl, { FitBounds } from '../map';
import { mount } from 'enzyme';

describe('Map', () => {
  let mapState;

  beforeEach(() => {
    fitBounds = jest.fn();
    on = jest.fn();

    mapState = {
      getCenter: jest.fn(() => ({ lng: 1, lat: 2 })),
      getZoom: jest.fn(() => 2),
      getBearing: jest.fn(),
      getPitch: jest.fn()
    };
  });

  it('Should render the map correctly', () => {
    mount(
      <ReactMapboxGl style="" accessToken=""/>
    );
  });

  it('Should call fitBounds with the right parameters', () => {
    const fitBoundsValues: FitBounds = [[0, 1], [2, 3]];
    const fitBoundsOptions = { linear: true };

    mount(
      <ReactMapboxGl style="" accessToken="" fitBounds={fitBoundsValues} fitBoundsOptions={fitBoundsOptions}/>
    );

    expect(fitBounds).toBeCalledWith(
      fitBoundsValues,
      fitBoundsOptions
    );
  });

  it('Should calc the center from fitbounds if center is not given', () => {
    const fitBoundsValues: FitBounds = [[0, 3], [2, 9]];

    mount(
      <ReactMapboxGl style="" accessToken="" fitBounds={fitBoundsValues}/>
    );

    const lastCall = Map.mock.calls[Map.mock.calls.length - 1];
    expect(lastCall[0].center).toEqual([1, 6]);
  });

  it('Should listen onStyleLoad event', () => {
    mount(
      <ReactMapboxGl style="" accessToken="" onStyleLoad={jest.fn()}/>
    );

    expect(on).toBeCalledWith('style.load', jasmine.any(Function));
  });

  it('Should update the map center position', () => {
    const flyTo = jest.fn();
    const center = [3, 4];

    const wrapper = mount(
      <ReactMapboxGl style="" accessToken="" center={[1, 2]}/>
    );

    wrapper.setState({ map: {
      ...mapState,
      flyTo
    }});

    wrapper.setProps({ center });

    expect(flyTo.mock.calls[0][0].center).toEqual(center);
  });

  it('Should update the zoom on broken reference equality', () => {
    const flyTo = jest.fn();

    const wrapper = mount(
      <ReactMapboxGl style="" accessToken="" zoom={[1]}/>
    );

    wrapper.setState({ map: {
      ...mapState,
      flyTo
   }});
    wrapper.setProps({ zoom: [1] });

    expect(flyTo.mock.calls[0][0].zoom).toEqual(1);
  });

  it('Should not update zoom when using same reference equality', () => {
    const flyTo = jest.fn();
    const zoom = [3];

    const wrapper = mount(
      <ReactMapboxGl style="" accessToken="" zoom={zoom}/>
    );

    wrapper.setState({ map: {
      ...mapState,
      flyTo
   }});
    wrapper.setProps({ zoom });

    expect(flyTo).not.toHaveBeenCalled();
  });
});
