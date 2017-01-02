import React, { PropTypes } from 'react';
import {
  OverlayPropTypes,
  overlayState,
  overlayTransform,
  anchors,
} from './util/overlays';

const defaultStyle = {
  zIndex: 3,
};

export default class ProjectedLayer extends React.Component {
  static contextTypes = {
    map: PropTypes.object,
  };

  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    anchor: OverlayPropTypes.anchor,
    offset: OverlayPropTypes.offset,
    children: PropTypes.node,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    style: PropTypes.object,
  };

  static defaultProps = {
    anchor: anchors[0],
    offset: 0,
    onClick: (...args) => args,
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

  componentWillReceiveProps(nextProps) {
    const { coordinates } = this.props;

    if (
      coordinates[0] !== nextProps.coordinates[0]
      || coordinates[1] !== nextProps.coordinates[1]
    ) {
      this.setState(overlayState(nextProps, this.context.map, this.container));
    }
  }

  componentWillUnmount() {
    const { map } = this.context;

    this.prevent = true;

    map.off('move', this.handleMapMove);
  }

  render() {
    const {
      style,
      children,
      className,
      onClick,
      onMouseEnter,
      onMouseLeave,
    } = this.props;

    const finalStyle = {
      ...defaultStyle,
      ...style,
      transform: overlayTransform(this.state).join(' '),
    };

    return (
      <div
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={finalStyle}
        ref={this.setContainer}>
        { children }
      </div>
    );
  }
}

