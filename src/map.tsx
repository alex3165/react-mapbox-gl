import * as MapboxGl from 'mapbox-gl';
import * as React from 'react';
const PropTypes = require('prop-types'); // tslint:disable-line

const isEqual = require('deep-equal'); //tslint:disable-line

const events = {
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
  onPitch: 'pitch',
  onPitchStart: 'pitchstart',
  onPitchEnd: 'pitchend'
};

export type MapEvent = (map: MapboxGl.Map, evt: React.SyntheticEvent<any>) => void;

export interface Events {
  onStyleLoad?: MapEvent;
  onResize?: MapEvent;
  onDblClick?: MapEvent;
  onClick?: MapEvent;
  onMouseMove?: MapEvent;
  onMoveStart?: MapEvent;
  onMove?: MapEvent;
  onMoveEnd?: MapEvent;
  onMouseUp?: MapEvent;
  onDragStart?: MapEvent;
  onDragEnd?: MapEvent;
  onDrag?: MapEvent;
  onZoomStart?: MapEvent;
  onZoom?: MapEvent;
  onZoomEnd?: MapEvent;
  onPitch?: MapEvent;
  onPitchStart?: MapEvent;
  onPitchEnd?: MapEvent;
}

export interface FitBoundsOptions {
  linear?: boolean;
  easing?: (time: number) => number;
  padding?: number;
  offset?: MapboxGl.Point | number[];
  maxZoom?: number;
}

export type FitBounds = number[][];

// React Props updated between re-render
export interface Props {
  style: string | MapboxGl.Style;
  center?: number[];
  zoom?: number[];
  fitBounds?: FitBounds;
  fitBoundsOptions?: FitBoundsOptions;
  bearing?: number;
  pitch?: number;
  containerStyle?: React.CSSProperties;
  movingMethod?: 'jumpTo' | 'easeTo' | 'flyTo';
  children?: JSX.Element;
}

export interface State {
  map?: MapboxGl.Map;
}

// Static Properties of the map
export interface FactoryParameters {
  accessToken: string;
  minZoom?: number;
  maxZoom?: number;
  hash?: boolean;
  preserveDrawingBuffer?: boolean;
  maxBounds?: MapboxGl.LngLatBounds | FitBounds;
  scrollZoom?: boolean;
  interactive?: boolean;
  dragRotate?: boolean;
  attributionControl?: boolean;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  renderWorldCopies?: boolean;
}

// Satisfy typescript pitfall with defaultProps
const defaultZoom = [11];
const defaultMovingMethod = 'flyTo';
const defaultCenter = [-0.2416815, 51.5285582];

const ReactMapboxFactory = ({
  accessToken,
  minZoom = 0,
  maxZoom = 20,
  hash = false,
  preserveDrawingBuffer = false,
  maxBounds,
  scrollZoom = true,
  interactive = true,
  dragRotate = true,
  attributionControl = true,
  logoPosition = 'bottom-left',
  renderWorldCopies = true
}: FactoryParameters): any => (
  class ReactMapboxGl extends React.Component<Props & Events, State> {
    public static defaultProps = {
      onStyleLoad: (...args: any[]) => args,
      center: defaultCenter,
      zoom: defaultZoom,
      bearing: 0,
      movingMethod: defaultMovingMethod,
      pitch: 0
    };

    public static childContextTypes = {
      map: PropTypes.object
    };

    public state = {
      map: undefined
    };

    public getChildContext = () => ({
      map: this.state.map
    })

    private container: HTMLElement;

    private calcCenter = (bounds: FitBounds): number[] => (
      [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2]
    )

    public componentDidMount() {
      const {
        style,
        onStyleLoad,
        center,
        pitch,
        zoom,
        fitBounds,
        fitBoundsOptions,
        bearing
      } = this.props;

      (MapboxGl as any).accessToken = accessToken;

      const opts: MapboxGl.MapboxOptions = {
        preserveDrawingBuffer,
        hash,
        zoom: zoom ? zoom[0] : defaultZoom[0],
        minZoom,
        maxZoom,
        maxBounds,
        bearing,
        container: this.container,
        center: fitBounds && center === defaultCenter ? this.calcCenter(fitBounds) : center,
        pitch,
        style,
        scrollZoom,
        attributionControl,
        interactive,
        dragRotate,
        renderWorldCopies
      };

      const map = new MapboxGl.Map({
        ...opts,
        // logoposition is not part of the typings of mapbox-gl, this does the trick
        logoPosition
      });

      if (fitBounds) {
        map.fitBounds(fitBounds, fitBoundsOptions);
      }

      map.on('load', (evt: React.SyntheticEvent<any>) => {
        this.setState({ map });

        if (onStyleLoad) {
          onStyleLoad(map, evt);
        }
      });

      Object.keys(events).forEach((event, index) => {
        const propEvent = this.props[event];

        if (propEvent) {
          map.on(events[event], (evt: React.SyntheticEvent<any>) => {
            propEvent(map, evt);
          });
        }
      });
    }

    public componentWillUnmount() {
      const { map } = this.state as State;

      if (map) {
        // Remove all events attached to the map
        map.off();

        // NOTE: We need to defer removing the map to after all children have unmounted
        setTimeout(() => {
          map.remove();
        });
      }
    }

    public componentWillReceiveProps(nextProps: Props) {
      const { map } = this.state as State;
      if (!map) {
        return null;
      }

      const center = map.getCenter();
      const zoom = map.getZoom();
      const bearing = map.getBearing();
      const pitch = map.getPitch();

      const didZoomUpdate = (
        this.props.zoom !== nextProps.zoom &&
        (nextProps.zoom && nextProps.zoom[0]) !== zoom
      );

      const didCenterUpdate = (
        this.props.center !== nextProps.center &&
        (
          (nextProps.center && nextProps.center[0]) !== center.lng ||
          (nextProps.center && nextProps.center[1]) !== center.lat
        )
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
          nextProps.fitBounds.length !== (fitBounds && fitBounds.length) || // Added element
          !!fitBounds.filter((c, i) => { // Check for equality
            const nc = nextProps.fitBounds && nextProps.fitBounds[i];
            return c[0] !== (nc && nc[0]) || c[1] !== (nc && nc[1]);
          })[0]
        );

        if (didFitBoundsUpdate) {
          map.fitBounds(nextProps.fitBounds, nextProps.fitBoundsOptions);
        }
      }

      if (didZoomUpdate || didCenterUpdate || didBearingUpdate || didPitchUpdate) {
        const mm: string = nextProps.movingMethod || defaultMovingMethod;
        map[mm]({
          zoom: (didZoomUpdate && nextProps.zoom) ? nextProps.zoom[0] : zoom,
          center: didCenterUpdate ? nextProps.center : center,
          bearing: didBearingUpdate ? nextProps.bearing : bearing,
          pitch: didPitchUpdate ? nextProps.pitch : pitch
        });
      }

      if (!isEqual(this.props.style, nextProps.style)) {
        map.setStyle(nextProps.style);
      }

      return null;
    }

    private setRef = (x: HTMLElement) => {
      this.container = x;
    }

    public render() {
      const { containerStyle, children } = this.props;
      const { map } = this.state;

      return (
        <div ref={this.setRef} style={containerStyle}>
          {map && children}
        </div>
      );
    }
  }
);

export default ReactMapboxFactory;
