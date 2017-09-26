import * as React from 'react';
import Source from '../source';
import { withContext } from 'recompose';
import { mount } from 'enzyme';
const PropTypes = require('prop-types'); // tslint:disable-line

describe('Source', () => {
  let SourceWithContext: any;
  let addSourceMock: any;
  let removeSourceMock: any;
  let setDataMock: any;
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
    setDataMock = jest.fn();

    SourceWithContext = withContext(
      {
        map: PropTypes.object
      },
      () => ({
        map: {
          addSource: addSourceMock,
          removeSource: removeSourceMock,
          on: jest.fn(),
          off: jest.fn(),
          getSource: jest.fn(() => this.id)
        }
      })
    )(Source);
  });

  it('Should render source with geoJsonSource', () => {
    mount(
      <SourceWithContext id="source-1" geoJsonSource={EMPTY_GEOJSON_SRC} />
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
