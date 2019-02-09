import * as React from 'react';
import { Map } from 'mapbox-gl';
import { AnchorLimits } from './util/types';
export declare type Measurement = 'km' | 'mi';
export interface Props {
    measurement?: Measurement;
    position?: AnchorLimits;
    style?: React.CSSProperties;
    className?: string;
    tabIndex?: number;
    map: Map;
}
export interface State {
    chosenScale: number;
    scaleWidth: number;
}
export declare class ScaleControl extends React.Component<Props, State> {
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
    private _getDistanceTwoPoints;
    private _deg2rad;
    private _displayMeasurement;
    render(): JSX.Element;
}
declare const _default: <T>(props: T) => JSX.Element;
export default _default;
