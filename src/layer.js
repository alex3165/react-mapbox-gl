import MapboxGl from "mapbox-gl/dist/mapbox-gl";
import React, { Component, PropTypes, cloneElement, Children } from "react";

import Feature from "./feature";

let index = 0;
const generateID = () => index++;

export default class Layer extends Component {
  static contextTypes = {
    map: PropTypes.object
  };

  state = {
    prevHovers: []
  };

  static propTypes = {
    id: PropTypes.string,

    type: PropTypes.oneOf([
      "symbol",
      "line",
      "fill"
    ]),

    layout: PropTypes.object,
    paint: PropTypes.object,
    sourceOptions: PropTypes.object
  };

  static defaultProps = {
    type: "symbol",
    layout: {},
    paint: {}
  };

  identifier = this.props.id || generateID();
  id = `layer-${this.identifier}`;

  source = new MapboxGl.GeoJSONSource({
    ...this.props.sourceOptions,
    data: {
      type: "FeatureCollection",
      features: []
    }
  });

  geometry = coordinates => {
    switch (this.props.type) {
      case "symbol": return {
        type: "Point",
        coordinates
      };

      case "fill": return {
        type: "Polygon",
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
    properties: { id }
  })

  onClick = evt => {
    const { map } = this.context;
    const { children } = this.props;
    const { id } = this;

    const features = map.queryRenderedFeatures(evt.point, { layers: [id] });

    for (let feature of features) {
      const { properties } = feature;
      const child = Array.isArray(children) ? children[properties.id] : children;
      const { onClick } = child.props;

      onClick && onClick({
        ...evt,
        feature,
        map
      });
    }
  };

  _onMouseMove = (args) => {
    const { map } = this.context;
    const { children } = this.props;
    const { prevHovers } = this.state;
    const currentHovers = [];

    const childs = Array.isArray(children) ? children : [children];
    const features = map.queryRenderedFeatures(args.point, { layers: [this.id] });

    for (let feature of features) {
      const { properties } = feature;
      currentHovers.push(properties.id);
      const child = childs[properties.id]
      const { onHover } = child.props;
      onHover && onHover({
        ...args,
        feature,
        map
      });
    }

    this.setState({
      prevHovers: currentHovers
    });

    prevHovers
    .filter(prevHoverId => currentHovers.indexOf(prevHoverId) === -1)
    .forEach(id => {
      const { onEndHover } = childs[id].props;
      onEndHover && onEndHover({
        ...args,
        map
      });
    });
  };

  componentWillMount() {
    const { id, sourceName, source } = this;
    const { type, layout, paint } = this.props;
    const { map } = this.context;

    const layer = {
      id,
      source: id,
      type,
      layout,
      paint
    };

    map.addSource(id, source);
    map.addLayer(layer);

    map.on("click", this.onClick);
    map.on("mousemove", this._onMouseMove);
  }

  componentWillUnmount() {
    const { id, sourceName } = this;
    const { map } = this.context;

    map.removeLayer(id);
    map.removeSource(sourceName);

    map.off("click", this.onClick);
    map.off("mousemove", this._onMouseMove);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.children !== this.props.children) {
      return true;
    }

    return false;
  }

  render() {
    const children = [].concat(this.props.children);

    const features = children
      .map(({ props }, id) => this.feature(props, id))
      .filter(Boolean);

    this.source.setData({
      type: "FeatureCollection",
      features
    });

    return null;
  }
}

