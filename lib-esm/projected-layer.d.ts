import * as React from 'react';
import { Map, Point } from 'mapbox-gl';
import { OverlayParams } from './util/overlays';
import { Anchor } from './util/types';
export interface Props {
    type: 'marker' | 'popup';
    coordinates: [number, number];
    anchor?: Anchor;
    offset?: number | [number, number] | Point;
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
    map: Map;
}
export declare class ProjectedLayer extends React.Component<Props, OverlayParams> {
    private container;
    private prevent;
    static defaultProps: {
        offset: number;
        onClick: (...args: any[]) => any[];
    };
    state: OverlayParams;
    private setContainer;
    private handleMapMove;
    componentDidMount(): void;
    private havePropsChanged;
    componentWillReceiveProps(nextProps: Props): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
declare const _default: <T>(props: T) => JSX.Element;
export default _default;
