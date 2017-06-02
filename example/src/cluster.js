import React, { Component } from 'react';
import style from './style.json';
import config from './config.json';
import places from './places.json';
import ReactMapboxGl, { Marker, Cluster } from "react-mapbox-gl";

const containerStyle = {
  height: '100vh',
  width: '100%'
};

const styles = {
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

const Map = ReactMapboxGl({
  accessToken: config.accessToken
});

export default class ClusterExample extends Component {

  onMarkerClick(coords) {
    console.log(coords);
  }

  clusterMarker = (coordinates, pointCount) => (
    <Marker coordinates={coordinates} key={coordinates.toString()} style={styles.clusterMarker}>
      { pointCount }
    </Marker>
  );

  render() {
    return (
      <Map
        style={style}
        zoom={[4]}
        containerStyle={containerStyle}>
        <Cluster ClusterMarkerFactory={this.clusterMarker} clusterThreshold={8}>
          {
            places.features.map((feature, key) =>
              <Marker
                key={key}
                style={styles.marker}
                coordinates={feature.geometry.coordinates}
                onClick={this.onMarkerClick.bind(this, feature.geometry.coordinates)}>
                M
              </Marker>
            )
          }
        </Cluster>
      </Map>
    );
  }
}
