import React, { PropTypes } from 'react';
import ProjectedLayer from './projected-layer';
import {
  OverlayPropTypes,
} from './util/overlays';

const defaultClassName = ['mapboxgl-popup'];

export default class Popup extends React.Component {
  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    anchor: OverlayPropTypes.anchor,
    offset: OverlayPropTypes.offset,
    children: PropTypes.node,
    onClick: PropTypes.func,
    style: PropTypes.object,
  };

  render() {
    const { coordinates, anchor, offset, onClick, children, style } = this.props;

    if (anchor) {
      defaultClassName.push(`mapboxgl-popup-anchor-${anchor}`);
    }

    return (
      <ProjectedLayer
        style={style}
        onClick={onClick}
        offset={offset}
        anchor={anchor}
        coordinates={coordinates}
        className={defaultClassName.join(' ')}>
        <div className="mapboxgl-popup-tip"></div>
        <div className="mapboxgl-popup-content">
          { children }
        </div>
      </ProjectedLayer>
    );
  }
}
