import MapboxGl from "../vendor/mapbox-gl.bundle";
import React, { Component, PropTypes } from "react";
import { render, unmountComponentAtNode } from "react-dom";

export default class ReactMapboxGl extends Component {
  static contextTypes = {
    map: PropTypes.object
  };

  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    container: PropTypes.object
  }

  div = document.createElement("div");

  componentWillMount() {
    const { map } = this.context;
    const {
      children,
      coordinates,
      container
    } = this.props;

    if (container && container.nodeName) {
      this.div = container;
    }

    this.marker = new MapboxGl.Marker(this.div).setLngLat(coordinates);

    render(children, this.div, () => {
      this.marker.addTo(map);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { marker, div } = this;
    const { coordinates, children } = nextProps;

    if(children) {
      render(children, div);
    }

    if (this.props.coordinates !== coordinates) {
      marker.setLngLat(coordinates);
    }
  }

  componentWillUnmount() {
    const { marker, div } = this;

    marker.remove();
    unmountComponentAtNode(div);
  }

  render() {
    return null;
  }
}
