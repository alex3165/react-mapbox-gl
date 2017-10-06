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

export interface TilesJson {
  type: string;
  tiles?: string[];
  url?: string;
  maxzoom: number;
  minzoom: number;
  tileSize?: number;
}

export interface Context {
  map: MapboxGL.Map;
}
