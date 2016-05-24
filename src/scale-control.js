import React, { Component } from "react";

// in meters
const scales = [
  10, 20, 50,
  100, 200, 500,
  1000, 2 * 1000, 5 * 1000,
  10 * 1000, 20 * 1000, 50 * 1000,
  100 * 1000, 200 * 1000, 500 * 1000,
  1000 * 1000, 2 * 1000 * 1000, 5 * 1000 * 1000,
  10 * 1000 * 1000
];

const containerStyle = {
  position: "absolute",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  boxShadow: "0px 1px 4px rgba(0, 0, 0, .3)",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  bottom: 10,
  right: 100
};

const MEASUREMENTS = [ "km", "mi" ];

const MIN_WIDTH_SCALE = 40;

export default class ScaleControl extends Component {
  state = {
    chosen_scale: false
  }

  static propTypes = {
    measurement: React.PropTypes.string
  };

  static defaultProps = {
    measurement: MEASUREMENTS[0]
  };

  static contextTypes = {
    map: React.PropTypes.object
  };

  componentWillMount() {
    const { map } = this.context;
    const clientWidth = map._canvas.canvas.clientWidth;
    const { _ne, _sw } = map.getBounds();

    const totalWidth = 1000 * this._getDistanceTwoPoints([ _sw.lng, _ne.lat ], [ _ne.lng, _ne.lat ]);
    const relativeWidth = totalWidth / clientWidth * MIN_WIDTH_SCALE;

    const chosen_scale = scales.reduce((acc, curr) => acc || (curr > relativeWidth && curr), 0);
    this.setState({ chosen_scale });
    console.log("chosen_scale", chosen_scale);
  }

  _getDistanceTwoPoints(x, y) {
    const [ lng1, lat1 ] = x;
    const [ lng2, lat2 ] = y;

    const R = 6371; // Radius of the earth in km
    const dLat = this._deg2rad(lat2 - lat1);
    const dLng = this._deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km

    return d;
  }

  _deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  render() {
    const { map } = this.context;

    return (
      <div style={containerStyle}>
        Scale
      </div>
    );
  }
}
