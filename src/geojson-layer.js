import MapboxGl from "../vendor/mapbox-gl.bundle";
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

    data: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]).isRequired,

    lineLayout: PropTypes.object,
    symbolLayout: PropTypes.object,
    circleLayout: PropTypes.object,
    fillLayout: PropTypes.object,

    linePaint: PropTypes.object,
    symbolPaint: PropTypes.object,
    circlePaint: PropTypes.object,
    fillPaint: PropTypes.object,

    sourceOptions: PropTypes.string,
    before: PropTypes.string
  };

  id = this.props.id || `geojson-${generateID()}`;

  source = new MapboxGl.GeoJSONSource({
    ...this.props.sourceOptions,
    data: this.props.data
  });

  layerIds = [];

  createLayer = type => {
    const { id, layerIds } = this;
    const { before } = this.props;
    const { map } = this.context;

    const layerId = id + "-" + type;
    layerIds.push(layerId);

    const paint = this.props[type + "Paint"] || {};
    const layout = this.props[type + "Layout"] || {};

    map.addLayer({
      id: layerId,
      source: id,
      type,
      paint,
      layout
    }, before);
  };

  componentWillMount() {
    const { id, source } = this;
    const { map } = this.context;

    map.addSource(id, source);

    this.createLayer("symbol");
    this.createLayer("line");
    this.createLayer("fill");
    this.createLayer("circle");
  }

  componentWillUnmount() {
    const { id, layerIds } = this;
    const { map } = this.context;

    map.removeSource(id);

    layerIds.forEach(id => map.removeLayer(id));
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

