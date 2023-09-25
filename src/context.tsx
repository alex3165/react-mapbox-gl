import * as React from 'react';
import * as MapboxGl from 'mapbox-gl';

export const MapContext = React.createContext<MapboxGl.Map | undefined>(
  undefined
);

export function withMap<T extends { map: MapboxGl.Map | undefined }>(
  Component: React.ComponentType<T>
) {
  return function MappedComponent(
    props: Omit<T, 'map'> & { map?: MapboxGl.Map | undefined }
  ) {
    return (
      <MapContext.Consumer>
        {map => <Component map={map} {...props as T} />}
      </MapContext.Consumer>
    );
  };
}
