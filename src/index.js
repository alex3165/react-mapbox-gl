// Add a style tag to the document's head for the map's styling
import injectCSS from "./util/inject-css";
injectCSS(window);

import Map from "./map";
import Layer from "./layer";
import Feature from "./feature";
import ZoomControl from "./zoom-control";
import Popup from "./popup";
import ScaleControl from "./scale-control";

export {
  Feature,
  Layer,
  Map,
  Popup,
  ZoomControl,
  ScaleControl
};

export default Map;

