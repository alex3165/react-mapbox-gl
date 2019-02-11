import * as React from 'react';
import * as MapboxGl from 'mapbox-gl';
export declare const MapContext: React.Context<MapboxGl.Map | undefined>;
export declare function withMap(Component: React.ComponentClass<any>): <T>(props: T) => JSX.Element;
