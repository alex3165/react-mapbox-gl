import * as MapboxGL from 'mapbox-gl';

export type Sources =
  | MapboxGL.VectorSource
  | MapboxGL.RasterSource
  | MapboxGL.GeoJSONSource
  | MapboxGL.GeoJSONSourceRaw;

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

export type TilesJson = MapboxGL.VectorSource | MapboxGL.RasterSource;

export interface Context {
  map: MapboxGL.Map;
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
