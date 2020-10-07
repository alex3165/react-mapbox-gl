/// <reference types="mapbox-gl" />
/// <reference types="react" />
import * as React from 'react';
import * as GeoJSON from 'geojson';
import { Point } from 'mapbox-gl';
import { Anchor } from './util/types';
export interface Props {
    coordinates: GeoJSON.Position;
    anchor?: Anchor;
    offset?: number | number[] | Point;
    children?: JSX.Element;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    style?: React.CSSProperties;
    className?: string;
    tabIndex?: number;
}
declare const Marker: React.StatelessComponent<Props>;
export default Marker;
