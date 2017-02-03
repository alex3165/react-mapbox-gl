import React, { PropTypes, Component } from 'react';
import supercluster from 'supercluster';

export default class Cluster extends Component {

  static propTypes = {
    ClusterMarkerFactory: PropTypes.func.isRequired,
    clusterThreshold: PropTypes.number,
    radius: PropTypes.number,
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    extent: PropTypes.number,
    nodeSize: PropTypes.number,
    log: PropTypes.bool,
  };

  static contextTypes = {
    map: PropTypes.object,
  };

  static defaultProps = {
    clusterThreshold: 1,
    radius: 60,
    minZoom: 0,
    maxZoom: 16,
    extent: 512,
    nodeSize: 64,
    log: false,
  };

  state = {
    clusterIndex: supercluster({
      radius: this.props.radius,
      maxZoom: this.props.maxZoom,
    }),
    clusterPoints: [],
  };

  componentWillMount() {
    const { map } = this.context;
    const { clusterIndex } = this.state;

    const features = this.childrenToFeatures(this.props.children);
    clusterIndex.load(features);

    // TODO: Debounce ?
    map.on('move', this.mapChange);
    map.on('zoom', this.mapChange);
    this.mapChange();
  }

  mapChange = () => {
    const { map } = this.context;
    const { clusterIndex, clusterPoints } = this.state;

    const { _sw, _ne } = map.getBounds();
    const zoom = map.getZoom();
    const newPoints = clusterIndex.getClusters(
      [_sw.lng, _sw.lat, _ne.lng, _ne.lat],
      Math.round(zoom)
    );

    if (newPoints.length !== clusterPoints.length) {
      this.setState({ clusterPoints: newPoints });
    }
  };

  feature(coordinates) {
    return {
      type: 'Feature',
      geometry: {
        type: 'point',
        coordinates,
      },
      properties: {
        point_count: 1,
      },
    };
  }

  childrenToFeatures(children) {
    return children.map(child => this.feature(child.props.coordinates));
  }

  render() {
    const { children, ClusterMarkerFactory, clusterThreshold } = this.props;
    const { clusterPoints } = this.state;

    return (
      <div>
        {
          clusterPoints.length <= clusterThreshold ?
          children :
          clusterPoints.map(({ geometry, properties }) =>
            ClusterMarkerFactory(geometry.coordinates, properties.point_count))
        }
      </div>
    );
  }
}
