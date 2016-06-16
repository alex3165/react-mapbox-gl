import MapboxGl from "mapbox-gl/dist/mapbox-gl";
import React, { Component, PropTypes, cloneElement, Children } from "react";
import { isEqual, forEach } from "lodash";
import { diff } from "./helper";
import Feature from "./feature";

let index = 0;
const generateID = () => index++;

export default class Layer extends Component {
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

    layout: PropTypes.object,
    paint: PropTypes.object,
    sourceOptions: PropTypes.object,
    layerOptions: PropTypes.object,
    sourceId: PropTypes.string
  };

  static defaultProps = {
    type: "symbol",
    layout: {},
    paint: {}
  };

  hover = [];

  id = this.props.id || `layer-${generateID()}`;

  source = new MapboxGl.GeoJSONSource({
    ...this.props.sourceOptions,
    data: {
      type: "FeatureCollection",
      features: []
    }
  });

  geometry = coordinates => {
    switch (this.props.type) {
      case "symbol":
      case "circle": return {
        type: "Point",
        coordinates
      };

      case "fill": return {
        type: coordinates.length > 1 ? "MultiPolygon" : "Polygon",
        coordinates
      };

      case "line": return {
        type: "LineString",
        coordinates
      };

      default: return null;
    }
  };

  feature = (props, id) => ({
    type: "Feature",
    geometry: this.geometry(props.coordinates),
    properties: {
      ...props.properties,
      id
    }
  })

  onClick = evt => {
    const children = [].concat(this.props.children);
    const { map } = this.context;
    const { id } = this;

    const features = map.queryRenderedFeatures(evt.point, { layers: [id] });

    for (let feature of features) {
      const { properties } = feature;
      const child = children[properties.id];

      const onClick = child && child.props.onClick;
      onClick && onClick({
        ...evt,
        feature,
        map
      });
    }
  };

  onMouseMove = evt => {
    const children = [].concat(this.props.children);
    const { map } = this.context;
    const { id } = this;

    const oldHover = this.hover;
    const hover = [];

    const features = map.queryRenderedFeatures(evt.point, { layers: [id] });

    for (let feature of features) {
      const { properties } = feature;
      const child = children[properties.id];
      hover.push(properties.id);

      const onHover = child && child.props.onHover;
      onHover && onHover({
        ...evt,
        feature,
        map
      });
    }

    oldHover
      .filter(prevHoverId => hover.indexOf(prevHoverId) === -1)
      .forEach(id => {
        const onEndHover = children[id] && children[id].props.onEndHover;
        onEndHover && onEndHover({
          ...evt,
          map
        });
      });

    this.hover = hover;
  };

  componentWillMount() {
    const { id, source } = this;
    const { type, layout, paint, layerOptions, sourceId } = this.props;
    const { map } = this.context;

    const layer = {
      id,
      source: sourceId || id,
      type,
      layout,
      paint,
      ...layerOptions
    };

    if(!sourceId) {
      map.addSource(id, source);
    }

    map.addLayer(layer);

    map.on("click", this.onClick);
    map.on("mousemove", this.onMouseMove);
  }

  componentWillUnmount() {
    const { id } = this;
    const { map } = this.context;

    map.removeLayer(id);
    map.removeSource(id);

    map.off("click", this.onClick);
    map.off("mousemove", this.onMouseMove);
  }

  componentWillReceiveProps(props) {
    const { paint, layout } = this.props;

    if(!isEqual(props.paint, paint)) {
      forEach(diff(paint, props.paint), (val, key) => {
        this.context.map.setPaintProperty(this.id, key, val);
      });
    }

    if(!isEqual(props.layout, layout)) {
      forEach(diff(layout, props.layout), (val, key) => {
        this.context.map.setLayoutProperty(this.id, key, val);
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.children, this.props.children)
          || !isEqual(nextProps.paint, this.props.paint)
          || !isEqual(nextProps.layout, this.props.layout)
  }

  render() {
    if(this.props.children) {
      const children = [].concat(this.props.children);

      const features = children
        .map(({ props }, id) => this.feature(props, id))
        .filter(Boolean);

      this.source.setData({
        type: "FeatureCollection",
        features
      });
    }

    return null;
  }
}

