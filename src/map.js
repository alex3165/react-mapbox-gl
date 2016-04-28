import MapboxGl from "mapbox-gl/dist/mapbox-gl";
import React, { Component, PropTypes } from "react";
import { Map, List } from "immutable";

export default class ReactMapboxGl extends Component {
  static propTypes = {
    style: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Map)
    ]).isRequired,

    accessToken: PropTypes.string.isRequired,
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    containerStyle: PropTypes.object,
    hash: PropTypes.bool,
    preserveDrawingBuffer: PropTypes.bool,
    onClick: PropTypes.func,
    onStyleLoad: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMove: PropTypes.func,
    onMoveEnd: PropTypes.func,
    onMouseUp: PropTypes.func,
    onDrag: PropTypes.func,
    scrollZoom: PropTypes.bool
  };

  static defaultProps = {
    hash: false,
    preserveDrawingBuffer: false,
    center: [
      -0.2416815,
      51.5285582
    ],
    zoom: 11,
    scrollZoom: true
  };

  static childContextTypes = {
    map: React.PropTypes.object
  };

  state = {};

  getChildContext = () => {
    return {
      map: this.state.map
    }
  };

  state = {};

  componentDidMount() {
    const {
      style,
      hash,
      preserveDrawingBuffer,
      accessToken,
      center,
      zoom,
      scrollZoom
    } = this.props;

    const mapStyle = Map.isMap(style) ? style.toJS() : style;

    MapboxGl.accessToken = accessToken;

    const map = new MapboxGl.Map({
      preserveDrawingBuffer,
      hash,
      zoom,
      container: this.refs.mapboxContainer,
      center: center,
      style: mapStyle,
      scrollZoom
    });

    map.on("style.load", () => {
      this.setState({ map });

      if (this.props.onStyleLoad) {
        this.props.onStyleLoad(map);
      }
    });

    map.on("click", (...args) => {
      if (this.props.onClick) {
        this.props.onClick(...args);
      }
    });

    map.on("mousemove", (...args) => {
      if (this.props.onMouseMove) {
        this.props.onMouseMove(...args);
      }
    });

    map.on("drag", (...args) => {
      if (this.props.onDrag) {
        this.props.onDrag(...args);
      }
    });

    map.on("mouseup", (...args) => {
      if (this.props.onMouseUp) {
        this.props.onMouseUp(...args);
      }
    });

    map.on("move", (...args) => {
      if (this.props.onMove) {
        this.props.onMove(map, ...args);
      }
    });

    map.on("moveend", (...args) => {
      if (this.props.onMoveEnd) {
        this.props.onMoveEnd(map, ...args);
      }
    });
  }

  componentWillUnmount() {
    if (this.state.map) {
      this.state.map.off();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.children !== this.props.children ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextState.map !== this.state.map
    );
  }

  componentWillReceiveProps(nextProps) {
    const { map } = this.state;

    if (!map) {
      throw new Error("Updating the props of the map while the style hasn't loaded is not possible!");
    }

    const center = map.getCenter();
    const zoom = map.getZoom();

    const didZoomUpdate = (
      this.props.zoom !== nextProps.zoom &&
      nextProps.zoom !== map.getZoom()
    );

    const didCenterUpdate = (
      this.props.center !== nextProps.center &&
      nextProps.center !== map.getCenter()
    );

    if (didZoomUpdate || didCenterUpdate) {
      map.flyTo({
        zoom: nextProps.zoom,
        center: nextProps.center
      });
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
