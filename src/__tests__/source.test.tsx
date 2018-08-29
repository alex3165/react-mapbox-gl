import React from 'react';
import { Source } from '../source';
import { mount } from 'enzyme';
import { GeoJSONSourceRaw } from 'mapbox-gl';

describe('Source', () => {
  // tslint:disable-next-line:no-any
  let map: any;
  let addSourceMock: jest.Mock;
  let removeSourceMock: jest.Mock;
  const EMPTY_GEOJSON = {
    type: 'FeatureCollection',
    features: []
  };

  const EMPTY_GEOJSON_SRC = {
    type: 'geojson',
    data: EMPTY_GEOJSON
  };

  beforeEach(() => {
    addSourceMock = jest.fn();
    removeSourceMock = jest.fn();

    map = {
      addSource: addSourceMock,
      removeSource: removeSourceMock,
      on: jest.fn(),
      off: jest.fn(),
      getSource: jest.fn(function() {
        // Arrow function will override the `this` context
        return this.id;
      })
    };
  });

  it('Should render source with geoJsonSource', () => {
    mount(
      <Source
        map={map}
        id="source-1"
        geoJsonSource={EMPTY_GEOJSON_SRC as GeoJSONSourceRaw}
      />
    );

    expect(addSourceMock.mock.calls[0]).toEqual([
      'source-1',
      {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      }
    ]);
  });
});
