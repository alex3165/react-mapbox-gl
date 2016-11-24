import React, { PropTypes } from 'react';
import {
  anchorPropTypes,
  offsetPropTypes,
  projectCoordinates,
  anchorTranslate,
  positionTranslate,
  normalizeOffsets,
  calculateAnchor,
} from './util/overlays';

export default class Marker extends React.Component {
  static contextTypes = {
    map: PropTypes.object,
  };

  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    anchor: anchorPropTypes,
    offset: offsetPropTypes,
    onClick: PropTypes.func,
  }

  state = {
    position: null,
  }

  calculatePosition = (roundCoordinates, { offsetWidth = 0, offsetHeight = 0 } = {}) => {
    const { map } = this.context;

    const pos = projectCoordinates(map, this.props.coordinates, roundCoordinates);
    const offsets = normalizeOffsets(this.props.offset);
    const anchor = this.props.anchor
      || calculateAnchor(map, offsets, pos, { offsetWidth, offsetHeight });

    return {
      anchor,
      position: pos.add(offsets[anchor]),
    };
  }

  handleMapMove = () => {
    this.setState(this.calculatePosition(false, this.container));
  }

  handleMapMoveEnd = () => {
    this.setState(this.calculatePosition(false, this.container));
  }

  componentWillMount() {
    const { map } = this.context;
    map.on('move', this.handleMapMove);
    map.on('moveend', this.handleMapMoveEnd);
    this.setState(this.calculatePosition(false));
  }

  componentDidMount() {
    this.setState(this.calculatePosition(false, this.container));
  }

  componentWillUnmount() {
    const { map } = this.context;
    if (map) {
      map.off('move', this.handleMapMove);
      map.off('moveend', this.handleMapMoveEnd);
    }
  }

  render() {
    const { anchor, position } = this.state;
    const noop = () => {};
    const onClick = this.props.onClick || noop;
    const style = {
      transform: `${anchorTranslate(anchor)} ${positionTranslate(position)}`,
      zIndex: 2,
      cursor: (this.props.onClick ? 'pointer' : 'auto'),
    };
    return (
      <div className="mapboxgl-marker"
           onClick={onClick}
           style={style}
           ref={(el) => { this.container = el; }}>
        {this.props.children}
      </div>
    );
  }
}
