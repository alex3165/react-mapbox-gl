import * as MapboxGL from 'mapbox-gl';

export type Sources = (
  MapboxGL.VectorSource |
  MapboxGL.RasterSource |
  MapboxGL.GeoJSONSource |
  MapboxGL.GeoJSONSourceRaw
);

export type SourceOptionData = (
  GeoJSON.Feature<GeoJSON.GeometryObject> |
  GeoJSON.FeatureCollection<GeoJSON.GeometryObject> |
  string
);

export interface Feature {
  type: string;
  geometry: {
    type: string;
    coordinates: GeoJSON.Position;
  };
  properties: any;
};

export interface TilesJson {
  type: string;
  tiles?: string[];
  url?: string;
  maxzoom: number;
  minzoom: number;
  tileSize?: number;
};
