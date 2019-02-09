import * as React from 'react';
import { Map, GeoJSONSource, GeoJSONSourceRaw, Layer } from 'mapbox-gl';
import { TilesJson } from './util/types';
export interface Props {
    id: string;
    geoJsonSource?: GeoJSONSourceRaw;
    tileJsonSource?: TilesJson;
    map: Map;
    onSourceAdded?: (source: GeoJSONSource | TilesJson) => void;
    onSourceLoaded?: (source: GeoJSONSource | TilesJson) => void;
}
export interface LayerWithBefore extends Layer {
    before?: string;
}
export declare class Source extends React.Component<Props> {
    private id;
    private onStyleDataChange;
    componentWillMount(): void;
    private initialize;
    private onData;
    removeSource(): LayerWithBefore[];
    componentWillUnmount(): void;
    componentWillReceiveProps(props: Props): void;
    render(): null;
}
declare const _default: <T>(props: T) => JSX.Element;
export default _default;
