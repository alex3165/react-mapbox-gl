/// <reference types="mapbox-gl" />
/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Map, GeoJSONSource, GeoJSONSourceRaw, Layer } from 'mapbox-gl';
import { TilesJson } from './util/types';
export interface Context {
    map: Map;
}
export interface Props {
    id: string;
    geoJsonSource?: GeoJSONSourceRaw;
    tileJsonSource?: TilesJson;
    onSourceAdded?: (source: GeoJSONSource | TilesJson) => void;
    onSourceLoaded?: (source: GeoJSONSource | TilesJson) => void;
}
export interface LayerWithBefore extends Layer {
    before?: string;
}
export default class Source extends React.Component<Props> {
    context: Context;
    static contextTypes: {
        map: PropTypes.Requireable<any>;
    };
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
