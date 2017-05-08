import React, { Component } from "react";
import ReactMapboxGl, { ZoomControl } from "react-mapbox-gl";
import { default as osm2VectortilesStyle } from "./osm2vectortiles-style.js";
import Attribution from "./components/Attribution.js"

const containerStyle = {
  height: "100vh",
  width: "100%"
};

const linkStyle = {
  color: "#000",
  textDecoration: "none"
}

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
        containerStyle={containerStyle}
        attributionControl={false}>
        <ZoomControl/>
        <Attribution width={450} height={30}>
          <a href="https://www.mapbox.com/about/maps/" target="_blank" style={linkStyle}>© Mapbox</a> &nbsp;
          <a href="http://www.openstreetmap.org/about/" target="_blank" style={linkStyle}>© OpenStreetMap</a> &nbsp;
          <a href="http://tileserver.com" target="_blank" style={linkStyle}>© TileServer</a>
        </Attribution>
      </ReactMapboxGl>
    );
  }
}
