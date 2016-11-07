import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js';
import React, { Component, PropTypes } from 'react';
import isEqual from 'deep-equal';

export default class ReactMapboxGl extends Component {
  static propTypes = {
    style: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
    accessToken: PropTypes.string.isRequired,
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.arrayOf(PropTypes.number),
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    maxBounds: PropTypes.array,
    bearing: PropTypes.number,
    pitch: PropTypes.number,
    containerStyle: PropTypes.object,
    hash: PropTypes.bool,
    preserveDrawingBuffer: PropTypes.bool,
    onResize: PropTypes.func,
    onDblClick: PropTypes.func,
    onClick: PropTypes.func,
    onStyleLoad: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMoveStart: PropTypes.func,
    onMove: PropTypes.func,
    onMoveEnd: PropTypes.func,
    onMouseUp: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    onZoomStart: PropTypes.func,
    onZoom: PropTypes.func,
    onZoomEnd: PropTypes.func,
    scrollZoom: PropTypes.bool,
    movingMethod: PropTypes.oneOf([
      'jumpTo',
      'easeTo',
      'flyTo',
    ]),
    attributionPosition: PropTypes.oneOf([
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
    ]),
    interactive: PropTypes.bool,
  };

  static defaultProps = {
    hash: false,
    preserveDrawingBuffer: false,
    center: [
      -0.2416815,
      51.5285582,
    ],
    zoom: [11],
    minZoom: 0,
    maxZoom: 20,
    bearing: 0,
    scrollZoom: true,
    movingMethod: 'flyTo',
    pitch: 0,
    attributionPosition: 'bottom-right',
    interactive: true,
  };

  static childContextTypes = {
    map: React.PropTypes.object,
  };

  state = {};

  getChildContext = () => ({
    map: this.state.map,
  });

  componentDidMount() {
    const {
      style,
      hash,
      preserveDrawingBuffer,
      accessToken,
      center,
      pitch,
      zoom,
      minZoom,
      maxZoom,
      maxBounds,
      bearing,
      onStyleLoad,
      onResize,
      onDblClick,
      onClick,
      onMouseMove,
      onDragStart,
      onDrag,
      onDragEnd,
      onMouseUp,
      onMove,
      onMoveStart,
      onMoveEnd,
      onZoomStart,
      onZoom,
      onZoomEnd,
      scrollZoom,
      attributionPosition,
      interactive,
    } = this.props;

    MapboxGl.accessToken = accessToken;

    const map = new MapboxGl.Map({
      preserveDrawingBuffer,
      hash,
      zoom: zoom[0],
      minZoom,
      maxZoom,
      maxBounds,
      bearing,
      container: this.container,
      center,
      pitch,
      style,
      scrollZoom,
      attributionControl: {
        position: attributionPosition,
      },
      interactive,
    });

    map.on('style.load', (...args) => {
      if (onStyleLoad) {
        onStyleLoad(map, ...args);
      }

      this.setState({ map });
    });

    map.on('resize', (...args) => {
      if (onResize) {
        onResize(map, ...args);
      }
    });

    map.on('dblclick', (...args) => {
      if (onDblClick) {
        onDblClick(map, ...args);
      }
    });

    map.on('click', (...args) => {
      if (onClick) {
        onClick(map, ...args);
      }
    });

    map.on('mousemove', (...args) => {
      if (onMouseMove) {
        onMouseMove(map, ...args);
      }
    });

    map.on('dragstart', (...args) => {
      if (onDragStart) {
        onDragStart(map, ...args);
      }
    });

    map.on('drag', (...args) => {
      if (onDrag) {
        onDrag(map, ...args);
      }
    });

    map.on('dragend', (...args) => {
      if (onDragEnd) {
        onDragEnd(map, ...args);
      }
    });

    map.on('mouseup', (...args) => {
      if (onMouseUp) {
        onMouseUp(map, ...args);
      }
    });

    map.on('movestart', (...args) => {
      if (onMoveStart) {
        onMoveStart(map, ...args);
      }
    });

    map.on('move', (...args) => {
      if (onMove) {
        onMove(map, ...args);
      }
    });

    map.on('moveend', (...args) => {
      if (onMoveEnd) {
        onMoveEnd(map, ...args);
      }
    });

    map.on('zoomstart', (...args) => {
      if (onZoomStart) {
        onZoomStart(map, ...args);
      }
    });

    map.on('zoom', (...args) => {
      if (onZoom) {
        onZoom(map, ...args);
      }
    });

    map.on('zoomend', (...args) => {
      if (onZoomEnd) {
        onZoomEnd(map, ...args);
      }
    });
  }

  componentWillUnmount() {
    const { map } = this.state;

    if (map) {
      map.off();

      // NOTE: We need to defer removing the map to after all children have unmounted
      setTimeout(() => {
        map.remove();
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.children !== this.props.children ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextState.map !== this.state.map ||
      nextProps.style !== this.props.style
    );
  }

  componentWillReceiveProps(nextProps) {
    const { map } = this.state;
    if (!map) {
      return null;
    }

    const center = map.getCenter();
    const zoom = map.getZoom();
    const bearing = map.getBearing();

    const didZoomUpdate = (
      this.props.zoom !== nextProps.zoom &&
      nextProps.zoom[0] !== map.getZoom()
    );

    const didCenterUpdate = (
      this.props.center !== nextProps.center &&
      (nextProps.center[0] !== map.getCenter().lng || nextProps.center[1] !== map.getCenter().lat)
    );

    const didBearingUpdate = (
      this.props.bearing !== nextProps.bearing &&
      nextProps.bearing !== map.getBearing()
    );

    if (didZoomUpdate || didCenterUpdate || didBearingUpdate) {
      map[this.props.movingMethod]({
        zoom: didZoomUpdate ? nextProps.zoom[0] : zoom,
        center: didCenterUpdate ? nextProps.center : center,
        bearing: didBearingUpdate ? nextProps.bearing : bearing,
      });
    }

    if (!isEqual(this.props.style, nextProps.style)) {
      map.setStyle(nextProps.style);
    }

    return null;
  }

  render() {
    const { containerStyle, children } = this.props;
    const { map } = this.state;

    return (
      <div ref={(x) => { this.container = x; }} style={containerStyle}>
        {
          map && children
        }
      </div>
    );
  }
}
