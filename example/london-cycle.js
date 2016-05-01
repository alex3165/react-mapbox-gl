import React, { Component } from "react";
import ReactMapboxGl, { Layer, Feature } from "../src/index";
import { parseString } from "xml2js";
import { Map } from "immutable";

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

const offset = 20;

const containerStyle = {
  height: "100vh",
  width: "100%"
};

const styles = {
  button: {
    cursor: "pointer"
  },
  stationDescription: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "16px 0px",
    textAlign: "center",
    backgroundColor: "white"
  }
}

export default class LondonCycle extends Component {

  state = {
    center: [-0.109970527, 51.52916347],
    zoom: 11,
    skip: 0,
    stations: new Map()
  };

  componentWillMount() {
    getCycleStations().then(res => {
      this.setState(({ stations }) => ({
        stations: stations.merge(res.reduce((acc, station) => {
          return acc.set(station.id[0], new Map({
            id: station.id[0],
            name: station.name[0],
            position: [ parseFloat(station.long[0]), parseFloat(station.lat[0]) ],
            bikes: parseInt(station.nbBikes[0]),
            slots: parseInt(station.nbDocks[0])
          }))
        }, new Map()))
      }));
    });
  }

  _markerClick = (station, marker) => {
    this.setState({
      center: marker.geometry.coordinates,
      zoom: 14,
      station
    });
  };

  _onDrag = () => {
    if (this.state.station) {
      this.setState({
        station: null
      });
    }
  };

  render() {
    const { stations, station, skip } = this.state;

    return (
      <div>
        <ReactMapboxGl
          style={style}
          center={this.state.center}
          zoom={this.state.zoom}
          accessToken={accessToken}
          onDrag={this._onDrag}
          containerStyle={containerStyle}>
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
            {
              stations
                .map((station, index) => (
                  <Feature
                    key={station.get("id")}
                    id={station.get("id")}
                    onClick={this._markerClick.bind(this, station)}
                    coordinates={station.get("position")}/>
                )).toArray()
            }
          </Layer>

        </ReactMapboxGl>

        {
          station && (
            <div style={styles.stationDescription}>
              <p>{ station.get("name") }</p>
              <p>{ station.get("bikes") } bikes / { station.get("slots") } slots</p>
            </div>
          )
        }
      </div>
    )
  }
}
