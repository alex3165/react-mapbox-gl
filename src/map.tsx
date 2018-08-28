import MapboxGl from 'mapbox-gl';
import React from 'react';
import injectCSS from './util/inject-css';
import {
  Events,
  listenEvents,
  events,
  Listeners,
  updateEvents
} from './map-events';
import { MapProvider } from './map-context';
import isEqual from 'deep-equal';

export interface PaddingOptions {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface FitBoundsOptions {
  linear?: boolean;
  easing?: (time: number) => number;
  padding?: number | PaddingOptions;
  offset?: MapboxGl.Point | number[];
  maxZoom?: number;
  duration?: number;
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
  mapStyle: string | MapboxGl.Style;
  center?: number[];
  zoom?: [number];
  maxBounds?: MapboxGl.LngLatBounds | FitBounds;
  fitBounds?: FitBounds;
  fitBoundsOptions?: FitBoundsOptions;
  bearing?: [number];
  pitch?: [number];
  style?: React.CSSProperties;
  className?: string;
  movingMethod?: 'jumpTo' | 'easeTo' | 'flyTo';
  animationOptions?: Partial<AnimationOptions>;
  flyToOptions?: Partial<FlyToOptions>;
  children?: JSX.Element | JSX.Element[] | Array<JSX.Element | undefined>;
}

export interface State {
  map?: MapboxGl.Map;
  ready: boolean;
}

export type RequestTransformFunction = (
  url: string,
  resourceType: any // tslint:disable-line:no-any
) => any; // tslint:disable-line:no-any

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
  bearingSnap?: number;
  injectCss?: boolean;
  transformRequest?: RequestTransformFunction;
}

// Satisfy typescript pitfall with defaultProps
const defaultZoom = [11];
const defaultMovingMethod = 'flyTo';
const defaultCenter = [-0.2416815, 51.5285582];
const defaultContainerStyle: Pick<React.CSSProperties, 'textAlign'> = {
  textAlign: 'left'
};

// tslint:disable-next-line:no-namespace
declare global {
  namespace mapboxgl {
    export interface MapboxOptions {
      failIfMajorPerformanceCaveat?: boolean;
      transformRequest?: RequestTransformFunction;
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
  bearingSnap = 7,
  injectCss = true,
  transformRequest
}: FactoryParameters) => {
  if (injectCss) {
    injectCSS(window);
  }

  return class ReactMapboxGl extends React.Component<Props & Events, State> {
    public static defaultProps = {
      // tslint:disable-next-line:no-any
      onStyleLoad: (map: MapboxGl.Map, evt: any) => null,
      center: defaultCenter,
      zoom: defaultZoom,
      bearing: 0,
      movingMethod: defaultMovingMethod,
      pitch: 0
    };

    public state = {
      map: undefined,
      ready: false
    };

    public listeners: Listeners = {};

    // tslint:disable-next-line:variable-name
    public _isMounted = true;

    public container: HTMLElement | undefined;

    public calcCenter = (bounds: FitBounds): number[] => [
      (bounds[0][0] + bounds[1][0]) / 2,
      (bounds[0][1] + bounds[1][1]) / 2
    ];

    public componentDidMount() {
      const {
        mapStyle,
        onStyleLoad,
        center,
        pitch,
        zoom,
        fitBounds,
        fitBoundsOptions,
        bearing,
        maxBounds
      } = this.props;

      // tslint:disable-next-line:no-any
      (MapboxGl as any).accessToken = accessToken;
      if (apiUrl) {
        // tslint:disable-next-line:no-any
        (MapboxGl as any).config.API_URL = apiUrl;
      }

      if (!Array.isArray(zoom)) {
        throw new Error(
          'zoom need to be an array type of length 1 for reliable update'
        );
      }

      const opts: MapboxGl.MapboxOptions = {
        preserveDrawingBuffer,
        hash,
        zoom: zoom[0],
        minZoom,
        maxZoom,
        maxBounds,
        container: this.container,
        center:
          fitBounds && center === defaultCenter
            ? this.calcCenter(fitBounds)
            : center,
        style: mapStyle,
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
        logoPosition,
        bearingSnap,
        failIfMajorPerformanceCaveat,
        transformRequest
      };

      if (bearing) {
        if (!Array.isArray(bearing)) {
          throw new Error(
            'bearing need to be an array type of length 1 for reliable update'
          );
        }

        opts.bearing = bearing[0];
      }

      if (pitch) {
        if (!Array.isArray(pitch)) {
          throw new Error(
            'pitch need to be an array type of length 1 for reliable update'
          );
        }

        opts.pitch = pitch[0];
      }
      let map: MapboxGl.Map;
      try {
        map = new MapboxGl.Map(opts);
      } catch (error) {
        console.error(error);
        throw error;
      }
      this.setState({ map });

      if (fitBounds) {
        map.fitBounds(fitBounds, fitBoundsOptions);
      }

      // tslint:disable-next-line:no-any
      map.on('load', (evt: React.SyntheticEvent<any>) => {
        if (this._isMounted) {
          this.setState({ ready: true });
        }

        if (onStyleLoad) {
          onStyleLoad(map, evt);
        }
      });

      this.listeners = listenEvents(events, this.props, map);
    }

    public componentWillUnmount() {
      const { map } = this.state as State;
      this._isMounted = false;

      if (map) {
        map.remove();
      }
    }

    public componentWillReceiveProps(nextProps: Props & Events) {
      const { map } = this.state as State;
      if (!map) {
        return null;
      }

      // Update event listeners
      this.listeners = updateEvents(this.listeners, nextProps, map);

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
        (nextProps.bearing && nextProps.bearing[0]) !== bearing;

      const didPitchUpdate =
        this.props.pitch !== nextProps.pitch &&
        (nextProps.pitch && nextProps.pitch[0]) !== pitch;

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

        if (
          didFitBoundsUpdate ||
          !isEqual(this.props.fitBoundsOptions, nextProps.fitBoundsOptions)
        ) {
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

      if (!isEqual(this.props.mapStyle, nextProps.mapStyle)) {
        map.setStyle(nextProps.mapStyle);
      }

      return null;
    }

    public setRef = (x: HTMLElement | null) => {
      this.container = x!;
    };

    public render() {
      const { style: userStyle, className, children } = this.props;
      const { ready, map } = this.state;
      const style = {
        ...userStyle,
        ...defaultContainerStyle
      };
      return (
        <MapProvider map={map}>
          <div ref={this.setRef} className={className} style={style}>
            {ready && children}
          </div>
        </MapProvider>
      );
    }
  };
};

export default ReactMapboxFactory;
