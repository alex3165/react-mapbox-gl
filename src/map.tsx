import * as MapboxGl from 'mapbox-gl';
import * as React from 'react';
import { createPortal } from 'react-dom';
import {
  Events,
  events,
  Listeners,
  listenEvents,
  updateEvents
} from './map-events';
import { MapContext } from './context';
import { MapboxConfiguration, withMapbox } from './providers/mapbox-provider';

const isEqual = require('deep-equal'); //tslint:disable-line

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
  offset?: MapboxGl.Point | [number, number];
  maxZoom?: number;
  duration?: number;
}

export type LngLat = [number, number];

export type FitBounds = [LngLat, LngLat];

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

export enum MovingMethod {
  JumpTo = 'jumpTo',
  EaseTo = 'easeTo',
  FlyTo = 'flyTo'
}

// React Props updated between re-render
export interface Props {
  style: string | MapboxGl.Style;
  config: MapboxConfiguration;
  center?: LngLat;
  zoom?: [number] | number;
  maxBounds?: MapboxGl.LngLatBounds | FitBounds;
  fitBounds?: FitBounds;
  fitBoundsOptions?: FitBoundsOptions;
  bearing?: [number] | number;
  pitch?: [number] | number;
  containerStyle?: React.CSSProperties;
  className?: string;
  movingMethod?: MovingMethod;
  animationOptions?: Partial<AnimationOptions>;
  flyToOptions?: Partial<FlyToOptions>;
  children?: JSX.Element | JSX.Element[] | Array<JSX.Element | undefined>;
  renderChildrenInPortal?: boolean;
}

export interface State {
  map?: MapboxGl.Map;
  ready: boolean;
}

export type RequestTransformFunction = (
  url: string,
  resourceType: any // tslint:disable-line:no-any
) => any; // tslint:disable-line:no-any

// Satisfy typescript pitfall with defaultProps
const defaultZoom = [11] as [number];
const defaultMovingMethod = MovingMethod.FlyTo;
const defaultCenter = [-0.2416815, 51.5285582] as LngLat;
const defaultContainerStyle: React.CSSProperties = {
  textAlign: 'left'
};

// tslint:disable-next-line:no-namespace
declare global {
  namespace mapboxgl {
    export interface MapboxOptions {
      failIfMajorPerformanceCaveat?: boolean;
      transformRequest?: MapboxGl.TransformRequestFunction;
    }
  }
}

class Map extends React.Component<Props & Events, State> {
  public static defaultProps = {
    onStyleLoad: () => null,
    center: defaultCenter,
    zoom: defaultZoom,
    bearing: 0,
    movingMethod: defaultMovingMethod,
    pitch: 0,
    containerStyle: defaultContainerStyle,
    config: {
      accessToken: ''
    }
  };

  constructor(props: Props & Events) {
    super(props);

    this.state = {
      map: props.config.mapInstance,
      ready: false
    };
  }

  public listeners: Listeners = {};

  // tslint:disable-next-line:variable-name
  public _isMounted = true;

  public container?: HTMLElement;

  public calcCenter = (bounds: FitBounds): [number, number] => [
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

    if (!Array.isArray(zoom)) {
      throw new Error(
        'zoom need to be an array type of length 1 for reliable update'
      );
    }

    const {
      preserveDrawingBuffer,
      hash,
      minZoom,
      maxZoom,
      scrollZoom,
      attributionControl,
      customAttribution,
      interactive,
      dragRotate,
      pitchWithRotate,
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
      antialias,
      transformRequest
    } = this.props.config;

    const opts: MapboxGl.MapboxOptions = {
      preserveDrawingBuffer,
      hash,
      zoom: zoom[0],
      minZoom,
      maxZoom,
      maxBounds,
      container: this.container!,
      center:
        fitBounds && center === defaultCenter
          ? this.calcCenter(fitBounds)
          : center,
      style,
      scrollZoom,
      attributionControl,
      customAttribution,
      interactive,
      dragRotate,
      pitchWithRotate,
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
      antialias,
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

    // This is a hack to allow injecting the map instance, which assists
    // in testing and theoretically provides a means for users to inject
    // their own map instance.
    let map = this.state.map;

    if (!map) {
      map = new MapboxGl.Map(opts);
      this.setState({ map });
    }

    if (fitBounds) {
      map.fitBounds(fitBounds, fitBoundsOptions, { fitboundUpdate: true });
    }

    // tslint:disable-next-line:no-any
    map.on('load', (evt: React.SyntheticEvent<any>) => {
      if (this._isMounted) {
        this.setState({ ready: true });
      }

      if (onStyleLoad) {
        onStyleLoad(map!, evt);
      }
    });

    this.listeners = listenEvents(events, this.props, map);
  }

  public componentWillUnmount() {
    const { map } = this.state;
    this._isMounted = false;

    if (map) {
      map.remove();
    }
  }

  public componentDidUpdate(prevProps: Props & Events) {
    const { map } = this.state;
    if (!map) {
      return null;
    }

    // Update event listeners
    this.listeners = updateEvents(this.listeners, this.props, map);

    const center = map.getCenter();
    const zoom = map.getZoom();
    const bearing = map.getBearing();
    const pitch = map.getPitch();

    const didZoomUpdate =
      prevProps.zoom !== this.props.zoom &&
      (this.props.zoom && this.props.zoom[0]) !== zoom;

    const didCenterUpdate =
      prevProps.center !== this.props.center &&
      ((this.props.center && this.props.center[0]) !== center.lng ||
        (this.props.center && this.props.center[1]) !== center.lat);

    const didBearingUpdate =
      prevProps.bearing !== this.props.bearing &&
      (this.props.bearing && this.props.bearing[0]) !== bearing;

    const didPitchUpdate =
      prevProps.pitch !== this.props.pitch &&
      (this.props.pitch && this.props.pitch[0]) !== pitch;

    if (this.props.maxBounds) {
      const didMaxBoundsUpdate = prevProps.maxBounds !== this.props.maxBounds;

      if (didMaxBoundsUpdate) {
        map.setMaxBounds(this.props.maxBounds);
      }
    }

    if (this.props.fitBounds) {
      const { fitBounds } = prevProps;

      const didFitBoundsUpdate =
        fitBounds !== this.props.fitBounds || // Check for reference equality
        this.props.fitBounds.length !== (fitBounds && fitBounds.length) || // Added element
        !!fitBounds.filter((c, i) => {
          // Check for equality
          const nc = this.props.fitBounds && this.props.fitBounds[i];
          return c[0] !== (nc && nc[0]) || c[1] !== (nc && nc[1]);
        })[0];

      if (
        didFitBoundsUpdate ||
        !isEqual(prevProps.fitBoundsOptions, this.props.fitBoundsOptions)
      ) {
        map.fitBounds(this.props.fitBounds, this.props.fitBoundsOptions, {
          fitboundUpdate: true
        });
      }
    }

    if (
      didZoomUpdate ||
      didCenterUpdate ||
      didBearingUpdate ||
      didPitchUpdate
    ) {
      const mm: string = this.props.movingMethod || defaultMovingMethod;
      const { flyToOptions, animationOptions } = this.props;

      map[mm]({
        ...animationOptions,
        ...flyToOptions,
        zoom: didZoomUpdate && this.props.zoom ? this.props.zoom[0] : zoom,
        center: didCenterUpdate ? this.props.center : center,
        bearing: didBearingUpdate ? this.props.bearing : bearing,
        pitch: didPitchUpdate ? this.props.pitch : pitch
      });
    }

    if (!isEqual(prevProps.style, this.props.style)) {
      map.setStyle(this.props.style);
    }

    return null;
  }

  public setRef = (x: HTMLElement | null) => {
    this.container = x!;
  };

  public render() {
    const {
      containerStyle,
      className,
      children,
      renderChildrenInPortal
    } = this.props;

    const { ready, map } = this.state;

    if (renderChildrenInPortal) {
      const container =
        ready && map && typeof map.getCanvasContainer === 'function'
          ? map.getCanvasContainer()
          : undefined;

      return (
        <MapContext.Provider value={map}>
          <div
            ref={this.setRef}
            className={className}
            style={{ ...containerStyle }}
          >
            {ready && container && createPortal(children, container)}
          </div>
        </MapContext.Provider>
      );
    }

    return (
      <MapContext.Provider value={map}>
        <div
          ref={this.setRef}
          className={className}
          style={{ ...containerStyle }}
        >
          {ready && children}
        </div>
      </MapContext.Provider>
    );
  }
}

export default withMapbox(Map);
