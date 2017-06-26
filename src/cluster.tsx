import * as React from 'react';
const PropTypes = require('prop-types'); // tslint:disable-line

import { Map } from 'mapbox-gl';
import { Props as MarkerProps } from './marker';
const supercluster = require('supercluster'); // tslint:disable-line
import * as GeoJSON from 'geojson';
import { Feature } from './util/types';
import * as bbox from '@turf/bbox';
import { polygon } from '@turf/helpers';

export interface Props {
  ClusterMarkerFactory(
    coordinates: GeoJSON.Position,
    pointCount: number
  ): JSX.Element;
  radius?: number;
  maxZoom?: number;
  minZoom?: number;
  extent?: number;
  nodeSize?: number;
  log?: boolean;
  children?: Array<React.Component<MarkerProps, {}>>;
}

export interface State {
  superC: any;
  clusterPoints: any[];
}

export interface Context {
  map: Map;
}

export default class Cluster extends React.Component<Props, State> {
  public context: Context;

  public static contextTypes = {
    map: PropTypes.object
  };

  public static defaultProps = {
    radius: 60,
    minZoom: 0,
    maxZoom: 16,
    extent: 512,
    nodeSize: 64,
    log: false
  };

  public state = {
    superC: supercluster({
      radius: this.props.radius,
      maxZoom: this.props.maxZoom,
      minZoom: this.props.minZoom,
      extent: this.props.extent,
      nodeSize: this.props.nodeSize,
      log: this.props.log
    }),
    clusterPoints: []
  };

  private featureClusterMap = new WeakMap<
    Feature,
    React.Component<MarkerProps, any>
  >();

  public componentWillMount() {
    const { map } = this.context;
    const { children } = this.props;

    if (children) {
      this.childrenChange(children);
    }

    // TODO: Debounce ?
    map.on('move', this.mapChange);
    map.on('zoom', this.mapChange);
    this.mapChange();
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { children } = this.props;

    if (children !== nextProps.children) {
      this.childrenChange(nextProps.children);
      this.mapChange(true);
    }
  }

  private childrenChange = (newChildren: any) => {
    const { superC } = this.state;
    this.featureClusterMap = new WeakMap<
      Feature,
      React.Component<MarkerProps, any>
    >();
    const features = this.childrenToFeatures(newChildren as any);
    superC.load(features);
  };

  private mapChange = (forceSetState: boolean = false) => {
    const { map } = this.context;
    const { superC, clusterPoints } = this.state;

    const zoom = map.getZoom();
    const canvas = map.getCanvas();
    const w = canvas.width;
    const h = canvas.height;
    const upLeft = map.unproject([0, 0]).toArray();
    const upRight = map.unproject([w, 0]).toArray();
    const downRight = map.unproject([w, h]).toArray();
    const downLeft = map.unproject([0, h]).toArray();
    const newPoints = superC.getClusters(
      bbox(polygon([[upLeft, upRight, downRight, downLeft, upLeft]])),
      Math.round(zoom)
    );
    if (newPoints.length !== clusterPoints.length || forceSetState) {
      this.setState({ clusterPoints: newPoints });
    }
  };

  private feature(coordinates: GeoJSON.Position): Feature {
    return {
      type: 'Feature',
      geometry: {
        type: 'point',
        coordinates
      },
      properties: {}
    };
  }

  private childrenToFeatures = (
    children: Array<React.Component<MarkerProps, any>>
  ) =>
    children.map(child => {
      const feature = this.feature(child && child.props.coordinates);
      this.featureClusterMap.set(feature, child);
      return feature;
    });

  public render() {
    const { ClusterMarkerFactory } = this.props;
    const { clusterPoints } = this.state;

    return (
      <div>
        {// tslint:disable-line:jsx-no-multiline-js
        clusterPoints.map((feature: Feature) => {
          if (feature.properties.cluster) {
            return ClusterMarkerFactory(
              feature.geometry.coordinates,
              feature.properties.point_count
            );
          }
          return this.featureClusterMap.get(feature);
        })}
      </div>
    );
  }
}
