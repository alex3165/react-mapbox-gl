import * as React from 'react';
import ReactMapboxGl, { Marker, Cluster } from '../../../';

// tslint:disable-next-line:no-var-requires
const { token, styles: { outdoor } } = require('./config.json');
// tslint:disable-next-line:no-var-requires
const falls = require('./falls.json');

const Map = ReactMapboxGl({ accessToken: token });

const mapStyle = {
  height: '400px',
  width: '100%'
};

const styles: { [key: string]: React.CSSProperties } = {
  clusterMarker: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: '#51D5A0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    border: '2px solid #56C498',
    pointerEvents: 'none'
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: '#E0E0E0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #C9C9C9',
    pointerEvents: 'none'
  }
}

class HtmlCluster extends React.Component<{}, {}> {
  private zoom = [4];

  private clusterMarker = (coordinates: number[], pointCount: number) => (
    <Marker
      key={coordinates.toString()}
      coordinates={coordinates}
      style={styles.clusterMarker}
    >
      <div>{pointCount}</div>
    </Marker>
  );

  public render() {
    return (
      <Map
        style={outdoor}
        zoom={this.zoom}
        containerStyle={mapStyle}
      >
        <Cluster ClusterMarkerFactory={this.clusterMarker} clusterThreshold={8}>
          {
            falls.features.map((feature: any, key: number) =>
              <Marker
                key={key}
                style={styles.marker}
                coordinates={feature.geometry.coordinates}
              >
                <div/>
              </Marker>
            )
          }
        </Cluster>
      </Map>
    )
  }
}

export default HtmlCluster;
