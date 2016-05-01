import React, { Component } from "react";
import ReactMapboxGl, { Layer, Feature } from "../src/index";
import route from "./route.json";

const accessToken = "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A";
const style = "mapbox://styles/mapbox/streets-v8";

const containerStyle = {
  height: "100vh",
  width: "100%"
};

const polygonCoords = [
  [-0.13235092163085938,51.518250335096376],
  [-0.1174163818359375,51.52433860667918],
  [-0.10591506958007812,51.51974577545329],
  [-0.10831832885742188,51.51429786349477],
  [-0.12531280517578122,51.51429786349477],
  [-0.13200759887695312,51.517823057404094]
];

const markerCoord = [
  -0.2416815,
  51.5285582
];

const mappedRoute = route.points.map(point => [ point.lat, point.lng ]);

export default class AllShapes extends Component {

  state = {
    popup: null,
    center: [0.2174037, 51.6476704]
  };

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        center: [-0.120736, 51.5118219]
      });
    }, 3000);
  }

  _onClickMarker = (marker) => {
    this.setState({
      center: marker.geometry.coordinates
    });
  };

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

  _polygonClicked = () => {
    console.log("Polygon clicked");
  };

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

        <Layer
          type="symbol"
          layout={{ "icon-image": "harbor-15" }}>
          <Feature
            coordinates={markerCoord}
            onClick={this._onClickMarker}/>
        </Layer>

        <Layer
          type="line"
          paint={{ "line-color": "#4790E5", "line-width": 12 }}>
          <Feature coordinates={mappedRoute}/>
        </Layer>

        <Layer
          type="fill"
          paint={{ "fill-color": "#6F788A", "fill-opacity": .7 }}>
          <Feature
            onClick={this._polygonClicked}
            coordinates={polygonCoords}/>
        </Layer>

      </ReactMapboxGl>
    );
  }
}
