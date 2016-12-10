import React, { PropTypes } from 'react';
import {
  OverlayPropTypes,
  overlayState,
  overlayTransform,
} from './util/overlays';

const defaultStyle = {
  zIndex: 3,
};

const defaultClassName = ['mapboxgl-popup'];

export default class Popup extends React.Component {
  static contextTypes = {
    map: PropTypes.object,
  };

  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    anchor: OverlayPropTypes.anchor,
    offset: OverlayPropTypes.offset,
    children: PropTypes.node,
    style: PropTypes.object,
  };

  static defaultProps = {
    offset: 0,
  };

  state = {};

  setContainer = (el) => {
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
    // Now this.container is rendered and the size of container is known.
    // Recalculate the anchor/position
    this.setState(overlayState(this.props, this.context, this.container));
  }

  componentWillUnmount() {
    const { map } = this.context;

    map.off('move', this.handleMapMove);
    map.off('moveend', this.handleMapMove);
  }

  render() {
    const { anchor } = this.state;
    const { style } = this.props;
    const transform = overlayTransform(this.state);

    let finalStyle = {
      ...defaultStyle,
      ...style
    };

    if (transform) {
      finalStyle = {
        ...finalStyle,
        transform
      }
    }

    if (anchor) {
      defaultClassName.push(`mapboxgl-popup-anchor-${anchor}`);
    }

    console.log(anchor, transform, finalStyle, this.state);

    return (
      <div
        className={defaultClassName.join(' ')}
        style={finalStyle}
        ref={this.setContainer}>
        <div className="mapboxgl-popup-tip"></div>
        <div className="mapboxgl-popup-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

