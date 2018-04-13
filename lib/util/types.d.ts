/// <reference types="mapbox-gl" />
import { VectorSource, RasterSource, GeoJSONSource, GeoJSONSourceRaw, ImageSource, VideoSource, Point, Map } from 'mapbox-gl';
export interface AnchorOffsetLimits {
    'top-left': Point;
    'top-right': Point;
    'bottom-left': Point;
    'bottom-right': Point;
}
export interface AnchorsOffset extends AnchorOffsetLimits {
    center: Point;
    top: Point;
    bottom: Point;
    left: Point;
    right: Point;
}
export declare type Anchor = keyof AnchorsOffset;
export declare type AnchorLimits = keyof AnchorOffsetLimits;
export declare type Sources = VectorSource | RasterSource | GeoJSONSource | GeoJSONSourceRaw | ImageSource | VideoSource;
export declare type SourceOptionData = GeoJSON.Feature<GeoJSON.GeometryObject> | GeoJSON.FeatureCollection<GeoJSON.GeometryObject> | string;
export interface Feature {
    type: 'Feature';
    geometry: {
        type: string;
        coordinates: GeoJSON.Position;
    };
    properties: any;
}
export declare type TilesJson = VectorSource | RasterSource;
export interface Context {
    map: Map;
}
export declare type LayerType = 'fill' | 'line' | 'symbol' | 'circle' | 'fill-extrusion' | 'raster' | 'background';
export declare type AnyShapeCoordinates = number[] | number[][] | number[][][] | number[][][][];
