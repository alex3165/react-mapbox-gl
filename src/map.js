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
    onMouseUp: React.PropTypes.func,
    onDrag: React.PropTypes.func,
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

  getChildContext = () => {
    return {
      map: this.state.map
    }
  };

  state = {};

  _onStyleLoaded(map) {
    const { onStyleLoad } = this.props;

    this.setState({ map });

    if(onStyleLoad) {
      onStyleLoad(map);
    }
  }

  componentDidMount() {

    const { style, hash, preserveDrawingBuffer, accessToken, center, zoom, scrollZoom, onClick, onStyleLoad, onDrag, onMouseUp, onMouseMove, onMove, onMoveEnd } = this.props;

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

    if (onStyleLoad) {
      map.on("style.load", () => {
        onStyleLoad(map);
      });
    }

    if (onClick) {
      map.on("click", onClick);
    }

    if (onMouseMove) {
      map.on("mousemove", onMouseMove);
    }

    if(onDrag) {
      map.on("drag", onDrag);
    }

    if(onMouseUp) {
      map.on("mouseup", onMouseUp);
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
    const { map } = this.state;
    if(!map) {
      console.warn("Updating the props of the map while the style has not been fully loaded")
      return;
    }

    if(!next.center.equals(map.getCenter()) && this.props.center !== next.center) {
      state.center = next.center.toJS();
    }

    if(next.zoom !== this.props.zoom && next.zoom !== map.getZoom()) {
      state.zoom = next.zoom;
    }

    if(Object.keys(state).length > 0) {
      map.flyTo(state);
    }
  }

  render() {
    const { containerStyle, children } = this.props;
    const { map } = this.state;

    return (
      <div ref="mapboxContainer" style={containerStyle}>
        {
          map && children
        }
      </div>
    )
  }
}
