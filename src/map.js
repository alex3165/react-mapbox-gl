import MapboxGl from "mapbox-gl/dist/mapbox-gl";
import React, { Component } from "react";
import { Map, List } from "immutable";

export default class ReactMapboxGl extends Component {
  displayName = "ReactMapboxGl";

  static propTypes = {
    style: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.instanceOf(Map)
    ]).isRequired,
    accessToken: React.PropTypes.string.isRequired,
    center: React.PropTypes.instanceOf(List),
    zoom: React.PropTypes.number,
    containerStyle: React.PropTypes.object,
    hash: React.PropTypes.bool,
    preserveDrawingBuffer: React.PropTypes.bool
  };

  state = {};

  static defaultProps = {
    hash: false,
    preserveDrawingBuffer: false,
    center: new List([
      -0.2416815,
      51.5285582
    ]),
    zoom: 11
  };

  static childContextTypes = {
    map: React.PropTypes.object
  };

  getChildContext = () => ({
    map: this.state.map
  });

  componentDidMount() {
    const { style, hash, preserveDrawingBuffer, accessToken, center, zoom } = this.props;

    const mapStyle = Map.isMap(style) ? style.toJS() : style;

    MapboxGl.accessToken = accessToken;

    this.setState({
      map: new MapboxGl.Map({
        preserveDrawingBuffer,
        hash,
        zoom,
        container: this.refs.mapboxContainer,
        center: center.toJS(),
        style: mapStyle
      })
    });
  }

  render() {
    const { containerStyle, children } = this.props;

    return (
      <div ref="mapboxContainer" style={containerStyle}>
        { children }
      </div>
    )
  }
}
