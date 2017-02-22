import * as React from 'react';
import Layer from '../layer';
import { withContext } from 'recompose';
import { mount } from 'enzyme';

describe('Layer', () => {
  let LayerWithContext: any;
  let addLayerMock = jest.fn();
  let addSourceMock = jest.fn();
  let children: any[];

  beforeEach(() => {
    addLayerMock = jest.fn();
    addSourceMock = jest.fn();
    children = [{ props: {}}];

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
    mount(
      <LayerWithContext
        children={children}
      /> as React.ReactElement<any>
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
    mount(
      <LayerWithContext
        children={children}
      /> as React.ReactElement<any>
    );

    expect(addSourceMock.mock.calls[0]).toEqual(['layer-2', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }]);
  });

});
