import React, { Component } from "react";
import ReactMapboxGl, { GeoJSONLayer, ScaleControl, ZoomControl } from "react-mapbox-gl";
import geojson from "./geojson.json";
import config from "./config.json";

const { accessToken } = config;

const containerStyle = {
  height: "100vh",
  width: "100%"
};

export default class GeoJSONExample extends Component {
  state = {
    popup: null,
    center: [ -77.01239, 38.91275 ]
  };

  render() {
    return (
      <ReactMapboxGl
        style="mapbox://styles/mapbox/light-v8"
        accessToken={accessToken}
        center={this.state.center}
        movingMethod="jumpTo"
        containerStyle={{ height: "100vh", width: "100%" }}>

        <ScaleControl/>
        <ZoomControl/>
        <GeoJSONLayer
          data={geojson}
          symbolLayout={{
            "text-field": "{place}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
          }}/>

      </ReactMapboxGl>
    );
  }
}
