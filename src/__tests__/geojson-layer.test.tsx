import React from 'react';
import { GeoJSONLayer } from '../geojson-layer';
import { mount } from 'enzyme';
import { SourceOptionData } from '../util/types';

describe('GeoJSONLayer', () => {
  // tslint:disable-next-line:no-any
  let map: any;
  let addLayerMock = jest.fn();
  let mapOnEventMock = jest.fn();

  const fillPaint = { 'fill-color': '#001122' };
  // tslint:disable-next-line:no-object-literal-type-assertion
  const data = { type: 'FeatureCollection', features: [] } as SourceOptionData;

  beforeEach(() => {
    addLayerMock = jest.fn();
    mapOnEventMock = jest.fn();
    map = {
      addSource: jest.fn(),
      addLayer: addLayerMock,
      on: mapOnEventMock
    };
  });

  it('Should call addLayer with provided layerOptions', () => {
    mount(
      <GeoJSONLayer
        map={map}
        fillPaint={fillPaint}
        data={data}
        layerOptions={{ minzoom: 13 }}
      />
    );

    const addFillLayerCall = addLayerMock.mock.calls.find(([call]) =>
      call.id.endsWith('-fill')
    );
    expect(addFillLayerCall).toEqual([
      {
        id: 'geojson-1-fill',
        source: 'geojson-1',
        type: 'fill',
        layout: { visibility: 'visible' },
        minzoom: 13,
        paint: { 'fill-color': '#001122' }
      },
      undefined
    ]);
  });

  it('Should call addLayer when no layerOptions provided', () => {
    mount(<GeoJSONLayer map={map} fillPaint={fillPaint} data={data} />);

    const addFillLayerCall = addLayerMock.mock.calls.find(([call]) =>
      call.id.endsWith('-fill')
    );
    expect(addFillLayerCall).toEqual([
      {
        id: 'geojson-2-fill',
        source: 'geojson-2',
        type: 'fill',
        layout: { visibility: 'visible' },
        paint: { 'fill-color': '#001122' }
      },
      undefined
    ]);
  });

  it('Should start listening onClick mouse event', () => {
    mount(
      <GeoJSONLayer
        map={map}
        fillPaint={fillPaint}
        data={data}
        fillOnClick={jest.fn()}
      />
    );

    expect(mapOnEventMock.mock.calls[0][0]).toEqual('click');
    expect(mapOnEventMock.mock.calls[0][1]).toEqual('geojson-3-fill');
  });
});
