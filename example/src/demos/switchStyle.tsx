import * as React from 'react';
import ReactMapboxGl, { Layer, Source, Feature, GeoJSONLayer } from '../../../';
import { GeoJSONSourceRaw } from 'mapbox-gl';

import styled from 'styled-components';
// tslint:disable-next-line:no-var-requires
const { token, styles } = require('./config.json');
// tslint:disable-next-line:no-var-requires
const geojson = require('./geojson.json');

const Map = ReactMapboxGl({ accessToken: token });

const Container = styled.div`
  position: relative;
  height: 100%;
  flex: 1;
`;

const Button = styled.button`
  border: 1px solid #3770c6;
  background-color: rgb(84, 152, 255);
  height: 100%;
  color: white;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  :hover {
    background-color: #3770c6;
  }
`;
const Indicator = styled.div`
  padding: 6px 10px;
  background-color: white;
`;
const BottomBar = styled.div`
  position: absolute;
  bottom: 20px;
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
const switchStyles = Object.keys(styles).filter(k =>
  (selectedStyles as any).includes(k)
);

export interface State {
  styleKey: string;
  featuresPostion: number[][];
  mapCenter: [number, number];
  renderLayer: boolean;
}

export interface Props {
  // tslint:disable-next-line:no-any
  onStyleLoad?: (map: any) => any;
}

const InitialUserPostion = [-0.2416815, 51.5285582] as [number, number];

class StyleUpdate extends React.Component<Props, State> {
  public state: State = {
    styleKey: 'basic',
    featuresPostion: [InitialUserPostion, InitialUserPostion],
    // userPosition: InitialUserPostion,
    mapCenter: InitialUserPostion,
    renderLayer: true
  };

  public UNSAFE_componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }: any) => {
        const { latitude, longitude } = coords;

        this.setState({
          featuresPostion: [[longitude, latitude], InitialUserPostion],
          mapCenter: [longitude, latitude]
        });
      },
      err => {
        console.error('Cannot retrieve your current position', err);
      }
    );
  }

  public nextStyle = () => {
    const { styleKey } = this.state;
    const currentIndex = switchStyles.indexOf(styleKey);
    const nextIndex =
      currentIndex === switchStyles.length - 1 ? 0 : currentIndex + 1;

    this.setState({
      styleKey: switchStyles[nextIndex]
    });
  };

  public toggleLayer = () => {
    const { renderLayer } = this.state;

    this.setState({ renderLayer: !renderLayer });
  };

  private onDragStart = () => {
    console.log('onDragStart');
  };

  private onDrag = () => {
    console.log('onDrag');
  };

  private onDragEnd = ({ lngLat }: any, key: string | number) => {
    console.log('onDragEnd');
    this.setState({
      featuresPostion: this.state.featuresPostion.map((el, index) => {
        if (key === index) {
          return [lngLat.lng, lngLat.lat];
        }
        return el;
      })
    });
  };

  private onStyleLoad = (map: any) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  public render() {
    const { styleKey, featuresPostion, mapCenter, renderLayer } = this.state;

    return (
      <Container>
        <Map
          style={styles[styleKey]}
          containerStyle={mapStyle}
          center={mapCenter}
          onStyleLoad={this.onStyleLoad}
        >
          {renderLayer ? (
            <div>
              <Source id="example_id" geoJsonSource={GEOJSON_SOURCE_OPTIONS} />
              <Layer
                type="circle"
                id="example_id_marker"
                paint={POSITION_CIRCLE_PAINT}
                sourceId={'example_id'}
              />
            </div>
          ) : (
            undefined
          )}

          <Layer
            type="circle"
            id="position-marker"
            paint={POSITION_CIRCLE_PAINT}
          >
            {featuresPostion.map((loc, index) => (
              <Feature
                key={index}
                coordinates={loc}
                draggable={index === 0}
                onDragEnd={evt => this.onDragEnd(evt, index)}
                onDragStart={this.onDragStart}
                onDrag={this.onDrag}
              />
            ))}
          </Layer>

          <GeoJSONLayer
            data={geojson}
            circleLayout={{ visibility: 'visible' }}
            symbolLayout={{
              'text-field': '{place}',
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 0.6],
              'text-anchor': 'top'
            }}
          />
        </Map>
        <BottomBar>
          <Button onClick={this.nextStyle}>Change style</Button>
          <Button onClick={this.toggleLayer}>Toggle layer</Button>
          <Indicator>{`Using style: ${styleKey}`}</Indicator>
        </BottomBar>
      </Container>
    );
  }
}

export default StyleUpdate;
