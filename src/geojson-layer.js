const MapboxGl = require("../vendor/mapbox-gl.bundle.js");

import React, { Component, PropTypes, cloneElement, Children } from "react";
import isEqual from "deep-equal";
import { diff } from "./helper";

let index = 0;
const generateID = () => index++;

export default class GeoJSONLayer extends Component {
  static contextTypes = {
    map: PropTypes.object
  };

  static propTypes = {
    id: PropTypes.string,

    type: PropTypes.oneOf([
      "symbol",
      "line",
      "fill",
      "circle"
    ]),

    data: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]).isRequired,

    layout: PropTypes.object,
    paint: PropTypes.object,
    sourceOptions: PropTypes.string,
    layerOptions: PropTypes.string,
    before: Proptypes.string
  };

  static defaultProps = {
    type: "symbol",
    layout: {},
    paint: {}
  };

  id = this.props.id || `geojson-${generateID()}`;

  source = new MapboxGl.GeoJSONSource({
    ...this.props.sourceOptions,
    data: this.props.data
  });

  componentWillMount() {
    const { id, source } = this;
    const { type, layout, paint, layerOptions, before } = this.props;
    const { map } = this.context;

    const layer = {
      id: id,
      source: id,
      type,
      layout,
      paint,
      ...layerOptions
    };

    map.addSource(id, source);
    map.addLayer(layer, before);
  }

  componentWillUnmount() {
    const { id } = this;
    const { map } = this.context;

    map.removeLayer(id);
    map.removeSource(id);
  }

  componentWillReceiveProps(props) {
    const { source } = this;
    const { data, paint, layout } = this.props;
    const { map } = this.context;

    if (!isEqual(props.paint, paint)) {
      const paintDiff = diff(paint, props.paint);

      for (const key in paintDiff) {
        map.setPaintProperty(this.id, key, paintDiff[key]);
      }
    }

    if (!isEqual(props.layout, layout)) {
      const layoutDiff = diff(layout, props.layout);

      for (const key in layoutDiff) {
        map.setLayoutProperty(this.id, key, layoutDiff[key]);
      }
    }

    if (props.data !== data) {
      source.setData(props.data);
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(nextProps.paint, this.props.paint) ||
      !isEqual(nextProps.layout, this.props.layout) ||
      nextProps.data !== this.props.data
    );
  }

  render() {
    return null;
  }
}

