import React, { Component } from "react";
import ReactMapboxGl, { Marker, Path, Polygon } from "../src/index.js";
import { parseString } from "xml2js";
import { fromJS } from "immutable";

function getCycleStations() {
  return fetch("https://tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml")
    .then(res => res.text())
    .then(data => {
      return new Promise((resolve, reject) => {
        parseString(data, (err, res) => {
          if(!err) {
            resolve(res.stations.station);
          } else {
            reject(err);
          }
        });
      });
    })
}

const accessToken = "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A";
const style = "mapbox://styles/mapbox/streets-v8";

const containerStyle = {
  height: "100vh",
  width: "100%"
};

export default class LondonCycle extends Component {

  state = {}

  componentWillMount() {
    getCycleStations().then(stations => {
      this.setState({
        stations: fromJS(stations.map(station => ({
          id: parseInt(station.id[0]),
          position: [parseFloat(station.long[0]), parseFloat(station.lat[0])],
          bikes: parseInt(station.nbBikes[0]),
          slots: parseInt(station.nbDocks[0]),
        })))
      })
    });
  }

  _markerClick(station) {
    console.log(station.toJS());
  }

  render() {
    const { stations } = this.state;

    return (
      <ReactMapboxGl
        style={style}
        accessToken={accessToken}
        containerStyle={containerStyle}>
        {
          stations && stations.take(20).map((station, index) => {
            return (
              <Marker
                key={index}
                onClick={this._markerClick.bind(this, station)}
                coordinates={station.get("position")}
                sourceName={`marker-${index}`}
                iconImage={`marker-${index}`}/>
            )
          })
        }
      </ReactMapboxGl>
    )
  }
}