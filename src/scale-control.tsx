import * as React from 'react';
const PropTypes = require('prop-types'); // tslint:disable-line

import { Map } from 'mapbox-gl';

const scales = [
  0.01, 0.02, 0.05,
  0.1, 0.2, 0.5,
  1, 2, 5,
  10, 20, 50,
  100, 200, 500,
  1000, 2 * 1000, 5 * 1000,
  10 * 1000
];

const positions = {
  topRight: { top: 10, right: 10, bottom: 'auto', left: 'auto' },
  topLeft: { top: 10, left: 10, bottom: 'auto', right: 'auto' },
  bottomRight: { bottom: 10, right: 10, top: 'auto', left: 'auto' },
  bottomLeft: { bottom: 10, left: 10, top: 'auto', right: 'auto' }
};

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  zIndex: 10,
  boxShadow: '0px 1px 4px rgba(0, 0, 0, .3)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  right: 50,
  backgroundColor: '#fff',
  opacity: 0.85,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  padding: '3px 7px'
};

const scaleStyle = {
  border: '2px solid #7e8490',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, .3)',
  borderTop: 'none',
  height: 7,
  borderBottomLeftRadius: 1,
  borderBottomRightRadius: 1
};

const POSITIONS = Object.keys(positions);

const MEASUREMENTS = ['km', 'mi'];

const MILE_IN_KILOMETERS = 1.60934;
const MILE_IN_FEET = 5280;
const KILOMETER_IN_METERS = 1000;

const MIN_WIDTH_SCALE = 40;

export type Measurement = 'km' | 'mi';
export type Position = 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';

export interface Props {
  measurement: Measurement;
  position: Position;
  style: React.CSSProperties;
}

export interface State {
  chosenScale: number;
  scaleWidth: number;
}

export interface Context {
  map: Map;
}

export default class ScaleControl extends React.Component<Props, State> {
  public context: Context;

  public static contextTypes = {
    map: PropTypes.object
  };

  public static defaultProps = {
    measurement: MEASUREMENTS[0],
    position: POSITIONS[2]
  };

  public state = {
    chosenScale: 0,
    scaleWidth: MIN_WIDTH_SCALE
  };

  public componentWillMount() {
    this.setScale();

    this.context.map.on('zoomend', this.setScale);
  }

  public componentWillUnmount() {
    if (this.context.map) {
      this.context.map.off('zoomend', this.setScale);
    }
  }

  private setScale = () => {
    const { map } = this.context;
    const { measurement } = this.props;

    const clientWidth = (map as any)._canvas.clientWidth;
    const { _ne, _sw } = map.getBounds() as any;

    const totalWidth = this._getDistanceTwoPoints(
      [_sw.lng, _ne.lat],
      [_ne.lng, _ne.lat],
      measurement
    );

    const relativeWidth = totalWidth / clientWidth * MIN_WIDTH_SCALE;

    const chosenScale = scales.reduce((acc, curr) => {
      if (!acc && curr > relativeWidth) {
        return curr;
      }

      return acc;
    }, 0);

    const scaleWidth = chosenScale / totalWidth * (map as any)._canvas.width;

    this.setState({
      chosenScale,
      scaleWidth
    });
  }

  private _getDistanceTwoPoints(x: number[], y: number[], measurement = 'km') {
    const [lng1, lat1] = x;
    const [lng2, lat2] = y;

    // Radius of the earth in km or miles
    const R = measurement === 'km'
      ? 6371
      : 6371 / MILE_IN_KILOMETERS;
    const dLat = this._deg2rad(lat2 - lat1);
    const dLng = this._deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d;
  }

  private _deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  private _displayMeasurement(measurement: Measurement, chosenScale: number) {
    if (chosenScale >= 1) {
      return `${chosenScale} ${measurement}`;
    }

    if (measurement === 'mi') {
      return `${Math.floor(chosenScale * MILE_IN_FEET)} ft`;
    }

    return `${Math.floor(chosenScale * KILOMETER_IN_METERS)} m`;
  }

  public render() {
    const { measurement, style, position } = this.props;
    const { chosenScale, scaleWidth } = this.state;

    return (
      <div style={{ ...containerStyle, ...positions[position], ...style }}>
        <div
          style={{ ...scaleStyle, width: scaleWidth }}
        />
        <div style={{ paddingLeft: 10 }}>
          {this._displayMeasurement(measurement, chosenScale)}
        </div>
      </div>
    );
  }
}
