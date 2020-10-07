/// <reference types="react" />
/// <reference types="mapbox-gl" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Map } from 'mapbox-gl';
import { AnchorLimits } from './util/types';
export declare type Measurement = 'km' | 'mi';
export interface Props {
    measurement?: Measurement;
    position?: AnchorLimits;
    style?: React.CSSProperties;
    className?: string;
    tabIndex?: number;
}
export interface State {
    chosenScale: number;
    scaleWidth: number;
}
export interface Context {
    map: Map;
}
export default class ScaleControl extends React.Component<Props, State> {
    context: Context;
    static contextTypes: {
        map: PropTypes.Requireable<any>;
    };
    static defaultProps: {
        measurement: Measurement;
        position: string;
    };
    state: {
        chosenScale: number;
        scaleWidth: number;
    };
    componentWillMount(): void;
    componentWillUnmount(): void;
    private setScale;
    private _getDistanceTwoPoints(x, y, measurement?);
    private _deg2rad(deg);
    private _displayMeasurement(measurement, chosenScale);
    render(): JSX.Element;
}
