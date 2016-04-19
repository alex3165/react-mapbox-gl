import React, { Component } from "react";
import ReactMapboxGl, { Marker, Path } from "../src/index.js";
import { List, fromJS } from "immutable";

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

const route = fromJS([
  [-0.102335, 51.519512],
  [-0.101037, 51.519939],
  [-0.101037, 50.519939]
]);

export default class MapExample extends Component {

  state = {
    popup: null,
    center: new List([0.2174037, 51.6476704])
  };

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        center: new List([-0.120736, 51.5118219])
      });
    }, 2000);
  }

  _onClickMarker(marker) {
    console.log("Clicked on the marker : ", marker.geometry.coordinates)
  }

  _onClickMap(map) {
    console.log("Clicked on the map : ", map);
  }

  _onStyleLoad(map) {
    console.log("Style loaded: ", map);
  }

  _onHover(marker, map) {
    map.getCanvas().style.cursor = "pointer";
  }

  _onOutHover(map) {
    map.getCanvas().style.cursor = "";
  }

  _onMouseMove(map) {
    // console.log("On mouse move", map);
  }

  _onMove(center, evt) {
    // console.log("On mouse move", center);
  }

  render() {
    return (
      <ReactMapboxGl
        style={style}
        onClick={this._onClickMap}
        onStyleLoad={this._onStyleLoad}
        onMouseMove={this._onMouseMove}
        onMove={this._onMove}
        accessToken={accessToken}
        center={this.state.center}
        containerStyle={containerStyle}>
        <Marker
          coordinates={markerCoord}
          sourceName="marker"
          onClick={this._onClickMarker.bind(this)}
          onHover={this._onHover}
          onOutHover={this._onOutHover}
          iconImage="harbor-15"/>
        <Path
          sourceName="route"
          coordinates={route}
          lineJoin="round"
          lineCap="round"
          lineColor="#4790E5"
          lineWidth={12}/>
      </ReactMapboxGl>
    );
  }
}