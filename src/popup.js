import React, { PropTypes } from 'react';
import ProjectedLayer from './projected-layer';
import {
  anchors,
  OverlayPropTypes,
} from './util/overlays';

export default class Popup extends React.Component {
  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    anchor: OverlayPropTypes.anchor,
    offset: OverlayPropTypes.offset,
    children: PropTypes.node,
    onClick: PropTypes.func,
    style: PropTypes.object,
  };

  static defaultProps = {
    anchor: anchors[0],
  };

  render() {
    const { coordinates, anchor, offset, onClick, children, style } = this.props;

    return (
      <ProjectedLayer
        style={style}
        onClick={onClick}
        offset={offset}
        anchor={anchor}
        coordinates={coordinates}
        className={`mapboxgl-popup mapboxgl-popup-anchor-${anchor}`}>
        <div className="mapboxgl-popup-tip"></div>
        <div className="mapboxgl-popup-content">
          { children }
        </div>
      </ProjectedLayer>
    );
  }
}
