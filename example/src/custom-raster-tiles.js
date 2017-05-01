import React, { Component } from "react";
import ReactMapboxGl, { ScaleControl, ZoomControl } from "react-mapbox-gl";
import config from "./config.json";
import rasterStyle from "./stamen-style.json";

const { accessToken } = config;

const containerStyle = {
  height: "100vh",
  width: "100%"
};


export default class CustomRasterTiles extends Component {
  state = {
    popup: null,
    center: [ -77.01239, 38.91275 ]
  };

  render() {
    return (
      <ReactMapboxGl
        // eslint-disable-next-line
        style={ rasterStyle }
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
