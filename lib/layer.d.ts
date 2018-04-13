/// <reference types="mapbox-gl" />
/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as MapboxGL from 'mapbox-gl';
import { Context } from './util/types';
export declare type Paint = MapboxGL.BackgroundPaint | MapboxGL.FillPaint | MapboxGL.FillExtrusionPaint | MapboxGL.SymbolPaint | MapboxGL.LinePaint | MapboxGL.RasterPaint | MapboxGL.CirclePaint;
export declare type Layout = MapboxGL.BackgroundLayout | MapboxGL.FillLayout | MapboxGL.FillExtrusionLayout | MapboxGL.LineLayout | MapboxGL.SymbolLayout | MapboxGL.RasterLayout | MapboxGL.CircleLayout;
export interface ImageOptions {
    width?: number;
    height?: number;
    pixelRatio?: number;
}
export declare type ImageDefinition = [string, HTMLImageElement];
export declare type ImageDefinitionWithOptions = [string, HTMLImageElement, ImageOptions];
export interface LayerCommonProps {
    type?: 'symbol' | 'line' | 'fill' | 'circle' | 'raster' | 'fill-extrusion' | 'background' | 'heatmap';
    sourceId?: string;
    images?: ImageDefinition | ImageDefinition[] | ImageDefinitionWithOptions | ImageDefinitionWithOptions[];
    before?: string;
    paint?: Paint;
    layout?: Layout;
    metadata?: any;
    sourceLayer?: string;
    minZoom?: number;
    maxZoom?: number;
    geoJSONSourceOptions?: MapboxGL.GeoJSONSourceOptions;
    filter?: any[];
    children?: JSX.Element | JSX.Element[];
}
export interface OwnProps {
    id: string;
    draggedChildren?: JSX.Element[];
}
export declare type Props = LayerCommonProps & OwnProps;
export default class Layer extends React.Component<Props> {
    context: Context;
    static contextTypes: {
        map: PropTypes.Requireable<any>;
    };
    static defaultProps: {
        type: "symbol";
        layout: {};
        paint: {};
    };
    private source;
    private geometry;
    private makeFeature;
    private initialize;
    private onStyleDataChange;
    componentWillMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(props: Props): void;
    getChildren: () => JSX.Element[];
    render(): null;
}
