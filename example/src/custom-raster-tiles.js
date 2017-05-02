import React, { Component } from "react";
import ReactMapboxGl, { ZoomControl } from "react-mapbox-gl";
import rasterStyle from "./stamen-style.json";
import Attribution from "./components/Attribution.js"

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
        containerStyle={containerStyle}
        attributionControl={true}>
        <ZoomControl/>
        <Attribution width={450} height={30}>
          <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a>
          <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>
          <a href="http://stamen.com" target="_blank">© Stamen</a>
        </Attribution>
      </ReactMapboxGl>
    );
  }
}
