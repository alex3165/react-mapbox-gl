import {
  VectorSource,
  RasterSource,
  GeoJSONSource,
  GeoJSONSourceRaw,
  ImageSource,
  VideoSource,
  Point,
  Map
} from 'mapbox-gl';

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

export type Anchor = keyof AnchorsOffset;
export type AnchorLimits = keyof AnchorOffsetLimits;

export type Sources =
  | VectorSource
  | RasterSource
  | GeoJSONSource
  | GeoJSONSourceRaw
  | ImageSource
  | VideoSource;

export type SourceOptionData =
  | GeoJSON.Feature<GeoJSON.GeometryObject>
  | GeoJSON.FeatureCollection<GeoJSON.GeometryObject>
  | string;

export interface Feature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: GeoJSON.Position;
  };
  // tslint:disable-next-line:no-any
  properties: any;
}

export type TilesJson = VectorSource | RasterSource;

export interface Context {
  map: Map;
}

export type LayerType =
  | 'fill'
  | 'line'
  | 'symbol'
  | 'circle'
  | 'fill-extrusion'
  | 'raster'
  | 'background';

export type AnyShapeCoordinates =
  | number[]
  | number[][]
  | number[][][]
  | number[][][][];
