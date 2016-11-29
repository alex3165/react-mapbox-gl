import React, { PropTypes } from 'react';
import {
  OverlayPropTypes,
  overlayState,
  overlayTransform,
} from './util/overlays';

const defaultStyle = {
  zIndex: 2,
  cursor: 'pointer',
};

export default class Marker extends React.Component {
  static contextTypes = {
    map: PropTypes.object,
  };

  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    anchor: OverlayPropTypes.anchor,
    offset: OverlayPropTypes.offset,
    onClick: PropTypes.func,
    style: PropTypes.object,
  };

  static defaultProps = {
    offset: 0,
    onClick: (...args) => args,
  };

  state = {};

  setContainer = el => {
    if (el) {
      this.container = el;
    }
  };

  handleMapMove = () => {
    this.setState(overlayState(this.props, this.context, this.container));
  };

  componentDidMount() {
    const { map } = this.context;

    map.on('move', this.handleMapMove);
    map.on('moveend', this.handleMapMove);

    this.handleMapMove();
  }

  componentWillUnmount() {
    const { map } = this.context;

    map.off('move', this.handleMapMove);
    map.off('moveend', this.handleMapMove);
  }

  render() {
    const { onClick, style } = this.props;

    const finalStyle = {
      ...defaultStyle,
      ...style,
      transform: overlayTransform(this.state)
    };

    return (
      <div
        className="mapboxgl-marker"
        onClick={onClick}
        style={finalStyle}
        ref={this.setContainer}>
        {this.props.children}
      </div>
    );
  }
}
