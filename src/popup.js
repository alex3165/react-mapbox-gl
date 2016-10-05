import MapboxGl from "../vendor/mapbox-gl.bundle";
import React, { Component, PropTypes } from "react";
import { render, unmountComponentAtNode } from "react-dom";

export default class Popup extends Component {
  static contextTypes = {
    map: PropTypes.object
  };

  static propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    dangerouslySetInnerHTML: PropTypes.string,
    text: PropTypes.string,
    closeButton: PropTypes.bool,
    closeOnClick: PropTypes.bool,
    anchor: PropTypes.oneOf([
      "top",
      "bottom",
      "left",
      "right",
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right"
    ])
  }

  div = document.createElement("div");
  popup = new MapboxGl.Popup({
    closeButton: this.props.closeButton,
    closeOnClick: this.props.closeOnClick,
    anchor: this.props.anchor
  });

  componentWillMount() {
    const { div, popup } = this;
    const { map } = this.context;
    const {
      coordinates,
      children,
      dangerouslySetInnerHTML,
      text
    } = this.props;

    if (children) {
      popup.setDOMContent(div);
    } else if (dangerouslySetInnerHTML) {
      popup.setHTML(dangerouslySetInnerHTML);
    } else {
      popup.setText(text || "");
    }

    popup.setLngLat(coordinates);

    render(children, div, () => {
      popup.addTo(map);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { popup, div } = this;
    const {
      children,
      coordinates,
      dangerouslySetInnerHTML,
      text
    } = nextProps;

    if (!children) {
      if (
        this.props.dangerouslySetInnerHTML &&
        dangerouslySetInnerHTML !== this.props.dangerouslySetInnerHTML
      ) {
        popup.setHTML(dangerouslySetInnerHTML);
      } else if (text !== this.props.text) {
        popup.setText(text);
      }
    } else {
      render(children, div);
    }

    if (this.props.coordinates !== coordinates) {
      popup.setLngLat(coordinates);
    }
  }

  componentWillUnmount() {
    const { popup, div } = this;
    popup.remove();
    unmountComponentAtNode(div);
  }

  render() {
    return null;
  }
}

