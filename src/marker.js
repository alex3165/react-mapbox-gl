import React, { PropTypes } from 'react';
import {
  OverlayPropTypes,
  overlayState,
  overlayTransform,
} from './util/overlays';

export default class Marker extends React.Component {
  static contextTypes = {
    map: PropTypes.object,
  };

  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    anchor: OverlayPropTypes.anchor,
    offset: OverlayPropTypes.offset,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    offset: 0,
  }

  state = {
  }

  setContainer = (el) => {
    this.container = el;
  }

  handleMapMove = () => {
    this.setState(overlayState(this.props, this.context, this.container));
  }

  handleMapMoveEnd = () => {
    this.setState(overlayState(this.props, this.context, this.container));
  }

  componentDidMount() {
    const { map } = this.context;
    map.on('move', this.handleMapMove);
    map.on('moveend', this.handleMapMoveEnd);
    this.setState(overlayState(this.props, this.context, this.container));
  }

  componentWillUnmount() {
    const { map } = this.context;
    map.off('move', this.handleMapMove);
    map.off('moveend', this.handleMapMoveEnd);
  }

  render() {
    const onClick = this.props.onClick || (() => {});
    const style = {
      transform: overlayTransform(this.state),
      zIndex: 2,
      cursor: (this.props.onClick ? 'pointer' : 'auto'),
    };
    return (
      <div className="mapboxgl-marker"
           onClick={onClick}
           style={style}
           ref={this.setContainer}>
        {this.props.children}
      </div>
    );
  }
}
