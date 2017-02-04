import * as React from 'react';
import * as MapboxGL from 'mapbox-gl';
import { Props as MarkerProps } from './marker';

const supercluster = require('supercluster'); //tslint:disable-line

interface Props {
  ClusterMarkerFactory: (coordinates: number[], pointCount: number) => JSX.Element;
  clusterThreshold?: number;
  radius?: number;
  maxZoom?: number;
  minZoom?: number;
  extent?: number;
  nodeSize?: number;
  log?: boolean;
  children?: Array<React.Component<MarkerProps, void>>;
}

interface State {
  superC: any;
  clusterPoints: any[];
}

interface Context {
  map: MapboxGL.Map;
}

interface Point {
  geometry: {
    coordinates: number[];
  };
  properties: {
    point_count: number;
  };
}

export default class Cluster extends React.Component<Props, State> {
  public context: Context;

  public static contextTypes = {
    map: React.PropTypes.object
  };

  public static defaultProps = {
    clusterThreshold: 1,
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

  public componentWillMount() {
    const { map } = this.context;
    const { superC } = this.state;
    const { children } = this.props;

    if (children) {
      const features = this.childrenToFeatures(children as any);
      superC.load(features);
    }

    // TODO: Debounce ?
    map.on('move', this.mapChange);
    map.on('zoom', this.mapChange);
    this.mapChange();
  }

  private mapChange = () => {
    const { map } = this.context;
    const { superC, clusterPoints } = this.state;

    const { _sw, _ne } = map.getBounds() as any;
    const zoom = map.getZoom();
    const newPoints = superC.getClusters(
      [_sw.lng, _sw.lat, _ne.lng, _ne.lat],
      Math.round(zoom)
    );

    if (newPoints.length !== clusterPoints.length) {
      this.setState({ clusterPoints: newPoints });
    }
  };

  private feature(coordinates: number[]) {
    return {
      type: 'Feature',
      geometry: {
        type: 'point',
        coordinates
      },
      properties: {
        point_count: 1
      }
    };
  }

  private childrenToFeatures = (children: Array<React.Component<MarkerProps, any>>) => (
    children.map((child) => this.feature(child && child.props.coordinates))
  );

  public render() {
    const { children, ClusterMarkerFactory, clusterThreshold } = this.props;
    const { clusterPoints } = this.state;

    if (clusterPoints.length <= clusterThreshold) {
      return (
        <div>
          {children}
        </div>
      );
    }

    return (
      <div>
        {// tslint:disable-line
          clusterPoints.map(({ geometry, properties }: Point) => (
            ClusterMarkerFactory(geometry.coordinates, properties.point_count))
          )}
      </div>
    );
  }
}
