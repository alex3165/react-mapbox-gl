import AllShapes from "./all-shapes";
import LondonCycle from "./london-cycle";
import GeoJSONExample from "./geojson-example";
import Cluster from './cluster';
import StyleUpdate from './style-update';
import CustomVectorTiles from './custom-vector-tiles';
import CustomRasterTiles from './custom-raster-tiles';
import MarkerPopupExample from './components/MarkerPopupExample.js';

export default [
  {
    component: LondonCycle,
    label: "London cycle",
    path: "/london-cycle"
  },
  {
    component: AllShapes,
    label: "All shapes",
    path: "/"
  },
  {
    component: GeoJSONExample,
    label: "GEOJson",
    path: "/geojson"
  },
  {
    component: Cluster,
    label: 'Cluster',
    path: "/cluster"
  },
  {
    component: StyleUpdate,
    label: 'Style update',
    path: "/style-update"
  },
  {
    component: CustomVectorTiles,
    label: 'Custom vector tiles',
    path: "/custom-vector-tiles"
  },
  {
    component: CustomRasterTiles,
    label: 'Custom raster tiles',
    path: "/custom-raster-tiles"
  },
  {
    component: MarkerPopupExample,
    label: 'Marker Popup',
    path: "/marker-popup"
  }
];
