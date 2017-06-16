import * as React from 'react';
import GeoJSONLayer from '../geojson-layer';
import { withContext } from 'recompose';
import { mount } from 'enzyme';

describe('GeoJSONLayer', () => {
  let GeoJSONLayerWithContext: any;
  let addLayerMock = jest.fn();

  const fillPaint = { 'fill-color': '#001122' };
  const data = { type: 'FeatureCollection', features: [] };

  beforeEach(() => {
    addLayerMock = jest.fn();

    GeoJSONLayerWithContext = withContext(
      {
        map: React.PropTypes.object
      },
      () => ({
        map: {
          addSource: jest.fn(),
          addLayer: addLayerMock,
          on: jest.fn()
        }
      })
    )(GeoJSONLayer);
  });

  it('Should call addLayer with provided layerOptions', () => {
    mount(
      (
        <GeoJSONLayerWithContext
          fillPaint={fillPaint}
          data={data}
          layerOptions={{ minzoom: 13 }}
        />
      ) as React.ReactElement<any>
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
    mount(
      (
        <GeoJSONLayerWithContext fillPaint={fillPaint} data={data} />
      ) as React.ReactElement<any>
    );

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
});
