import MapboxGl from "mapbox-gl/dist/mapbox-gl";
import React, { Component, PropTypes, cloneElement, Children } from "react";
import { Map } from "immutable";

import Point from "./features/point";

let index = 0;
function generateID() {
  return index++;
}

export default class Layer extends Component {
  static contextTypes = {
    map: PropTypes.object
  };

  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    iconImage: PropTypes.string,
    iconSize: PropTypes.number,
    layout: PropTypes.object,
    sourceOptions: PropTypes.object
  };

  state = {
    features: new Map()
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

  featurePoint = (props, id) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: props.coordinates
    },
    properties: { id }
  });

  onClick = evt => {
    const { map } = this.context;
    const { children } = this.props;
    const { id } = this;

    const clicked = map.queryRenderedFeatures(evt.point, { layers: [id] });

    for (let feature of clicked) {
      const { geometry, properties } = feature;
      const child = children[properties.id];
      const { onClick } = child.props;

      onClick && onClick({
        ...evt,
        geometry,
        properties
      });
    }
  };

  componentWillMount() {
    const { id, sourceName, source } = this;
    const { type, iconImage, iconSize, layout } = this.props;
    const { map } = this.context;

    const layer = {
      id,
      source: id,
      type: type || "symbol",
      layout: {
        "icon-image": iconImage,
        "icon-size": iconSize || 1,
        ...layout
      }
    };

    map.addSource(id, source);
    map.addLayer(layer);

    map.on("click", this.onClick);
  }

  componentWillUnmount() {
    const { id, sourceName } = this;
    const { map } = this.context;

    map.removeLayer(id);
    map.removeSource(sourceName);

    map.off("click", this.onClick);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.children !== this.props.children) {
      return true;
    }

    return false;
  }

  render() {
    const { children } = this.props;

    const features = children
      .map(({ type, props }, id) => {
        switch (type) {
          case Point: return this.featurePoint(props, id);

          default: return null;
        }
      })
      .filter(Boolean);

    this.source.setData({
      type: "FeatureCollection",
      features
    });

    return null;
  }
}

