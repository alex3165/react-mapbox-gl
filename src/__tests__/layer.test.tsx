import * as React from 'react';
import Layer from '../layer';
import { withContext } from 'recompose';
import { mount } from 'enzyme';
const PropTypes = require('prop-types'); // tslint:disable-line

describe('Layer', () => {
  let LayerWithContext: any;
  let addLayerMock = jest.fn();
  let setLayerZoomRangeMock = jest.fn();
  let addSourceMock = jest.fn();
  let addImageMock = jest.fn();
  let setDataMock = jest.fn();
  let children: any[];
  let childrenWithOneFeature: any[];
  let feature: any;
  let getSourceMock: any;

  beforeEach(() => {
    addLayerMock = jest.fn();
    setLayerZoomRangeMock = jest.fn();
    addSourceMock = jest.fn();
    setDataMock = jest.fn();
    addImageMock = jest.fn();
    feature = { coordinates: [-123, 45] };
    children = [{ props: {} }];
    childrenWithOneFeature = [{ props: feature }];
    getSourceMock = jest.fn().mockReturnValue({ setData: setDataMock });

    LayerWithContext = withContext(
      {
        map: PropTypes.object
      },
      () => ({
        map: {
          addSource: addSourceMock,
          addLayer: addLayerMock,
          setLayerZoomRange: setLayerZoomRangeMock,
          getLayer: jest.fn(() => undefined),
          addImage: addImageMock,
          on: jest.fn(),
          getSource: getSourceMock
        }
      })
    )(Layer);
  });

  it('Should render layer with default options', () => {
    mount(<LayerWithContext children={children} />);

    expect(addLayerMock.mock.calls[0]).toEqual([
      {
        id: undefined,
        source: undefined,
        type: 'symbol',
        layout: {},
        paint: {}
      },
      undefined
    ]);
  });

  it('Should set all parameters of add layer', () => {
    const before = 'test1';
    const props = {
      id: '123',
      type: 'symbol',
      paint: {},
      layout: {},
      metadata: {},
      filter: []
    };

    const mappedProps = {
      minZoom: 2,
      maxZoom: 10,
      sourceLayer: 'sourceTest',
      sourceId: 'test'
    };

    mount(
      <LayerWithContext
        children={children}
        {...props}
        {...mappedProps}
        before={before}
      />
    );
    expect(addLayerMock.mock.calls[0]).toEqual([
      {
        ...props,
        minzoom: 2,
        maxzoom: 10,
        source: 'test',
        'source-layer': 'sourceTest'
      },
      before
    ]);
  });

  it('Should render layer with default source', () => {
    getSourceMock = jest.fn(() => undefined);
    mount(<LayerWithContext children={children} />);

    expect(addSourceMock.mock.calls[0]).toEqual([
      undefined,
      {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      }
    ]);
  });

  it('Should set all parameters of add source with geojsonSourceOptions', () => {
    getSourceMock = jest.fn(() => undefined);

    const geoJSONSourceOptions = {
      maxzoom: 10,
      buffer: 2,
      tolerance: 1,
      cluster: 10,
      clusterRadius: 50,
      clusterMaxZoom: 10
    };
    const layerSourceId = 'testId';
    mount(
      <LayerWithContext
        children={children}
        id={layerSourceId}
        geoJSONSourceOptions={geoJSONSourceOptions}
      />
    );

    expect(addSourceMock.mock.calls[0]).toEqual([
      layerSourceId,
      {
        type: 'geojson',
        ...geoJSONSourceOptions,
        data: {
          type: 'FeatureCollection',
          features: []
        }
      }
    ]);
  });

  it('Should set features based on children', () => {
    const layer = mount(<LayerWithContext children={childrenWithOneFeature} />);

    expect(setDataMock.mock.calls[0]).toEqual([
      {
        type: 'FeatureCollection',
        features: [
          {
            geometry: { ...feature, type: 'Point' },
            properties: { id: 0 },
            type: 'Feature'
          }
        ]
      }
    ]);
  });

  it('Should set features to empty array when children disappear', () => {
    const layer = mount(<LayerWithContext children={childrenWithOneFeature} />);

    layer.setProps({ children: undefined });

    expect(setDataMock.mock.calls[1]).toEqual([
      {
        type: 'FeatureCollection',
        features: []
      }
    ]);
  });

  it('Should flatten features', () => {
    const childrens = [<div>Test</div>, [<div>Test</div>, <div>Test</div>]];

    const layer = mount(<LayerWithContext children={childrens} />);

    expect(setDataMock.mock.calls[0][0].features).toHaveLength(3);
  });

  it('Should add images', () => {
    const images = ['test', new Image(), {}];

    mount(<LayerWithContext children={children} images={images} />);

    expect(addImageMock.mock.calls[0]).toEqual(images);
  });

  it('Should update minZoom and maxZoom if they change', () => {
    const wrapper = mount(<LayerWithContext id="zoomer" children={children} />);

    wrapper.setProps({ minZoom: 4 });
    wrapper.setProps({ maxZoom: 10 });
    wrapper.setProps({ minZoom: undefined, maxZoom: undefined });
    wrapper.setProps({ maxZoom: 6 });

    expect(setLayerZoomRangeMock.mock.calls).toEqual([
      ['zoomer', 4, undefined],
      ['zoomer', 4, 10],
      ['zoomer', undefined, undefined],
      ['zoomer', undefined, 6]
    ]);
  });
});
