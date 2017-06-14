import * as React from 'react';
import Cluster from '../cluster';
import Marker from '../marker';
import { withContext } from 'recompose';
import { shallow } from 'enzyme';

const coordinates = [
  [-12.408741828510017, 58.16339752811908],
  [-5.668629523822517, 50.06970856327533],
  [-9.26996282865152, 42.92873605781255],
  [-8.969410773822517, 37.03827545780658],
  [11.024180534771233, 37.07398102421283],
  [-9.273915168353767, 32.58161041874408]
]

describe('cluster', () => {
  let ClusterWithContext: any;

  beforeEach(() => {
    ClusterWithContext = withContext(
      {
        map: React.PropTypes.object
      },
      () => ({
        map: {
          on: jest.fn(),
          getZoom: jest.fn(() => 2),
          getBounds: jest.fn(() => ({
            getWest() { return -57.73968597657314 },
            getSouth() { return 30.745904205783035 },
            getEast() { return 59.086911772063615 },
            getNorth() { return 66.18730518998822 }
          }))
        }
      })
    )(Cluster);
  });

  it('should render the correct number of cluster', () => {
    const clusterMarkerFactory = jest.fn();

    shallow(
      <ClusterWithContext
        children={
          coordinates.map(coord => (
            <Marker coordinates={coord}/>
          ))
        }
        ClusterMarkerFactory={clusterMarkerFactory}
      />
    );

  });
});
