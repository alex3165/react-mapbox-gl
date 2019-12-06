// Add a style tag to the document's head for the map's styling
import Map, { Props as MapProps } from './map';
import { Events as MapEvents } from './map-events';
import BaseLayer, { Props as BaseLayerProps } from './layer';
import layerMouseTouchEvents from './layer-events-hoc';
import GeoJSONLayer, { Props as GeoJSONLayerProps } from './geojson-layer';
import Feature, { Props as FeatureProps } from './feature';
import ZoomControl, { Props as ZoomControlProps } from './zoom-control';
import Popup, { Props as PopupProps } from './popup';
import ScaleControl, { Props as ScaleControlProps } from './scale-control';
import Marker, { Props as MarkerProps } from './marker';
import Source, { Props as SourceProps } from './source';
import Cluster, { Props as ClusterProps } from './cluster';
import RotationControl, {
  Props as RotationControlProps
} from './rotation-control';
import Image, { Props as ImageProps } from './image';
import { withMap, MapContext } from './context';

const Layer = withMap(layerMouseTouchEvents(BaseLayer));

export {
  Feature,
  Layer,
  GeoJSONLayer,
  Map,
  Popup,
  ZoomControl,
  ScaleControl,
  Marker,
  Source,
  Cluster,
  RotationControl,
  Image,
  MapContext
};

export {
  MapProps,
  MapEvents,
  BaseLayerProps,
  GeoJSONLayerProps,
  FeatureProps,
  ZoomControlProps,
  PopupProps,
  ScaleControlProps,
  MarkerProps,
  SourceProps,
  ClusterProps,
  RotationControlProps,
  ImageProps
};

export default Map;
