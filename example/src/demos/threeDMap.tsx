import * as React from 'react';
import ReactMapboxGl, { Layer } from '../../../';

// tslint:disable-next-line:no-var-requires
const { token, styles } = require('./config.json');

const Map = ReactMapboxGl({ accessToken: token });

const mapStyle = {
  flex: 1
};

const paintLayer = {
  'fill-extrusion-color': '#aaa',
  'fill-extrusion-height': {
    type: 'identity' as 'identity',
    property: 'height'
  },
  'fill-extrusion-base': {
    type: 'identity' as 'identity',
    property: 'min_height'
  },
  'fill-extrusion-opacity': 0.6
};

export interface Props {
  // tslint:disable-next-line:no-any
  onStyleLoad?: (map: any) => any;
}

class ThreeDMap extends React.Component<Props> {
  private zoom: [number] = [15];
  private bearing: [number] = [-60];
  private pitch: [number] = [60];
  private center = [-0.0824952, 51.5144951] as [number, number];

  // tslint:disable-next-line:no-any
  private onStyleLoad = (map: any) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  public render() {
    return (
      <Map
        style={styles.light}
        containerStyle={mapStyle}
        onStyleLoad={this.onStyleLoad}
        zoom={this.zoom}
        center={this.center}
        pitch={this.pitch}
        bearing={this.bearing}
      >
        <Layer
          id="3d-buildings"
          sourceId="composite"
          sourceLayer="building"
          filter={['==', 'extrude', 'true']}
          type="fill-extrusion"
          minZoom={14}
          paint={paintLayer}
        />
      </Map>
    );
  }
}

export default ThreeDMap;
