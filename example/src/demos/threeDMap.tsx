import * as React from 'react';
import ReactMapboxGl, { Layer } from '../../../';

// tslint:disable-next-line:no-var-requires
const { token, styles } = require('./config.json');

const Map = ReactMapboxGl({ accessToken: token });

const mapStyle = {
  height: '400px',
  width: '100%'
};

// TODO: Fix when https://github.com/DefinitelyTyped/DefinitelyTyped/pull/20472/files is merged
// tslint:disable-next-line:no-any
const paintLayer: any = {
  'fill-extrusion-color': '#aaa',
  'fill-extrusion-height': {
      'type': 'identity' as  'identity',
      'property': 'height'
  },
  'fill-extrusion-base': {
      'type': 'identity' as 'identity',
      'property': 'min_height'
  },
  'fill-extrusion-opacity': .6
};

class ThreeDMap extends React.Component<{}, {}> {
  private zoom = [15];
  private center = [-0.0824952, 51.5144951];

  public render() {
    return (
      <Map
        style={styles.light}
        containerStyle={mapStyle}
        zoom={this.zoom}
        center={this.center}
        pitch={60}
        bearing={-60}
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
