import React, { Component } from "react";
import ReactMapboxGl, { ScaleControl, ZoomControl } from "react-mapbox-gl";
import config from "./config.json";
import { default as osm2VectortilesStyle } from "./osm2vectortiles-style.js";

const { accessToken } = config;

const containerStyle = {
  height: "100vh",
  width: "100%"
};


export default class CustomVectorTiles extends Component {
  state = {
    popup: null,
    center: [ -77.01239, 38.91275 ]
  };

  render() {
    return (
      <ReactMapboxGl
        // eslint-disable-next-line
        style={ osm2VectortilesStyle }
        accessToken="" // we do not need token for custom tile providers
        center={this.state.center}
        movingMethod="jumpTo"
        containerStyle={containerStyle}>

        <ScaleControl/>
        <ZoomControl/>
      </ReactMapboxGl>
    );
  }
}
