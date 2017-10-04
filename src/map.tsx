import * as MapboxGl from 'mapbox-gl';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import injectCSS from './util/inject-css';
const isEqual = require('deep-equal'); //tslint:disable-line

const events = {
  onResize: 'resize',
  onDblClick: 'dblclick',
  onClick: 'click',
  onMouseMove: 'mousemove',
  onMouseOut: 'mouseout',
  onMoveStart: 'movestart',
  onMove: 'move',
  onMoveEnd: 'moveend',
  onMouseUp: 'mouseup',
  onMouseDown: 'mousedown',
  onDragStart: 'dragstart',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onZoomStart: 'zoomstart',
  onZoom: 'zoom',
  onZoomEnd: 'zoomend',
  onPitch: 'pitch',
  onPitchStart: 'pitchstart',
  onPitchEnd: 'pitchend',
  onWebGlContextLost: 'webglcontextlost',
  onWebGlContextRestored: 'webglcontextrestored',
  onRemove: 'remove',
  onContextMenu: 'contextmenu',
  onRender: 'render',
  onError: 'error',
  onSourceData: 'sourcedata',
  onDataLoading: 'dataloading',
  onStyleDataLoading: 'styledataloading',
  onTouchCancel: 'touchcancel',
  onData: 'data',
  onSourceDataLoading: 'sourcedataloading',
  onTouchMove: 'touchmove',
  onTouchEnd: 'touchend',
  onTouchStart: 'touchstart',
  onStyleData: 'styledata',
  onBoxZoomStart: 'boxzoomstart',
  onBoxZoomEnd: 'boxzoomend',
  onBoxZoomCancel: 'boxzoomcancel',
  onRotateStart: 'rotatestart',
  onRotate: 'rotate',
  onRotateEnd: 'rotateend'
};

export type MapEvent = (
  map: MapboxGl.Map,
  evt: React.SyntheticEvent<any>
) => void;

export interface Events {
  onStyleLoad?: MapEvent;
  onResize?: MapEvent;
  onDblClick?: MapEvent;
  onClick?: MapEvent;
  onMouseMove?: MapEvent;
  onMouseOut?: MapEvent;
  onMoveStart?: MapEvent;
  onMove?: MapEvent;
  onMoveEnd?: MapEvent;
  onMouseDown?: MapEvent;
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
  onWebGlContextLost?: MapEvent;
  onWebGlContextRestored?: MapEvent;
  onRemove?: MapEvent;
  onContextMenu?: MapEvent;
  onRender?: MapEvent;
  onError?: MapEvent;
  onSourceData?: MapEvent;
  onDataLoading?: MapEvent;
  onStyleDataLoading?: MapEvent;
  onTouchCancel?: MapEvent;
  onData?: MapEvent;
  onSourceDataLoading?: MapEvent;
  onTouchMove?: MapEvent;
  onTouchEnd?: MapEvent;
  onTouchStart?: MapEvent;
  onStyleData?: MapEvent;
  onBoxZoomStart?: MapEvent;
  onBoxZoomEnd?: MapEvent;
  onBoxZoomCancel?: MapEvent;
  onRotateStart?: MapEvent;
  onRotate?: MapEvent;
  onRotateEnd?: MapEvent;
}

export interface FitBoundsOptions {
  linear?: boolean;
  easing?: (time: number) => number;
  padding?: number;
  offset?: MapboxGl.Point | number[];
  maxZoom?: number;
}

export type FitBounds = number[][];

export interface AnimationOptions {
  duration: number;
  animate: boolean;
  easing(time: number): number;
  offset: number[];
}

export interface FlyToOptions {
  curve: number;
  minZoom: number;
  speed: number;
  screenSpeed: number;
}

// React Props updated between re-render
export interface Props {
  style: string | MapboxGl.Style;
  center?: number[];
  zoom?: number[];
  maxBounds?: MapboxGl.LngLatBounds | FitBounds;
  fitBounds?: FitBounds;
  fitBoundsOptions?: FitBoundsOptions;
  bearing?: number;
  pitch?: number;
  containerStyle?: React.CSSProperties;
  className?: string;
  movingMethod?: 'jumpTo' | 'easeTo' | 'flyTo';
  animationOptions?: AnimationOptions;
  flyToOptions?: FlyToOptions;
  children?: JSX.Element;
}

export interface State {
  map?: MapboxGl.Map;
  ready: boolean;
}

// Static Properties of the map
export interface FactoryParameters {
  accessToken: string;
  apiUrl?: string;
  minZoom?: number;
  maxZoom?: number;
  hash?: boolean;
  preserveDrawingBuffer?: boolean;
  scrollZoom?: boolean;
  interactive?: boolean;
  dragRotate?: boolean;
  attributionControl?: boolean;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  renderWorldCopies?: boolean;
  trackResize?: boolean;
  touchZoomRotate?: boolean;
  doubleClickZoom?: boolean;
  keyboard?: boolean;
  dragPan?: boolean;
  boxZoom?: boolean;
  refreshExpiredTiles?: boolean;
  failIfMajorPerformanceCaveat?: boolean;
  classes?: string[];
  bearingSnap?: number;
  injectCss?: boolean;
}

// Satisfy typescript pitfall with defaultProps
const defaultZoom = [11];
const defaultMovingMethod = 'flyTo';
const defaultCenter = [-0.2416815, 51.5285582];
const defaultContainerStyle = {
  textAlign: 'left'
};

// tslint:disable-next-line:no-namespace
declare global {
  namespace mapboxgl {
    export interface MapboxOptions {
      failIfMajorPerformanceCaveat?: boolean;
    }
  }
}

const ReactMapboxFactory = ({
  accessToken,
  apiUrl,
  minZoom = 0,
  maxZoom = 20,
  hash = false,
  preserveDrawingBuffer = false,
  scrollZoom = true,
  interactive = true,
  dragRotate = true,
  attributionControl = true,
  logoPosition = 'bottom-left',
  renderWorldCopies = true,
  trackResize = true,
  touchZoomRotate = true,
  doubleClickZoom = true,
  keyboard = true,
  dragPan = true,
  boxZoom = true,
  refreshExpiredTiles = true,
  failIfMajorPerformanceCaveat = false,
  classes,
  bearingSnap = 7,
  injectCss = true
}: FactoryParameters): any => {
  if (injectCss) {
    injectCSS(window);
  }

  return class ReactMapboxGl extends React.Component<Props & Events, State> {
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
      map: undefined,
      ready: false
    };

    // tslint:disable-next-line:variable-name
    private _isMounted = true;

    public getChildContext = () => ({
      map: this.state.map
    });

    private container: HTMLElement;

    private calcCenter = (bounds: FitBounds): number[] => [
      (bounds[0][0] + bounds[1][0]) / 2,
      (bounds[0][1] + bounds[1][1]) / 2
    ];

    public componentDidMount() {
      const {
        style,
        onStyleLoad,
        center,
        pitch,
        zoom,
        fitBounds,
        fitBoundsOptions,
        bearing,
        maxBounds
      } = this.props;

      (MapboxGl as any).accessToken = accessToken;
      if (apiUrl) {
        (MapboxGl as any).config.API_URL = apiUrl;
      }

      const opts: MapboxGl.MapboxOptions = {
        preserveDrawingBuffer,
        hash,
        zoom: zoom ? zoom[0] : defaultZoom[0],
        minZoom,
        maxZoom,
        maxBounds,
        bearing,
        container: this.container,
        center:
          fitBounds && center === defaultCenter
            ? this.calcCenter(fitBounds)
            : center,
        pitch,
        style,
        scrollZoom,
        attributionControl,
        interactive,
        dragRotate,
        renderWorldCopies,
        trackResize,
        touchZoomRotate,
        doubleClickZoom,
        keyboard,
        dragPan,
        boxZoom,
        refreshExpiredTiles,
        logoPosition: logoPosition as any,
        classes,
        bearingSnap,
        failIfMajorPerformanceCaveat
      };

      const map = new MapboxGl.Map(opts);
      this.setState({ map });

      if (fitBounds) {
        map.fitBounds(fitBounds, fitBoundsOptions);
      }

      map.on('load', (evt: React.SyntheticEvent<any>) => {
        if (this._isMounted) {
          this.setState({ ready: true });
        }

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
      this._isMounted = false;

      if (map) {
        map.remove();
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

      const didZoomUpdate =
        this.props.zoom !== nextProps.zoom &&
        (nextProps.zoom && nextProps.zoom[0]) !== zoom;

      const didCenterUpdate =
        this.props.center !== nextProps.center &&
        ((nextProps.center && nextProps.center[0]) !== center.lng ||
          (nextProps.center && nextProps.center[1]) !== center.lat);

      const didBearingUpdate =
        this.props.bearing !== nextProps.bearing &&
        nextProps.bearing !== bearing;

      const didPitchUpdate =
        this.props.pitch !== nextProps.pitch && nextProps.pitch !== pitch;

      if (nextProps.maxBounds) {
        const didMaxBoundsUpdate = this.props.maxBounds !== nextProps.maxBounds;

        if (didMaxBoundsUpdate) {
          map.setMaxBounds(nextProps.maxBounds);
        }
      }

      if (nextProps.fitBounds) {
        const { fitBounds } = this.props;

        const didFitBoundsUpdate =
          fitBounds !== nextProps.fitBounds || // Check for reference equality
          nextProps.fitBounds.length !== (fitBounds && fitBounds.length) || // Added element
          !!fitBounds.filter((c, i) => {
            // Check for equality
            const nc = nextProps.fitBounds && nextProps.fitBounds[i];
            return c[0] !== (nc && nc[0]) || c[1] !== (nc && nc[1]);
          })[0];

        if (didFitBoundsUpdate) {
          map.fitBounds(nextProps.fitBounds, nextProps.fitBoundsOptions);
        }
      }

      if (
        didZoomUpdate ||
        didCenterUpdate ||
        didBearingUpdate ||
        didPitchUpdate
      ) {
        const mm: string = nextProps.movingMethod || defaultMovingMethod;
        const { flyToOptions, animationOptions } = nextProps;

        map[mm]({
          ...animationOptions,
          ...flyToOptions,
          zoom: didZoomUpdate && nextProps.zoom ? nextProps.zoom[0] : zoom,
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

    private setRef = (x: HTMLElement | null) => {
      this.container = x!;
    };

    public render() {
      const { containerStyle, className, children } = this.props;
      const { ready } = this.state;

      return (
        <div
          ref={this.setRef}
          className={className}
          style={{ ...containerStyle, ...defaultContainerStyle }}
        >
          {ready && children}
        </div>
      );
    }
  };
}

export default ReactMapboxFactory;
