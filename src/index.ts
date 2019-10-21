// Add a style tag to the document's head for the map's styling
import Map from './map';
import BaseLayer from './layer';
import layerMouseTouchEvents from './layer-events-hoc';
import GeoJSONLayer from './geojson-layer';
import Feature from './feature';
import ZoomControl from './zoom-control';
import Popup from './popup';
import ScaleControl from './scale-control';
import Marker from './marker';
import Source from './source';
import Cluster from './cluster';
import RotationControl from './rotation-control';
import Image from './image';
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

export default Map;
