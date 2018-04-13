/// <reference types="mapbox-gl" />
/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as MapboxGL from 'mapbox-gl';
import { SourceOptionData, Context } from './util/types';
export declare type MouseEvent = (evt: any) => any;
export interface LineProps {
    linePaint?: MapboxGL.LinePaint;
    lineLayout?: MapboxGL.LineLayout;
    lineOnMouseMove?: MouseEvent;
    lineOnMouseEnter?: MouseEvent;
    lineOnMouseLeave?: MouseEvent;
    lineOnMouseDown?: MouseEvent;
    lineOnMouseUp?: MouseEvent;
    lineOnClick?: MouseEvent;
}
export interface CircleProps {
    circlePaint?: MapboxGL.CirclePaint;
    circleLayout?: MapboxGL.CircleLayout;
    circleOnMouseMove?: MouseEvent;
    circleOnMouseEnter?: MouseEvent;
    circleOnMouseLeave?: MouseEvent;
    circleOnMouseDown?: MouseEvent;
    circleOnMouseUp?: MouseEvent;
    circleOnClick?: MouseEvent;
}
export interface SymbolProps {
    symbolLayout?: MapboxGL.SymbolLayout;
    symbolPaint?: MapboxGL.SymbolPaint;
    symbolOnMouseMove?: MouseEvent;
    symbolOnMouseEnter?: MouseEvent;
    symbolOnMouseLeave?: MouseEvent;
    symbolOnMouseDown?: MouseEvent;
    symbolOnMouseUp?: MouseEvent;
    symbolOnClick?: MouseEvent;
}
export interface FillProps {
    fillLayout?: MapboxGL.FillLayout;
    fillPaint?: MapboxGL.FillPaint;
    fillOnMouseMove?: MouseEvent;
    fillOnMouseEnter?: MouseEvent;
    fillOnMouseLeave?: MouseEvent;
    fillOnMouseDown?: MouseEvent;
    fillOnMouseUp?: MouseEvent;
    fillOnClick?: MouseEvent;
}
export interface FillExtrusionProps {
    fillExtrusionLayout?: MapboxGL.FillExtrusionLayout;
    fillExtrusionPaint?: MapboxGL.FillExtrusionPaint;
    fillExtrusionOnMouseMove?: MouseEvent;
    fillExtrusionOnMouseEnter?: MouseEvent;
    fillExtrusionOnMouseLeave?: MouseEvent;
    fillExtrusionOnMouseDown?: MouseEvent;
    fillExtrusionOnMouseUp?: MouseEvent;
    fillExtrusionOnClick?: MouseEvent;
}
export interface Props extends LineProps, CircleProps, SymbolProps, FillProps, FillExtrusionProps {
    id?: string;
    data: SourceOptionData;
    layerOptions?: MapboxGL.Layer;
    sourceOptions?: MapboxGL.VectorSource | MapboxGL.RasterSource | MapboxGL.GeoJSONSource | MapboxGL.GeoJSONSourceRaw;
    before?: string;
}
export default class GeoJSONLayer extends React.Component<Props> {
    context: Context;
    static contextTypes: {
        map: PropTypes.Requireable<any>;
    };
    private id;
    private source;
    private layerIds;
    private buildLayerId;
    private createLayer;
    private mapLayerMouseHandlers;
    private onStyleDataChange;
    private initialize();
    private unbind();
    componentWillMount(): void;
    componentWillUnmount(): void;
    isGeoJSONSource: (source?: MapboxGL.VectorSource | MapboxGL.RasterSource | MapboxGL.GeoJSONSource | MapboxGL.ImageSource | MapboxGL.VideoSource | MapboxGL.GeoJSONSourceRaw | undefined) => source is MapboxGL.GeoJSONSource;
    componentWillReceiveProps(props: Props): void;
    render(): null;
}
