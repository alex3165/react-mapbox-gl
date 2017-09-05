import * as React from 'react';
import ReactMapboxGl, { Layer, Feature, Popup } from '../../../';
import { parseString } from 'xml2js';
import styled from 'styled-components';
import { londonCycleMaxBounds as maxBounds } from './data';

// tslint:disable-next-line:no-var-requires
const { token, styles } = require('./config.json');

const getCycleStations = (): Promise<any[]> => (
  fetch('https://tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml')
    .then(res => res.text())
    .then(data => (
      new Promise<any[]>((resolve, reject) => {
        parseString(data, (err, res) => {
          if (!err) {
            return resolve(res.stations.station);
          }

          reject(err);
        });
      })
    ))
);

const Mapbox = ReactMapboxGl({
  minZoom: 8,
  maxZoom: 15,
  accessToken: token
});

const mapStyle = {
  height: '400px',
  width: '100%'
};

const layoutLayer = { 'icon-image': 'Cycle_Hire_Logo_small' };

const StyledPopup = styled.div`
  background: white;
  color: #3F618C;
  font-weight: 400;
  padding: 5px;
  border-radius: 2px;
`;

export interface Station {
  id: string;
  name: string;
  position: number[];
  bikes: number;
  slots: number;
}

export interface State {
  fitBounds?: number[][];
  center: number[];
  zoom: number[];
  station?: Station;
  stations: { [id: string]: Station };
}

export default class LondonCycle extends React.Component<{}, State> {
  public state: State = {
    fitBounds: undefined,
    center: [-0.109970527, 51.52916347],
    zoom: [11],
    station: undefined,
    stations: {}
  }

  public componentWillMount() {
    getCycleStations().then(res => {
      this.setState(({ stations }) => ({
        stations: {
          ...stations,
          ...res.reduce((acc, station) => (
            acc[station.id[0]] = {
              id: station.id[0],
              name: station.name[0],
              position: [ parseFloat(station.long[0]), parseFloat(station.lat[0]) ],
              bikes: parseInt(station.nbBikes[0], 10),
              slots: parseInt(station.nbDocks[0], 10)
            }
          , acc), {})
        }
      }));
    });
  };

  private onDrag = () => {
    if (this.state.station) {
      this.setState({ station: undefined });
    }
  };

  private onToggleHover(cursor: string, { map }: { map: any}) {
    map.getCanvas().style.cursor = cursor;
  }

  private markerClick = (station: Station, { feature }: { feature: any }) => {
    this.setState({
      center: feature.geometry.coordinates,
      zoom: [14],
      station
    });
  }

  public render() {
    const { fitBounds, center, zoom, stations, station } = this.state;

    return (
      <div>
        <Mapbox
          style={styles.londonCycle}
          fitBounds={fitBounds}
          maxBounds={maxBounds}
          center={center}
          zoom={zoom}
          onDrag={this.onDrag}
          containerStyle={mapStyle}
          flyToOptions={{
            speed: 0.8
          }}
        >
          <Layer
            type="symbol"
            id="marker"
            layout={layoutLayer}
          >
            {
              Object.keys(stations).map((stationK, index) => (
                <Feature
                  key={stationK}
                  onMouseEnter={this.onToggleHover.bind(this, 'pointer')}
                  onMouseLeave={this.onToggleHover.bind(this, '')}
                  onClick={this.markerClick.bind(this, stations[stationK])}
                  coordinates={stations[stationK].position}
                />
              ))
            }
          </Layer>
          {
            station && (
              <Popup
                key={station.id}
                offset={[0, -50]}
                coordinates={station.position}
              >
                <StyledPopup>
                  <div>
                    {station.name}
                  </div>
                  <div>
                    {station.bikes} bikes / {station.slots} slots
                  </div>
                </StyledPopup>
              </Popup>
            )
          }
        </Mapbox>
      </div>
    )
  }
};
