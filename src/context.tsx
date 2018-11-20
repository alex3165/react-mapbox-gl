import * as React from 'react';
import * as MapboxGl from 'mapbox-gl';

type Omit<T, K> = Pick<T, Exclude<keyof T, keyof K>>;

interface ContextProps {
  map: MapboxGl.Map | undefined;
}

export const MapContext = React.createContext(undefined) as React.Context<
  MapboxGl.Map | undefined
>;

export function withMap<Props extends ContextProps>(
  Component: React.ComponentType<Props>
): React.SFC<Omit<Props, ContextProps>> {
  return props => (
    <MapContext.Consumer>
      {map => <Component {...props} map={map} />}
    </MapContext.Consumer>
  );
}
