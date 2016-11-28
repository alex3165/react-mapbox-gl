import React, { PropTypes } from 'react';
import {
  OverlayPropTypes,
  overlayState,
  overlayTransform,
} from './util/overlays';

export default class Popup extends React.Component {
  static contextTypes = {
    map: PropTypes.object,
  }

  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    anchor: OverlayPropTypes.anchor,
    offset: OverlayPropTypes.offset,
    children: PropTypes.node,
  }

  static defaultProps = {
    offset: 0,
  }

  state = {
  }

  handleMapMove = () => {
    this.setState(overlayState(this.props, this.context, this.container));
  }

  handleMapMoveEnd = () => {
    this.setState(overlayState(this.props, this.context, this.container));
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { map } = this.context;
    map.on('move', this.handleMapMove);
    map.on('moveend', this.handleMapMoveEnd);
    // Now this.container is rendered and the size of container is known.
    // Recalculate the anchor/position
    this.setState(overlayState(this.props, this.context, this.container));
  }

  componentWillUnmount() {
    const { map } = this.context;
    map.off('move', this.handleMapMove);
    map.off('moveend', this.handleMapMoveEnd);
  }

  render() {
    const { anchor } = this.state;
    return (
      <div className={`mapboxgl-popup mapboxgl-popup-anchor-${anchor || ''}`}
           style={{ transform: overlayTransform(this.state), zIndex: 3 }}
           ref={(el) => { this.container = el; }}>
        <div className="mapboxgl-popup-tip"></div>
        <div className="mapboxgl-popup-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

