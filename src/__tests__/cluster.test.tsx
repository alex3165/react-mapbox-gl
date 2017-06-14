import * as React from 'react';
import Cluster from '../cluster';
import { withContext } from 'recompose';
import { shallow } from 'enzyme';

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
    )(Layer);
  });

  it('should render the correct number of cluster', () => {
    // const clusterMarkerFactory = jest.fn(() => {

    // });

    shallow(
      <Cluster
        children={}
        ClusterMarkerFactory={}
      />
    )
  });
});
