import React, { Component } from "react";

const scales = [
  .01, .02, .05,
  .1, .2, .5,
  1, 2, 5,
  10, 20, 50,
  100, 200, 500,
  1000, 2 * 1000, 5 * 1000,
  10 * 1000
];

const containerStyle = {
  position: "absolute",
  zIndex: 2,
  boxShadow: "0px 1px 4px rgba(0, 0, 0, .3)",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  bottom: 10,
  right: 50,
  backgroundColor: "#fff",
  opacity: .85,
  display: "flex",
  flexDirection: "row",
  alignItems: "baseline",
  padding: "3px 7px"
};

const scaleStyle = {
  border: "2px solid #7e8490",
  boxShadow: "0px 1px 4px rgba(0, 0, 0, .3)",
  borderTop: "none",
  height: 7,
  borderBottomLeftRadius: 1,
  borderBottomRightRadius: 1
};

const MEASUREMENTS = [ "km", "mi" ];

const MILE_IN_KILOMETERS = 1.60934;
const MILE_IN_FEET = 5280;
const KILOMETER_IN_METERS = 1000;

const MIN_WIDTH_SCALE = 40;

export default class ScaleControl extends Component {
   static contextTypes = {
    map: React.PropTypes.object
  };

  static propTypes = {
    measurement: React.PropTypes.string
  };

  static defaultProps = {
    measurement: MEASUREMENTS[0]
  };

  state = {
    chosenScale: false,
    scaleWidth: MIN_WIDTH_SCALE
  };

  componentWillMount() {
    const { map } = this.context;
    this._setScale(map);

    map.on("zoomend", () => {
      this._setScale(map);
    });
  }

  componentWillUnmount() {
    if (this.state.map) {
      this.state.map.off();
    }
  }

  _setScale = (map) => {
    const { measurement } = this.props;
    const clientWidth = map._canvas.canvas.clientWidth;
    const { _ne, _sw } = map.getBounds();

    const totalWidth = this._getDistanceTwoPoints([ _sw.lng, _ne.lat ], [ _ne.lng, _ne.lat ], measurement);
    const relativeWidth = totalWidth / clientWidth * MIN_WIDTH_SCALE;

    const chosenScale = scales.reduce((acc, curr) => acc || (curr > relativeWidth && curr), 0);
    const canvasWidth = map._canvas.canvas.width;
    const scaleWidth = chosenScale / totalWidth * map._canvas.canvas.width;

    this.setState({
      chosenScale,
      scaleWidth
    });
  };

  _getDistanceTwoPoints(x, y, measurement = "km") {
    const [ lng1, lat1 ] = x;
    const [ lng2, lat2 ] = y;

    // Radius of the earth in km or miles
    const R = measurement === "km"
      ? 6371
      : 6371 / MILE_IN_KILOMETERS;
    const dLat = this._deg2rad(lat2 - lat1);
    const dLng = this._deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;

    return d;
  }

  _deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  _displayMeasurement(measurement, chosenScale) {
    if (chosenScale >= 1) {
      return `${chosenScale} ${measurement}`;
    }

    if (measurement === "mi") {
      return `${Math.floor(chosenScale * MILE_IN_FEET)} ft`;
    }

    return `${Math.floor(chosenScale * KILOMETER_IN_METERS)} m`;
  }

  render() {
    const { measurement } = this.props;
    const { chosenScale, scaleWidth } = this.state;

    return (
      <div style={containerStyle}>
        <div
          style={{
            ...scaleStyle,
            width: scaleWidth
          }}>
        </div>

        <div style={{ paddingLeft: 10 }}>
          {this._displayMeasurement(measurement, chosenScale)}
        </div>
      </div>
    );
  }
}
