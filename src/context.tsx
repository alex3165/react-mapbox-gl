import * as React from 'react';
import * as MapboxGl from 'mapbox-gl';

export const MapContext = React.createContext(undefined) as React.Context<
  MapboxGl.Map | undefined
>;

// tslint:disable-next-line:no-any
export function withMap(Component: React.ComponentClass<any>) {
  return function MappedComponent<T>(props: T) {
    return (
      <MapContext.Consumer>
        {map => <Component map={map} {...props} />}
      </MapContext.Consumer>
    );
  };
}
