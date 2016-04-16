import React, { Component } from "react";
import ReactMapboxGl, { Marker } from "../src/index.js";
import { List } from "immutable";

const accessToken = "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A";
const style = "mapbox://styles/mapbox/streets-v8";

const containerStyle = {
  height: "100vh",
  width: "100%"
};

const markerCoord = new List([
  -0.2416815,
  51.5285582
]);

export default class MapExample extends Component {

  state = {};

  render() {
    return (
      <div>
        <ReactMapboxGl
          style={style}
          accessToken={accessToken}
          containerStyle={containerStyle}>
          <Marker
            coordinates={markerCoord}
            iconImage="harbor-15"
          />
        </ReactMapboxGl>
      </div>
    );
  }
}