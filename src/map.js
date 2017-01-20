import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js';
import React, { Component, PropTypes } from 'react';
import isEqual from 'deep-equal';

const events = {
  onStyleLoad: 'style.load', // Should remain first
  onResize: 'resize',
  onDblClick: 'dblclick',
  onClick: 'click',
  onMouseMove: 'mousemove',
  onMoveStart: 'mousestart',
  onMove: 'move',
  onMoveEnd: 'moveend',
  onMouseUp: 'mouseup',
  onDragStart: 'dragstart',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onZoomStart: 'zoomstart',
  onZoom: 'zoom',
  onZoomEnd: 'zoomend',
};

export default class ReactMapboxGl extends Component {
  static propTypes = {
    // Events propTypes
    ...Object.keys(events)
      .reduce((acc, event) => (
        Object.assign({}, acc, { [event]: PropTypes.func })
      ), {}),

    // Main propTypes
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
    fitBounds: PropTypes.array,
    fitBoundsOptions: PropTypes.object,
    bearing: PropTypes.number,
    pitch: PropTypes.number,
    containerStyle: PropTypes.object,
    hash: PropTypes.bool,
    preserveDrawingBuffer: PropTypes.bool,
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
    dragRotate: PropTypes.bool,
  };

  static defaultProps = {
    hash: false,
    onStyleLoad: (...args) => args,
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
    dragRotate: true,
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
      fitBounds,
      fitBoundsOptions,
      bearing,
      scrollZoom,
      attributionPosition,
      interactive,
      dragRotate,
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
      dragRotate,
    });

    if (fitBounds) {
      map.fitBounds(fitBounds, fitBoundsOptions);
    }

    Object.keys(events).forEach((event, index) => {
      const propEvent = this.props[event];

      if (propEvent) {
        map.on(events[event], (...args) => {
          propEvent(map, ...args);

          if (index === 0) {
            this.setState({ map });
          }
        });
      }
    });
  }

  componentWillUnmount() {
    const { map } = this.state;

    if (map) {
      // Remove all events attached to the map
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
      nextProps.style !== this.props.style ||
      nextProps.fitBounds !== this.props.fitBounds
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
    const pitch = map.getPitch();

    const didZoomUpdate = (
      this.props.zoom !== nextProps.zoom &&
      nextProps.zoom[0] !== zoom
    );

    const didCenterUpdate = (
      this.props.center !== nextProps.center &&
      (nextProps.center[0] !== center.lng || nextProps.center[1] !== center.lat)
    );

    const didBearingUpdate = (
      this.props.bearing !== nextProps.bearing &&
      nextProps.bearing !== bearing
    );

    const didPitchUpdate = (
      this.props.pitch !== nextProps.pitch &&
      nextProps.pitch !== pitch
    );

    if (nextProps.fitBounds) {
      const { fitBounds } = this.props;

      const didFitBoundsUpdate = (
        fitBounds !== nextProps.fitBounds || // Check for reference equality
        nextProps.fitBounds.length !== fitBounds && fitBounds.length || // Added element
        !!fitBounds.find((c, i) => { // Check for equality
          const nc = nextProps.fitBounds[i];
          return c[0] !== nc[0] || c[1] !== nc[1];
        })
      );

      if (didFitBoundsUpdate) {
        map.fitBounds(nextProps.fitBounds, nextProps.fitBoundsOptions);
      }
    }

    if (didZoomUpdate || didCenterUpdate || didBearingUpdate || didPitchUpdate) {
      map[this.props.movingMethod]({
        zoom: didZoomUpdate ? nextProps.zoom[0] : zoom,
        center: didCenterUpdate ? nextProps.center : center,
        bearing: didBearingUpdate ? nextProps.bearing : bearing,
        pitch: didPitchUpdate ? nextProps.pitch : pitch,
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
