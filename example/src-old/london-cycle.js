import React, { Component } from "react";
import ReactMapboxGl, { Layer, Feature, Popup, ZoomControl } from "react-mapbox-gl";
import styles from './london-cycle.style';
import { parseString } from "xml2js";
import { Map } from "immutable";
import config from "./config.json";

const { accessToken, style } = config;

function getCycleStations() {
  return fetch("https://tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml")
    .then(res => res.text())
    .then(data => {
      return new Promise((resolve, reject) => {
        parseString(data, (err, res) => {
          if (!err) {
            resolve(res.stations.station);
          } else {
            reject(err);
          }
        });
      });
    })
}

const maxBounds = [
  [-0.481747846041145, 51.3233379650232], // South West
  [0.23441119994140536, 51.654967740310525], // North East
];

const Mapbox = ReactMapboxGl({
  minZoom: 8,
  maxZoom: 15,
  maxBounds,
  accessToken
});

export default class LondonCycle extends Component {

  state = {
    center: [-0.109970527, 51.52916347],
    zoom: [11],
    skip: 0,
    stations: new Map(),
    popupShowLabel: true
  };

  componentWillMount() {
    getCycleStations().then(res => {
      this.setState(({ stations }) => ({
        stations: stations.merge(res.reduce((acc, station) => {
          return acc.set(station.id[0], new Map({
            id: station.id[0],
            name: station.name[0],
            position: [ parseFloat(station.long[0]), parseFloat(station.lat[0]) ],
            bikes: parseInt(station.nbBikes[0], 10),
            slots: parseInt(station.nbDocks[0], 10)
          }))
        }, new Map()))
      }));
    });
  };

  _markerClick = (station, { feature }) => {
    this.setState({
      center: feature.geometry.coordinates,
      zoom: [14],
      station,
    });
  }

  _onDrag = () => {
    if (this.state.station) {
      this.setState({
        station: null,
      });
    }
  }

  _onToggleHover(cursor, { map }) {
    map.getCanvas().style.cursor = cursor;
  }

  _onControlClick = (map, zoomDiff) => {
    const zoom = map.getZoom() + zoomDiff;
    this.setState({ zoom: [zoom] });
  };

  _popupChange(popupShowLabel) {
    this.setState({ popupShowLabel });
  }

  toggle = true;

  _onFitBoundsClick = () => {
    if (this.toggle) {
      this.setState({
        fitBounds: [[-0.122555629777, 51.4734862092], [-0.114842, 51.50621]]
      });
    } else {
      this.setState({
        // this won't focus on the area as there is a maxBounds
        fitBounds: [[32.958984, -5.353521], [43.50585, 5.615985]]
      });
    }

    this.toggle = !this.toggle;
  };

  render() {
    const { stations, station, popupShowLabel, fitBounds } = this.state;

    return (
      <div>
        <Mapbox
          style={style}
          fitBounds={fitBounds}
          center={this.state.center}
          zoom={this.state.zoom}
          onDrag={this._onDrag}
          containerStyle={styles.container}>

          <ZoomControl
            zoomDiff={1}
            onControlClick={this._onControlClick}/>

          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
            {
              stations
                .map((st, index) => (
                  <Feature
                    key={st.get("id")}
                    onMouseEnter={this._onToggleHover.bind(this, "pointer")}
                    onMouseLeave={this._onToggleHover.bind(this, "")}
                    onClick={this._markerClick.bind(this, st)}
                    coordinates={st.get("position")}/>
                )).toArray()
            }
          </Layer>

          {
            station && (
              <Popup
                key={station.get("id")}
                offset={[0, -50]}
                coordinates={station.get("position")}>
                <div>
                  <span style={{
                    ...styles.popup,
                    display: popupShowLabel ? "block" : "none"
                  }}>
                    {station.get("name")}
                  </span>
                  <div onClick={this._popupChange.bind(this, !popupShowLabel)}>
                    {
                      popupShowLabel ? "Hide" : "Show"
                    }
                  </div>
                </div>
              </Popup>
            )
          }
        </Mapbox>
        {
          station && (
            <div style={styles.stationDescription}>
              <p>{ station.get("name") }</p>
              <p>{ station.get("bikes") } bikes / { station.get("slots") } slots</p>
            </div>
          )
        }
        <div style={{
        ...styles.btnWrapper,
        ...(station && styles.btnStationOpen)
      }}>
          <button style={styles.btn} onClick={this._onFitBoundsClick}>Fit to bounds</button>
        </div>
      </div>
    )
  }
}
