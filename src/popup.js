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
    if (!this.prevent) {
      this.setState(overlayState(this.props, this.context.map, this.container));
    }
  };

  componentDidMount() {
    const { map } = this.context;

    map.on('move', this.handleMapMove);
    // Now this.container is rendered and the size of container is known.
    // Recalculate the anchor/position
    this.handleMapMove();
  }

  componentWillUnmount() {
    const { map } = this.context;

    this.prevent = true;

    map.off('move', this.handleMapMove);
  }

  render() {
    const { anchor } = this.state;
    const { style, children } = this.props;

    const finalStyle = {
      ...defaultStyle,
      ...style,
      transform: overlayTransform(this.state).join(' '),
    };

    if (anchor) {
      defaultClassName.push(`mapboxgl-popup-anchor-${anchor}`);
    }

    return (
      <div
        className={defaultClassName.join(' ')}
        style={finalStyle}
        ref={this.setContainer}>
        <div className="mapboxgl-popup-tip"></div>
        <div className="mapboxgl-popup-content">
          { children }
        </div>
      </div>
    );
  }
}

