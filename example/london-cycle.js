import React, { Component } from "react";
import ReactMapboxGl, { Marker, Path, Polygon } from "../src/index.js";
import { parseString } from "xml2js";
import { fromJS, List } from "immutable";

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
  }
}

export default class LondonCycle extends Component {

  state = {
    center: new List([-0.109970527, 51.52916347]),
    zoom: 11,
    skip: 0
  };

  componentWillMount() {
    getCycleStations().then(stations => {
      this.setState({
        stations: fromJS(stations.map(station => ({
          id: parseInt(station.id[0]),
          name: station.name[0],
          position: [parseFloat(station.long[0]), parseFloat(station.lat[0])],
          bikes: parseInt(station.nbBikes[0]),
          slots: parseInt(station.nbDocks[0]),
        })))
      })
    });
  }

  _markerClick = (station, marker) => {
    this.setState({
      center: new List(marker.geometry.coordinates),
      zoom: 14,
      station
    });
  };

  _onDrag = () => {
    if(this.state.station)
      this.setState({
        station: null
      });
  };

  _clickButton(direction) {
    const { skip } = this.state;

    const nextSkip = (direction < 0 && skip > 20) ? (skip - offset) : (skip + offset);

    this.setState({
      skip: nextSkip
    });
  }

  render() {
    const { stations, station, skip } = this.state;

    return (
      <div>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 20px",
          zIndex: 1,
          textAlign: "right",
          color: "#3453DC"
        }}>
          <span style={styles.button} onClick={this._clickButton.bind(this, -1)}>Prev</span> / <span style={styles.button} onClick={this._clickButton.bind(this, 1)}>Next</span>
        </div>
        <ReactMapboxGl
          style={style}
          center={this.state.center}
          zoom={this.state.zoom}
          accessToken={accessToken}
          onMove={this._onMove}
          onDrag={this._onDrag}
          containerStyle={containerStyle}>
          {
            stations && stations.skip(skip).take(offset).map((station, index) => {
              return (
                <Marker
                  key={index}
                  onClick={this._markerClick.bind(this, station)}
                  coordinates={station.get("position")}
                  sourceName={`marker-${index}`}
                  iconImage={`marker-15`}/>
              )
            })
          }
        </ReactMapboxGl>
        {
          station && (
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "16px 0px",
              textAlign: "center",
              backgroundColor: "white"
            }}>
              <p>{ station.get("name") }</p>
              <p>{ station.get("bikes") } bikes / { station.get("slots") } slots</p>
            </div>
          )
        }
      </div>
    )
  }
}