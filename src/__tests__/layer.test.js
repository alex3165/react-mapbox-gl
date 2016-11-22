import React from 'react';
import Layer from '../layer';
import TestUtils from 'react-addons-test-utils';
import { withContext } from 'recompose';

describe('Layer', () => {
  let LayerWithContext;
  let addLayerMock;
  let addSourceMock;

  beforeEach(() => {
    addLayerMock = jest.fn();
    addSourceMock = jest.fn();

    LayerWithContext = withContext({
      map: React.PropTypes.object
    }, () => ({
      map: {
        addSource: addSourceMock,
        addLayer: addLayerMock,
        on: jest.fn(),
        getSource: jest.fn().mockReturnValue({ setData: jest.fn() })
      }
    }))(Layer);
  });

  it('Should render layer with default options', () => {
    const LayerComponent = TestUtils.renderIntoDocument(
      <LayerWithContext
        children={[{ props: {}}]}/>
    );

    expect(addLayerMock.mock.calls[0]).toEqual([{
      id: 'layer-1',
      source: 'layer-1',
      type: 'symbol',
      layout: {},
      paint: {}
    }, undefined]);
  });

  it('Should render layer with default source', () => {
    const LayerComponent = TestUtils.renderIntoDocument(
      <LayerWithContext
        children={[{ props: {}}]}/>
    );

    expect(addSourceMock.mock.calls[0]).toEqual(['layer-2', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      }
    }]);
  });

});
