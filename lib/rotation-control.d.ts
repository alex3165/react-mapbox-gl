/// <reference types="react" />
/// <reference types="mapbox-gl" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Map } from 'mapbox-gl';
import { AnchorLimits } from './util/types';
export interface Props {
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
export default class RotationControl extends React.Component<Props, State> {
    context: Context;
    static defaultProps: {
        position: string;
    };
    state: {
        hover: undefined;
    };
    static contextTypes: {
        map: PropTypes.Requireable<any>;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    compassIcon: HTMLSpanElement | null;
    private onMouseOut;
    private onMouseIn;
    private onClickCompass;
    private onMapRotate;
    private assignRef;
    render(): JSX.Element;
}
