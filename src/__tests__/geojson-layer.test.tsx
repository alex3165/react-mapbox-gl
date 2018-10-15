import * as React from 'react';
import GeoJSONLayer from '../geojson-layer';
import { getMapMock, mountWithMap } from '../jest/util';

describe('GeoJSONLayer', () => {
  const fillPaint = { 'fill-color': '#001122' };
  const data = { type: 'FeatureCollection', features: [] };

  it('Should call addLayer with provided layerOptions', () => {
    const mapMock = getMapMock();

    const GeoJSONLayerComp = (
      <GeoJSONLayer
        fillPaint={fillPaint}
        data={data}
        layerOptions={{ minzoom: 13 }}
      />
    );

    mountWithMap(GeoJSONLayerComp, mapMock);

    const addFillLayerCall = mapMock.addLayer.mock.calls.find(([call]) =>
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
    const GeoJSONLayerComp = <GeoJSONLayer fillPaint={fillPaint} data={data} />;
    const mapMock = getMapMock();

    mountWithMap(GeoJSONLayerComp, mapMock);

    const addFillLayerCall = mapMock.addLayer.mock.calls.find(([call]) =>
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
    const GeoJSONLayerComp = (
      <GeoJSONLayer fillPaint={fillPaint} data={data} fillOnClick={jest.fn()} />
    );
    const mapMock = getMapMock();
    mountWithMap(GeoJSONLayerComp, mapMock);

    expect(mapMock.on.mock.calls[0][0]).toEqual('click');
    expect(mapMock.on.mock.calls[0][1]).toEqual('geojson-3-fill');
  });
});
