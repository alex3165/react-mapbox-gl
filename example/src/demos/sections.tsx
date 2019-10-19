import * as React from 'react';
import LondonCycleMap from './londonCycle';
import AllShapes from './allShapes';
import HtmlFeatures from './htmlFeatures';
import ThreeDMap from './threeDMap';
import HtmlCluster from './htmlCluster';
import SwitchStyle from './switchStyle';
import GeoJsonLayer from './geojsonLayer';
import Heatmap from './heatmap';
import { Live } from '../live';
import raw from 'raw.macro';

const LondonCycleMapRaw = raw('./raws/londonCycle.raw');
const AllShapesRaw = raw('./raws/allShapes.raw');
const HtmlFeaturesRaw = raw('./raws/htmlFeatures.raw');
const ThreeDMapRaw = raw('./raws/threeDMap.raw');
const HtmlClusterRaw = raw('./raws/htmlCluster.raw');
const SwitchStyleRaw = raw('./raws/switchStyle.raw');
const GeoJsonLayerRaw = raw('./raws/geojsonLayer.raw');
const HeatmapRaw = raw('./raws/heatmap.raw');

export const sections = [
  {
    shortTitle: 'london-cycle',
    title: 'Bike stations in London',
    components: ['ReactMapboxGl', 'Layer', 'Feature'],
    DemoComponent: LondonCycleMap,
    reactLive: <Live full={true} raw={LondonCycleMapRaw} />
  },
  {
    shortTitle: 'heatmap',
    title: 'Heatmap of London house prices',
    components: ['ReactMapboxGl', 'Layer', 'Feature'],
    DemoComponent: Heatmap,
    reactLive: <Live full={true} raw={HeatmapRaw} />
  },
  {
    shortTitle: 'all-shapes',
    title: 'Mapbox webgl shapes',
    components: [
      'ReactMapboxGl',
      'Layer',
      'Feature',
      'ScaleControl',
      'ZoomControl',
      'RotationControl'
    ],
    DemoComponent: AllShapes,
    reactLive: <Live full={true} raw={AllShapesRaw} />
  },
  {
    shortTitle: 'html-marker',
    title: 'Html features (Marker)',
    components: ['ReactMapboxGl', 'Marker'],
    DemoComponent: HtmlFeatures,
    reactLive: <Live full={true} raw={HtmlFeaturesRaw} />
  },
  {
    shortTitle: '3d-map',
    title: '3D extrusion map',
    components: ['ReactMapboxGl', 'Layer'],
    DemoComponent: ThreeDMap,
    reactLive: <Live full={true} raw={ThreeDMapRaw} />
  },
  {
    shortTitle: 'html-cluster',
    title: 'Cluster of Html markers',
    components: ['ReactMapboxGl', 'Marker', 'Cluster'],
    DemoComponent: HtmlCluster,
    reactLive: <Live full={true} raw={HtmlClusterRaw} />
  },
  {
    shortTitle: 'switch-style',
    title: 'Swap Mapbox map style',
    components: ['ReactMapboxGl', 'Source', 'Layer', 'Feature'],
    DemoComponent: SwitchStyle,
    reactLive: <Live full={true} raw={SwitchStyleRaw} />
  },
  {
    shortTitle: 'geojson-data',
    title: 'Display data from GeoJson',
    components: ['ReactMapboxGl', 'GeoJsonLayer'],
    DemoComponent: GeoJsonLayer,
    reactLive: <Live full={true} raw={GeoJsonLayerRaw} />
  }
];
