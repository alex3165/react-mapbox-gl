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
    preserveDrawingBuffer: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onStyleLoad: React.PropTypes.func,
    onMouseMove: React.PropTypes.func,
    onMove: React.PropTypes.func,
    onMoveEnd: React.PropTypes.func,
    scrollZoom: React.PropTypes.bool
  };

  state = {};

  static defaultProps = {
    hash: false,
    preserveDrawingBuffer: false,
    center: new List([
      -0.2416815,
      51.5285582
    ]),
    zoom: 11,
    scrollZoom: true
  };

  static childContextTypes = {
    map: React.PropTypes.object
  };

  getChildContext = () => ({
    map: this.state.map
  });

  componentDidMount() {
    const { style, hash, preserveDrawingBuffer, accessToken, center, zoom, scrollZoom, onClick, onStyleLoad, onMouseMove, onMove, onMoveEnd } = this.props;

    const mapStyle = Map.isMap(style) ? style.toJS() : style;

    MapboxGl.accessToken = accessToken;

    const map = new MapboxGl.Map({
      preserveDrawingBuffer,
      hash,
      zoom,
      container: this.refs.mapboxContainer,
      center: center.toJS(),
      style: mapStyle,
      scrollZoom
    });

    this.setState({ map });

    if(onStyleLoad) {
      map.on("style.load", onStyleLoad);
    }

    if(onClick) {
      map.on("click", onClick);
    }

    if(onMouseMove) {
      map.on("mousemove", onMouseMove);
    }

    if(onMove) {
      map.on("move", onMove.bind(this, map));
    }

    if(onMoveEnd) {
      map.on("moveend", onMoveEnd.bind(this, map));
    }
  }

  componentWillUnmount() {
    this.state.map.off();
  }

  componentWillReceiveProps(next) {
    let state = {};

    if(!next.center.equals(this.state.map.getCenter())) {
      state.center = next.center.toJS();
    }

    if(next.zoom !== this.props.zoom) {
      state.zoom = next.zoom;
    }

    if(Object.keys(state).length > 0) {
      this.state.map.flyTo(state);
    }
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
