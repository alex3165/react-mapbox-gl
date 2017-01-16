import React, { Component } from 'react';
import style from './style.json';
import config from './config.json';
import places from './places.json';
import ReactMapboxGl, { Marker, Cluster } from "react-mapbox-gl";

const containerStyle = {
  height: '100vh',
  width: '100%'
};

export default class ClusterExample extends Component {

  onMarkerClick(coords) {
    console.log(coords);
  }

  clusterMarker = (coordinates) => {
    return (
      <Marker coordinates={coordinates}>
      C
      </Marker>
    )
  }

  render() {
    return (
      <ReactMapboxGl
        style={style}
        accessToken={config.accessToken}
        containerStyle={containerStyle}>
        <Cluster ClusterMarkerFactory={this.clusterMarker}>
          {
            places.features.map((feature, key) =>
              <Marker
                key={key}
                coordinates={feature.geometry.coordinates}
                onClick={this.onMarkerClick.bind(this, feature.geometry.coordinates)}>
                Hello
              </Marker>
            )
          }
        </Cluster>
      </ReactMapboxGl>
    );
  }
}
