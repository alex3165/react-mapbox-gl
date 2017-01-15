import React, { PropTypes, Component } from 'react';
import supercluster from 'supercluster';

export default class Cluster extends Component {

  static contextTypes = {
    map: PropTypes.object,
  };

  static defaultProps = {
    radius: 60,
    maxZoom: 16
  };

  state = {
    clusterIndex: supercluster({
      radius: this.props.radius,
      maxZoom: this.props.maxZoom
    }),
    clusterPoints: []
  };

  componentWillMount() {
    const { map } = this.context;
    const { clusterIndex } = this.state;

    const features = this.childrenToFeatures(this.props.children);
    clusterIndex.load(features);

    // Todo: read debounce from props and apply it
    map.on('move', this.mapChange);
    map.on('zoom', this.mapChange);
  }

  mapChange = () => {
    const { map } = this.context;
    const { clusterIndex, clusterPoints } = this.state;

    const { _sw, _ne } = map.getBounds();
    const zoom = map.getZoom();
    const newPoints = clusterIndex.getClusters([_sw.lat, _sw.lng, _ne.lat, _ne.lng], Math.round(zoom));

    // TODO: Fix it
    let find = newPoints.length !== clusterPoints.length;

    if (newPoints.length === clusterPoints.length) {
      find = !!newPoints.find(
        ({ geometry: { coordinates } }) => {
          console.log(coordinates, clusterPoints.geometry.coordinates);
          return (
            coordinates[0] !== clusterPoints.geometry.coordinates[0] ||
            coordinates[1] !== clusterPoints.geometry.coordinates[1]
          )
        });
    }

    if (find) {
      this.setState({ clusterPoints: newPoints });
    }
  };

  feature = (coordinates) => ({
    type: 'Feature',
    geometry: {
      type: 'point',
      coordinates
    },
    properties: {}
  });

  childrenToFeatures(children) {
    return children.map(child => this.feature(child.props.coordinates));
  }

  render() {
    const { children, clusteredMarker } = this.props;
    const { clusterPoints } = this.state;

    console.log('re-render');

    return (
      <div>
        { children }
      </div>
    );
  }
}