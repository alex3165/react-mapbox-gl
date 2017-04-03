import * as React from 'react';
import Source from '../source';
import { withContext } from 'recompose';
import { mount } from 'enzyme';

const EMPTY_GEOJSON = {
  'type': 'FeatureCollection',
  'features': []
};

const EMPTY_GEOJSON_SRC = {
  type: 'geojson',
  data: EMPTY_GEOJSON
};

describe('Source', () => {
  let SourceWithContext: any;
  let addSourceMock: any;
  let removeSourceMock: any;
  let setDataMock: any;
  let children: any[];
  let childrenWithOneFeature: any[];
  let feature: object;

  beforeEach(() => {
    addSourceMock = jest.fn();
    removeSourceMock = jest.fn();
    setDataMock = jest.fn();
    feature = { coordinates: [-123, 45] };
    children = [{ props: {} }];
    childrenWithOneFeature = [{ props: feature }];

    SourceWithContext = withContext({
      map: React.PropTypes.object
    }, () => ({
      map: {
        addSource: addSourceMock,
        removeSource: removeSourceMock,
        on: jest.fn(),
        off: jest.fn(),
        getSource: jest.fn(() => this.id)
      }
    }))(Source);
  });

  it('Should render source with default options', () => {
    mount(
      <SourceWithContext
        id="source-1"
        geoJsonSource={EMPTY_GEOJSON_SRC}
      /> as React.ReactElement<any>
    );
    console.log('addSourceMock.mock.calls', addSourceMock.mock.calls);
    expect(addSourceMock.mock.calls[0]).toEqual(['source-1', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }]);
  });

  it('Should render source with default source', () => {
    mount(
      <SourceWithContext
        children={children}
      /> as React.ReactElement<any>
    );

    expect(addSourceMock.mock.calls[0]).toEqual(['source-2', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }]);
  });

  it('Should set features based on children', () => {
    const source = mount(
      <SourceWithContext
        children={childrenWithOneFeature}
      /> as React.ReactElement<any>
    );

    expect(setDataMock.mock.calls[0]).toEqual([{
      'type': 'FeatureCollection',
      'features': [{
        'geometry': { ...feature, 'type': 'Point' },
        'properties': { id: 0 },
        'type': 'Feature'
      }]
    }]);
  });

  it('Should set features to empty array when children disappear', () => {
    const source = mount(
      <SourceWithContext
        children={childrenWithOneFeature}
      /> as React.ReactElement<any>
    );

    source.setProps({ children: undefined });

    expect(setDataMock.mock.calls[1]).toEqual([{
      'type': 'FeatureCollection',
      'features': []
    }]);
  });
});
