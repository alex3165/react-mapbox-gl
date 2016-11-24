import React, { PropTypes } from 'react';
import {
  anchorPropTypes,
  offsetPropTypes,
  projectCoordinates,
  anchorTranslate,
  positionTranslate,
  calculateAnchor,
  normalizeOffsets,
} from './util/overlays';

export default class Popup extends React.Component {
  static contextTypes = {
    map: PropTypes.object,
  }

  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    children: PropTypes.node,
    closeButton: PropTypes.bool,
    closeOnClick: PropTypes.bool,
    anchor: anchorPropTypes,
    offset: offsetPropTypes,
  }

  static defaultProps = {
    closeButton: false,
    closeOnClick: false,
    offset: 0,
  }

  state = {
    anchor: null,
    position: null,
  }

  handleClickClose = () => {
  }

  calculatePosition = ({ offsetWidth = 0, offsetHeight = 0 } = {}) => {
    const { map } = this.context;

    const pos = projectCoordinates(map, this.props.coordinates);
    const offsets = normalizeOffsets(this.props.offset);
    const anchor = this.props.anchor
      || calculateAnchor(map, offsets, pos, { offsetWidth, offsetHeight });

    return {
      anchor,
      position: pos.add(offsets[anchor]),
    };
  }

  handleMapMove = () => {
    this.setState(this.calculatePosition(this.container));
  }

  componentWillMount() {
    // this.container is not rendered yet.
    // Initialize anchor/position assuming 0 sized container
    this.setState(this.calculatePosition());
  }

  componentDidMount() {
    const { map } = this.context;
    map.on('move', this.handleMapMove);
    if (this.props.closeOnClick) {
      map.on('click', this.handleClickClose);
    }
    // Now this.container is rendered and the size of container is known.
    // Recalculate the anchor/position
    this.setState(this.calculatePosition(this.container));
  }

  componentWillUnmount() {
    const { map } = this.context;
    if (map) {
      map.off('move', this.handleMapMove);
      map.off('click', this.handleClickClose);
    }
  }

  render() {
    const closeButton = <button type="button" className="mapboxgl-popup-close-button" onClick={this.handleClickClose}>&#215;</button>;
    const { anchor, position } = this.state;
    const style = {
      transform: `${anchorTranslate(anchor)} ${positionTranslate(position)}`,
      zIndex: 3,
    };
    return (
      <div className={`mapboxgl-popup mapboxgl-popup-anchor-${anchor}`}
           style={style}
           ref={(el) => { this.container = el; }}>
        <div className="mapboxgl-popup-tip"></div>
        <div className="mapboxgl-popup-content">
          {this.props.closeButton && closeButton}
          {this.props.children}
        </div>
      </div>
    );
  }
}

