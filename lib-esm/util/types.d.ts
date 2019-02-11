import { VectorSource, RasterSource, GeoJSONSource, GeoJSONSourceRaw, RasterDemSource, ImageSource, VideoSource, Point } from 'mapbox-gl';
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
export declare type Sources = VectorSource | RasterSource | GeoJSONSource | GeoJSONSourceRaw | ImageSource | VideoSource | RasterDemSource;
export declare type TilesJson = VectorSource | RasterSource;
export declare type LayerType = 'fill' | 'line' | 'symbol' | 'circle' | 'fill-extrusion' | 'raster' | 'background';
export declare type AnyShapeCoordinates = number[] | number[][] | number[][][] | number[][][][];
