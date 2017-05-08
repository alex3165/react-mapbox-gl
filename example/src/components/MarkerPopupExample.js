import React, { Component } from "react";
import ReactMapboxGl, { ZoomControl, Marker, Popup } from "react-mapbox-gl";

import config from "../config.json";
const { accessToken } = config;
import style from "../style.json";

import Pin from "./Pin.js";

const containerStyle = {
  height: "100vh",
  width: "100%"
};

const ActivePopup = (marker) => {
  return (
    <Popup coordinates={marker.coordinates} anchor="top">
      <h3>{marker.text}</h3>
    </Popup>
  )
}

export default class MarkerPopupExample extends Component {
  constructor(props) {
    super();
    this.state = {
      activeMarker: null,
      center: [ -77.01239, 38.91275 ],
      markers: [
        {
          key: 1,
          coordinates: [ -77.01239, 38.91275 ],
          text: "marker 1",
          color: "#43D0B0"
        },
        {
          key: 2,
          coordinates: [ -77.04, 38.94 ],
          text: "marker 2",
          color: "#A90C15"
        }
      ]
    };

    this.markerClick = this.markerClick.bind(this);
  }

  markerClick(marker) {
    if (this.state.activeMarker && this.state.activeMarker.key === marker.key) {
      marker = null;
    }

    this.setState(() => {
      return {
        activeMarker: marker
      }
    });
  }

  render() {
    return (
      <ReactMapboxGl
        style={style}
        accessToken={accessToken}
        center={this.state.center}
        movingMethod="jumpTo"
        containerStyle={containerStyle}
        attributionControl={true}
        >
        <ZoomControl/>
        { this.state.markers.map((marker) => {
            return (
              <Marker coordinates={marker.coordinates} key={marker.key} onClick={ this.markerClick.bind(null, marker) } anchor="bottom">
                <Pin fill={marker.color}/>
              </Marker>
            )
          })
        }
        {this.state.activeMarker ? ActivePopup(this.state.activeMarker) : null}
      </ReactMapboxGl>
    );
  }
}
