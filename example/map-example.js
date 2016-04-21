import React, { Component } from "react";
import ReactMapboxGl, { Marker, Path, Polygon } from "../src/index.js";
import route from "./route.json";

import { List, fromJS } from "immutable";

const accessToken = "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A";
const style = "mapbox://styles/mapbox/streets-v8";

const containerStyle = {
  height: "100vh",
  width: "100%"
};

const polygonCoords = fromJS([
[-0.13235092163085938,51.518250335096376],
[-0.1174163818359375,51.52433860667918],
[-0.10591506958007812,51.51974577545329],
[-0.10831832885742188,51.51429786349477],
[-0.12531280517578122,51.51429786349477],
[-0.13200759887695312,51.517823057404094]
]);

const markerCoord = new List([
  -0.2416815,
  51.5285582
]);

const mappedRoute = new List(route.points.map(point => ([point.lat, point.lng])))

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
    }, 3000);
  }

  _onClickMarker(marker) {
    this.setState({
      center: new List(marker.geometry.coordinates)
    });
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

  _polygonClicked() {
    console.log("Polygon clicked");
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
          coordinates={mappedRoute}
          lineJoin="round"
          lineCap="round"
          lineColor="#4790E5"
          lineWidth={12}/>
        <Polygon
          coordinates={polygonCoords}
          sourceName="polygon"
          fillColor="#6F788A"
          fillOpacity={0.7}
          onClick={this._polygonClicked}
        />
      </ReactMapboxGl>
    );
  }
}