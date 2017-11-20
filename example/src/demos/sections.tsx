import * as React from 'react';
import LondonCycleMap from './londonCycle';
const LondonCycleMapRaw = require('raw-loader!./raws/londonCycle.raw');

import AllShapes from './allShapes';
const AllShapesRaw = require('raw-loader!./raws/allShapes.raw');

import HtmlFeatures from './htmlFeatures';
const HtmlFeaturesRaw = require('raw-loader!./raws/htmlFeatures.raw');

import ThreeDMap from './threeDMap';
const ThreeDMapRaw = require('raw-loader!./raws/threeDMap.raw');

import HtmlCluster from './htmlCluster';
const HtmlClusterRaw = require('raw-loader!./raws/htmlCluster.raw');

import SwitchStyle from './switchStyle';
const SwitchStyleRaw = require('raw-loader!./raws/switchStyle.raw');

import GeoJsonLayer from './geojsonLayer';
const GeoJsonLayerRaw = require('raw-loader!./raws/geojsonLayer.raw');

import Heatmap from './heatmap';
const HeatmapRaw = require('raw-loader!./raws/heatmap.raw');

import { Live } from '../live';

export const sections = [
  {
    shortTitle: 'london-cycle',
    title: 'Bike stations in London',
    components: ['ReactMapboxGl', 'Layer', 'Feature'],
    DemoComponent: LondonCycleMap,
    reactLive: <Live raw={LondonCycleMapRaw} />
  },
  {
    shortTitle: 'heatmap',
    title: 'Heatmap of London house prices',
    components: ['ReactMapboxGl', 'Layer', 'Feature'],
    DemoComponent: Heatmap,
    reactLive: <Live raw={HeatmapRaw} />
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
    reactLive: <Live raw={AllShapesRaw} />
  },
  {
    shortTitle: 'html-marker',
    title: 'Html features (Marker)',
    components: ['ReactMapboxGl', 'Marker'],
    DemoComponent: HtmlFeatures,
    reactLive: <Live raw={HtmlFeaturesRaw} />
  },
  {
    shortTitle: '3d-map',
    title: '3D extrusion map',
    components: ['ReactMapboxGl', 'Layer'],
    DemoComponent: ThreeDMap,
    reactLive: <Live raw={ThreeDMapRaw} />
  },
  {
    shortTitle: 'html-cluster',
    title: 'Cluster of Html markers',
    components: ['ReactMapboxGl', 'Marker', 'Cluster'],
    DemoComponent: HtmlCluster,
    reactLive: <Live raw={HtmlClusterRaw} />
  },
  {
    shortTitle: 'switch-style',
    title: 'Swap Mapbox map style',
    components: ['ReactMapboxGl', 'Source', 'Layer', 'Feature'],
    DemoComponent: SwitchStyle,
    reactLive: <Live raw={SwitchStyleRaw} />
  },
  {
    shortTitle: 'geojson-data',
    title: 'Display data from GeoJson',
    components: ['ReactMapboxGl', 'GeoJsonLayer'],
    DemoComponent: GeoJsonLayer,
    reactLive: <Live raw={GeoJsonLayerRaw} />
  }
];
