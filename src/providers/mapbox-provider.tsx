import React, { useEffect } from 'react';
import { RequestTransformFunction } from '../map';
import * as MapboxGl from 'mapbox-gl';

// Static Properties of the map
export interface MapboxConfiguration {
  accessToken: string;
  apiUrl?: string;
  minZoom?: number;
  maxZoom?: number;
  hash?: boolean;
  preserveDrawingBuffer?: boolean;
  scrollZoom?: boolean;
  interactive?: boolean;
  dragRotate?: boolean;
  pitchWithRotate?: boolean;
  attributionControl?: boolean;
  customAttribution?: string | string[];
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
  transformRequest?: RequestTransformFunction;
  antialias?: boolean;
  mapInstance?: MapboxGl.Map;
}

export const MapboxContext = React.createContext<MapboxConfiguration>({
  accessToken: ''
});

export const useMapbox = () => React.useContext(MapboxContext);

export function MapboxProvider({
  accessToken,
  apiUrl,
  minZoom = 0,
  maxZoom = 20,
  hash = false,
  preserveDrawingBuffer = false,
  scrollZoom = true,
  interactive = true,
  dragRotate = true,
  pitchWithRotate = true,
  attributionControl = true,
  customAttribution,
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
  antialias = false,
  mapInstance,
  transformRequest,
  children
}: React.PropsWithChildren<MapboxConfiguration>) {
  useEffect(
    () => {
      // tslint:disable-next-line:no-any
      (MapboxGl as any).accessToken = accessToken;

      if (apiUrl) {
        // tslint:disable-next-line:no-any
        (MapboxGl as any).config.API_URL = apiUrl;
      }
    },
    [accessToken, apiUrl]
  );

  return (
    <MapboxContext.Provider
      value={{
        accessToken,
        apiUrl,
        minZoom,
        maxZoom,
        hash,
        preserveDrawingBuffer,
        scrollZoom,
        interactive,
        dragRotate,
        pitchWithRotate,
        attributionControl,
        customAttribution,
        logoPosition,
        renderWorldCopies,
        trackResize,
        touchZoomRotate,
        doubleClickZoom,
        keyboard,
        dragPan,
        boxZoom,
        refreshExpiredTiles,
        failIfMajorPerformanceCaveat,
        bearingSnap,
        antialias,
        mapInstance,
        transformRequest
      }}
    >
      {children}
    </MapboxContext.Provider>
  );
}

interface InjectedProps {
  config: MapboxConfiguration;
}

// Required until typescript is upgraded
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withMapbox<Props extends InjectedProps>(
  Wrapped: React.ComponentType<Props>
) {
  const Wrapper: React.FC<Omit<Props, 'config'>> = props => {
    const config = useMapbox();

    return <Wrapped {...props as Props} config={config} />;
  };

  Wrapper.displayName = `withMapbox(${Wrapped.displayName})`;

  return Wrapper;
}
