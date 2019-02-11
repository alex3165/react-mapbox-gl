import * as React from 'react';
import { Map } from 'mapbox-gl';
import { AnchorLimits } from './util/types';
export interface Props {
    zoomDiff?: number;
    onControlClick?: (map: Map, zoomDiff: number) => void;
    position?: AnchorLimits;
    style?: React.CSSProperties;
    className?: string;
    tabIndex?: number;
    map: Map;
}
export interface State {
    hover?: number;
}
export declare class ZoomControl extends React.Component<Props, State> {
    static defaultProps: {
        position: string;
        zoomDiff: number;
        onControlClick: (map: Map, zoomDiff: number) => void;
    };
    state: {
        hover: undefined;
    };
    private onMouseOut;
    private plusOver;
    private minusOver;
    private onClickPlus;
    private onClickMinus;
    render(): JSX.Element;
}
declare const _default: <T>(props: T) => JSX.Element;
export default _default;
