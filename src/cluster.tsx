import * as React from 'react';
import { LngLatBounds, Map } from 'mapbox-gl';
import { Props as MarkerProps } from './marker';
import Supercluster from 'supercluster';
import * as GeoJSON from 'geojson';
import bbox from '@turf/bbox';
import { polygon, featureCollection } from '@turf/helpers';
import { withMap } from './context';

export interface Props {
  ClusterMarkerFactory(
    coordinates: GeoJSON.Position,
    pointCount: number,
    getLeaves: (
      limit?: number,
      offset?: number
    ) => Array<React.ReactElement<MarkerProps> | undefined>
  ): React.ReactElement<MarkerProps>;
  radius?: number;
  maxZoom?: number;
  minZoom?: number;
  extent?: number;
  nodeSize?: number;
  log?: boolean;
  zoomOnClick?: boolean;
  zoomOnClickPadding?: number;
  children?: Array<React.ReactElement<MarkerProps>>;
  style?: React.CSSProperties;
  className?: string;
  tabIndex?: number;
  map: Map;
}

export interface State {
  superC: Supercluster;
  clusterPoints: Array<GeoJSON.Feature<GeoJSON.Point>>;
}

export class Cluster extends React.Component<Props, State> {
  public static defaultProps = {
    radius: 60,
    minZoom: 0,
    maxZoom: 16,
    extent: 512,
    nodeSize: 64,
    log: false,
    zoomOnClick: false,
    zoomOnClickPadding: 20
  };

  public state: State = {
    superC: new Supercluster({
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
    GeoJSON.Feature,
    React.ReactElement<MarkerProps>
  >();

  public componentDidMount() {
    const { children, map } = this.props;

    if (children) {
      this.childrenChange(children as Array<React.ReactElement<MarkerProps>>);
    }

    map.on('move', this.mapChange);
    map.on('zoom', this.mapChange);
    this.mapChange();
  }

  public componentWillUnmount() {
    const { map } = this.props;

    map.off('move', this.mapChange);
    map.off('zoom', this.mapChange);
  }

  public componentDidUpdate(prevProps: Props) {
    const { children } = prevProps;

    if (children !== this.props.children && this.props.children) {
      this.childrenChange(this.props.children);
      this.mapChange(true);
    }
  }

  private childrenChange = (
    newChildren: Array<React.ReactElement<MarkerProps>>
  ) => {
    const { superC } = this.state;
    this.featureClusterMap = new WeakMap<
      GeoJSON.Feature,
      React.ReactElement<MarkerProps>
    >();
    const features = this.childrenToFeatures(newChildren);
    superC.load(features);
  };

  private mapChange = (forceSetState: boolean = false) => {
    const { map } = this.props;
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

  private feature(coordinates: GeoJSON.Position) {
    return {
      type: 'Feature' as 'Feature',
      geometry: {
        type: 'Point' as 'Point',
        coordinates
      },
      properties: {}
    };
  }

  private childrenToFeatures = (
    children: Array<React.ReactElement<MarkerProps>>
  ) =>
    children.map(child => {
      const feature = this.feature(child && child.props.coordinates);
      this.featureClusterMap.set(feature, child);
      return feature;
    });

  private getLeaves = (
    feature: GeoJSON.Feature,
    limit?: number,
    offset?: number
  ) => {
    const { superC } = this.state;
    return superC
      .getLeaves(
        feature.properties && feature.properties.cluster_id,
        limit || Infinity,
        offset
      )
      .map((leave: GeoJSON.Feature) => this.featureClusterMap.get(leave));
  };

  public zoomToClusterBounds = (event: React.MouseEvent<HTMLElement>) => {
    const markers = Array.prototype.slice.call(event.currentTarget.children);
    const marker = this.findMarkerElement(
      event.currentTarget,
      event.target as HTMLElement
    );
    const index = markers.indexOf(marker);
    const cluster = this.state.clusterPoints[index] as GeoJSON.Feature;
    if (!cluster.properties || !cluster.properties.cluster_id) {
      return;
    }
    const children = this.state.superC.getLeaves(
      cluster.properties && cluster.properties.cluster_id,
      Infinity
    );
    const childrenBbox = bbox(featureCollection(children));
    // https://github.com/mapbox/mapbox-gl-js/issues/5249
    // tslint:disable-next-line:no-any
    this.props.map.fitBounds(LngLatBounds.convert(childrenBbox as any), {
      padding: this.props.zoomOnClickPadding!
    });
  };

  private findMarkerElement(
    target: HTMLElement,
    element: HTMLElement
  ): HTMLElement {
    if (element.parentElement === target) {
      return element;
    }
    return this.findMarkerElement(target, element.parentElement!);
  }

  public render() {
    const { ClusterMarkerFactory, style, className, tabIndex } = this.props;
    const { clusterPoints } = this.state;

    return (
      <div
        style={style}
        className={className}
        tabIndex={tabIndex}
        onClick={this.props.zoomOnClick ? this.zoomToClusterBounds : undefined}
      >
        {clusterPoints.map((feature: GeoJSON.Feature<GeoJSON.Point>) => {
          if (feature.properties && feature.properties.cluster) {
            return ClusterMarkerFactory(
              feature.geometry.coordinates,
              feature.properties.point_count,
              this.getLeaves.bind(this, feature)
            );
          }
          return this.featureClusterMap.get(feature);
        })}
      </div>
    );
  }
}

export default withMap(Cluster);
