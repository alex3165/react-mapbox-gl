import * as React from 'react';
import * as GeoJSON from 'geojson';
import { Point } from 'mapbox-gl';
import { Anchor } from './util/types';
export interface Props {
    coordinates: GeoJSON.Position;
    anchor?: Anchor;
    offset?: number | number[] | Point;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onScroll?: React.UIEventHandler<HTMLDivElement>;
    onWheel?: React.MouseEventHandler<HTMLDivElement>;
    style?: React.CSSProperties;
    className?: string;
    tabIndex?: number;
}
export declare const defaultClassName: string[];
export default class Popup extends React.Component<Props> {
    render(): JSX.Element;
}
