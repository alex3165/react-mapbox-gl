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
