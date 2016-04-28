import React, { Component } from "react";

const containerStyle = {
  position: "absolute",
  bottom: 10,
  right: 10,
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  boxShadow: "0px 1px 4px rgba(0, 0, 0, .3)",
  border: "1px solid rgba(0, 0, 0, 0.1)"
};

const buttonStyle = {
  backgroundColor: "#fff",
  cursor: "pointer",
  border: 0,
  height: 26,
  width: 26,
  backgroundImage: "url('https://api.mapbox.com/mapbox.js/v2.4.0/images/icons-000000@2x.png')",
  backgroundPosition: "0px 0px",
  backgroundSize: "26px 260px",
  cursor: "pointer",
  outline: 0
};

const buttonStylePlus = {
  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
  borderTopLeftRadius: 2,
  borderTopRightRadius: 2
};

const buttonStyleMinus = {
  backgroundPosition: "0px -26px",
  borderBottomLeftRadius: 2,
  borderBottomRightRadius: 2
};

export default class ZoomControl extends Component {
  static propTypes = {
    zoomDiff: React.PropTypes.number,
    onControlClick: React.PropTypes.func
  };

  render() {
    const { onControlClick, zoomDiff } = this.props;

    return (
      <div style={containerStyle}>
        <button
          style={Object.assign({}, buttonStyle, buttonStylePlus)}
          onClick={onControlClick.bind(this, zoomDiff)}>
        </button>
        <button
          style={Object.assign({}, buttonStyle, buttonStyleMinus)}
          onClick={onControlClick.bind(this, -zoomDiff)}>
        </button>
      </div>
    );
  }
}
