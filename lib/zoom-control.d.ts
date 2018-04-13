/// <reference types="mapbox-gl" />
/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Map } from 'mapbox-gl';
import { AnchorLimits } from './util/types';
export interface Props {
    zoomDiff?: number;
    onControlClick?: (map: Map, zoomDiff: number) => void;
    position?: AnchorLimits;
    style?: React.CSSProperties;
    className?: string;
    tabIndex?: number;
}
export interface State {
    hover?: number;
}
export interface Context {
    map: Map;
}
export default class ZoomControl extends React.Component<Props, State> {
    context: Context;
    static defaultProps: {
        position: string;
        zoomDiff: number;
        onControlClick: (map: Map, zoomDiff: number) => void;
    };
    state: {
        hover: undefined;
    };
    static contextTypes: {
        map: PropTypes.Requireable<any>;
    };
    private onMouseOut;
    private plusOver;
    private minusOver;
    private onClickPlus;
    private onClickMinus;
    render(): JSX.Element;
}
