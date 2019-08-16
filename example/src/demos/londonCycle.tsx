import * as React from 'react';
import ReactMapboxGl, { Layer, Feature, Popup } from '../../../';
import styled from 'styled-components';
import { londonCycleMaxBounds as maxBounds } from './data';
import { svg } from './cycle';
import { Station, getCycleStations, StationDict } from './londonCycleData';

// tslint:disable-next-line:no-var-requires
const { token, styles } = require('./config.json');

const Mapbox = ReactMapboxGl({
  minZoom: 8,
  maxZoom: 15,
  accessToken: token
});

const mapStyle = {
  flex: 1
};

// Define layout to use in Layer component
const layoutLayer = { 'icon-image': 'londonCycle' };

// Create an image for the Layer
const image = new Image();
image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(svg);
const images: any = ['londonCycle', image];

const StyledPopup = styled.div`
  background: white;
  color: #3f618c;
  font-weight: 400;
  padding: 5px;
  border-radius: 2px;
`;

export interface State {
  fitBounds?: [[number, number], [number, number]];
  center: [number, number];
  zoom: [number];
  station?: Station;
  stations: StationDict;
}

const flyToOptions = {
  speed: 0.8
};

export interface Props {
  // tslint:disable-next-line:no-any
  onStyleLoad?: (map: any) => any;
}

export default class LondonCycle extends React.Component<Props, State> {
  public state: State = {
    fitBounds: undefined,
    center: [-0.109970527, 51.52916347],
    zoom: [11],
    station: undefined,
    stations: {}
  };

  public UNSAFE_componentWillMount() {
    getCycleStations().then(res => {
      this.setState(({ stations }) => ({
        stations: {
          ...stations,
          ...res
        }
      }));
    });
  }

  private onDrag = () => {
    if (this.state.station) {
      this.setState({ station: undefined });
    }
  };

  private onToggleHover(cursor: string, { map }: { map: any }) {
    map.getCanvas().style.cursor = cursor;
  }

  private markerClick = (station: Station, { feature }: { feature: any }) => {
    this.setState({
      center: feature.geometry.coordinates,
      zoom: [14],
      station
    });
  };

  private onStyleLoad = (map: any) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  public render() {
    const { fitBounds, center, zoom, stations, station } = this.state;

    return (
      <Mapbox
        style={styles.londonCycle}
        onStyleLoad={this.onStyleLoad}
        fitBounds={fitBounds}
        maxBounds={maxBounds}
        center={center}
        zoom={zoom}
        onDrag={this.onDrag}
        containerStyle={mapStyle}
        flyToOptions={flyToOptions}
      >
        <Layer type="symbol" id="marker" layout={layoutLayer} images={images}>
          {Object.keys(stations).map((stationK, index) => (
            <Feature
              key={stationK}
              onMouseEnter={this.onToggleHover.bind(this, 'pointer')}
              onMouseLeave={this.onToggleHover.bind(this, '')}
              onClick={this.markerClick.bind(this, stations[stationK])}
              coordinates={stations[stationK].position}
            />
          ))}
        </Layer>
        {station && (
          <Popup key={station.id} coordinates={station.position}>
            <StyledPopup>
              <div>{station.name}</div>
              <div>
                {station.bikes} bikes / {station.slots} slots
              </div>
            </StyledPopup>
          </Popup>
        )}
      </Mapbox>
    );
  }
}
