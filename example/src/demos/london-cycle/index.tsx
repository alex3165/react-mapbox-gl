import * as React from 'react';
import ReactMapboxGl, { Layer, Feature, Popup } from '../../../../'; // { Layer, Feature, Popup, ZoomControl }
import { parseString } from 'xml2js';
import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const { londonCycle } = require('../config.json');

const getCycleStations = (): Promise<any[]> => (
  fetch('https://tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml')
    .then(res => res.text())
    .then(data => (
      new Promise((resolve, reject) => {
        parseString(data, (err, res) => {
          if (!err) {
            resolve(res.stations.station);
          } else {
            reject(err);
          }
        });
      })
    ))
);

const maxBounds = [
  [-0.481747846041145, 51.3233379650232],
  [0.23441119994140536, 51.654967740310525]
];

const Mapbox = ReactMapboxGl({
  minZoom: 8,
  maxZoom: 15,
  maxBounds,
  accessToken: londonCycle.accessToken
});

const mapStyle = {
  height: '500px',
  width: '100%'
};

const layoutLayer = { 'icon-image': 'bike' };

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
          style={londonCycle.style}
          fitBounds={fitBounds}
          center={center}
          zoom={zoom}
          onDrag={this.onDrag}
          containerStyle={mapStyle}
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
