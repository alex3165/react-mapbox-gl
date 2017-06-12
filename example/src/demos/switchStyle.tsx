import * as React from 'react';
import ReactMapboxGl, { Layer, Source, Feature } from '../../../';
import { GeoJSONSourceRaw } from 'mapbox-gl';

import styled from 'styled-components';
// tslint:disable-next-line:no-var-requires
const { token, styles } = require('./config.json');

const Map = ReactMapboxGl({ accessToken: token });

const Container = styled.div`
  position: relative;
  height: 400px;
`;

const Button = styled.button`
  border: 1px solid #3770C6;
  background-color: rgb(84, 152, 255);
  height: 100%;
  color: white;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  :hover {
    background-color: #3770C6;
  }
`;
const Indicator = styled.div`
  padding: 6px 10px;
  background-color: white;
`;
const TopBar = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const mapStyle = {
  height: '100%',
  width: '100%'
};

const GEOJSON_SOURCE_OPTIONS: GeoJSONSourceRaw = {
  type: 'geojson',
  data: {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-77.0323, 38.9131]
    },
    properties: {
      title: 'Mapbox DC',
      'marker-symbol': 'monument'
    }
  }
};

const POSITION_CIRCLE_PAINT = {
    'circle-stroke-width': 4,
    'circle-radius': 10,
    'circle-blur': 0.15,
    'circle-color': '#3770C6',
    'circle-stroke-color': 'white'
};

const selectedStyles = ['basic', 'dark', 'light'];
const switchStyles = Object.keys(styles).filter(k => selectedStyles.includes(k));

export interface State {
  styleKey: string;
  userPosition: number[];
  mapCenter: number[];
}

const InitialUserPostion = [-0.2416815, 51.5285582]

class StyleUpdate extends React.Component<{}, State> {

  public state: State = {
    styleKey: 'basic',
    userPosition: InitialUserPostion,
    mapCenter: InitialUserPostion
  };

  public componentWillMount() {
    navigator.geolocation.getCurrentPosition(({ coords }: any) => {
      const { latitude, longitude } = coords;

      this.setState({
        userPosition: [longitude, latitude],
        mapCenter: [longitude, latitude]
      });
    }, err => {
      console.error('Cannot retrieve your current position', err);
    })
  }

  public nextStyle = () => {
    const { styleKey } = this.state;
    const currentIndex = switchStyles.indexOf(styleKey);
    const nextIndex = currentIndex === switchStyles.length - 1 ? 0 : currentIndex + 1;

    this.setState({
      styleKey: switchStyles[nextIndex]
    });
  }

  private onDragEnd = ({ lngLat }: any) => {
    this.setState({
      userPosition: [lngLat.lng, lngLat.lat]
    });
  };

  public render() {
    const { styleKey, userPosition, mapCenter } = this.state;

    return (
      <Container>
        <Map
          style={styles[styleKey]}
          containerStyle={mapStyle}
          center={mapCenter}
        >
          <Source id="example_id" geoJsonSource={GEOJSON_SOURCE_OPTIONS}/>
          <Layer type="circle" id="example_id_marker" paint={POSITION_CIRCLE_PAINT} sourceId={'example_id'}/>
          <Layer type="circle" id="position-marker" paint={POSITION_CIRCLE_PAINT}>
            <Feature
              coordinates={userPosition}
              draggable={true}
              onDragEnd={this.onDragEnd}
            />
          </Layer>
        </Map>
        <TopBar>
          <Button onClick={this.nextStyle}>Change style</Button>
          <Indicator>{`Using style: ${styleKey}`}</Indicator>
        </TopBar>
      </Container>
    );
  }
};

export default StyleUpdate;
