import React, { PropTypes } from 'react';
import {
  OverlayPropTypes,
  overlayState,
  overlayTransform,
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
    style: PropTypes.object,
  };

  static defaultProps = {
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

  componentWillUnmount() {
    const { map } = this.context;

    this.prevent = true;

    map.off('move', this.handleMapMove);
  }

  render() {
    const { anchor } = this.state;
    const { style, children, className } = this.props;

    const finalStyle = {
      ...defaultStyle,
      ...style,
      transform: overlayTransform(this.state).join(' '),
    };

    return (
      <div
        className={className}
        style={finalStyle}
        ref={this.setContainer}>
        { children }
      </div>
    );
  }
}

