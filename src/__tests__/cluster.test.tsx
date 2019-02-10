jest.mock('mapbox-gl', () => ({
  Map: {}
}));

jest.mock('../util/overlays', () => ({
  overlayState: jest.fn(() => ({})),
  overlayTransform: jest.fn(() => []),
  anchors: []
}));

import * as React from 'react';
import Cluster from '../cluster';
import Marker from '../marker';
import { mountWithMap, getMapMock } from '../jest/util';

const coordinates = [
  [-12.408741828510017, 58.16339752811908],
  [-5.668629523822517, 50.06970856327533],
  [-9.26996282865152, 42.92873605781255],
  [-8.969410773822517, 37.03827545780658],
  [11.024180534771233, 37.07398102421283],
  [-9.273915168353767, 32.58161041874408]
];

const mockProjections = {
  0: {
    toArray() {
      return [-63.41135717118712, 69.80779389260127];
    }
  },
  1: {
    toArray() {
      return [120.23846281116113, 69.80779389260127];
    }
  },
  2: {
    toArray() {
      return [120.23846281116113, -41.10548333921079];
    }
  },
  3: {
    toArray() {
      return [-63.41135717118712, -41.10548333921079];
    }
  },
  4: {
    toArray() {
      return [-63.41135717118712, 69.80779389260127];
    }
  }
};

describe('cluster', () => {
  it('should render the correct number of cluster', () => {
    const clusterMarkerFactory = jest.fn();
    let unprojectCalls = 0;

    mountWithMap(
      <Cluster
        children={coordinates.map((coord, index) => (
          <Marker coordinates={coord} key={index} />
        ))}
        ClusterMarkerFactory={clusterMarkerFactory}
      />,
      getMapMock({
        getZoom: jest.fn(() => 2),
        getCanvas: jest.fn(() => ({ width: 1020, height: 800 })),
        unproject: jest.fn(() => mockProjections[unprojectCalls++])
      })
    );

    const call = clusterMarkerFactory.mock.calls[0];
    // coordinates
    expect(call[0]).toEqual([-9.11968680123703, 40.047086577057655]);
    // pointCount
    expect(call[1]).toEqual(2);
    // getLeaves
    expect(call[2]().length).toEqual(2);
  });
});
