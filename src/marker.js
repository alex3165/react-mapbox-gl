import React, { PropTypes } from 'react';
import ProjectedLayer from './projected-layer';
import {
  OverlayPropTypes,
} from './util/overlays';

const propsToRemove = { children: undefined };

export default class Popup extends React.Component {
  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    anchor: OverlayPropTypes.anchor,
    offset: OverlayPropTypes.offset,
    children: PropTypes.node,
    style: PropTypes.object,
  };

  render() {
    const { children } = this.props;
    const nestedProps = Object.assign({}, this.props, propsToRemove);

    return (
      <ProjectedLayer
        {...nestedProps}
        className="mapboxgl-marker">
        { children }
      </ProjectedLayer>
    );
  }
}
