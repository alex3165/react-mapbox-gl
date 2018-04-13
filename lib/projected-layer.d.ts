/// <reference types="mapbox-gl" />
/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Map, Point } from 'mapbox-gl';
import { OverlayParams } from './util/overlays';
import { Anchor } from './util/types';
export interface Props {
    type: 'marker' | 'popup';
    coordinates: number[];
    anchor?: Anchor;
    offset?: number | number[] | Point;
    children?: JSX.Element | JSX.Element[];
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onScroll?: React.UIEventHandler<HTMLDivElement>;
    onWheel?: React.MouseEventHandler<HTMLDivElement>;
    style?: React.CSSProperties;
    className: string;
    tabIndex?: number;
}
export interface Context {
    map: Map;
}
export default class ProjectedLayer extends React.Component<Props, OverlayParams> {
    context: Context;
    private container;
    private prevent;
    static contextTypes: {
        map: PropTypes.Requireable<any>;
    };
    static defaultProps: {
        offset: number;
        onClick: (...args: any[]) => any[];
    };
    state: OverlayParams;
    private setContainer;
    private handleMapMove;
    componentDidMount(): void;
    private havePropsChanged(props, nextProps);
    componentWillReceiveProps(nextProps: Props): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
