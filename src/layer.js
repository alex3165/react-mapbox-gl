import MapboxGl from "mapbox-gl/dist/mapbox-gl";
import React, { Component, PropTypes, cloneElement, Children } from "react";
import { Map } from "immutable";

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
      features: this.state.features
    }
  });

  addFeature = (id, feature) => {
    this.setState(({ features }) => ({
      features: features.set(id, feature)
    }));
  };

  removeFeature = id => {
    this.setState(({ features }) => ({
      features: features.delete(id)
    }));
  };

  onClick = evt => {
    const { map } = this.context;
    const { id } = this;
    const { features } = this.state;

    const clicked = map
      .queryRenderedFeatures(evt.point, { layers: [id] })
      .map(x => {
        const { id } = x.properties
        return features.get(id);
      })
      .filter(Boolean)
      .forEach(point => {
        const { onClick, geometry, properties } = point;

        onClick({
          ...evt,
          geometry,
          properties
        });
      });
  };

  update = features => {
    const { source } = this;
    const data = {
      type: "FeatureCollection",
      features: features
        .map(({ geometry, properties }) => ({
          type: "Feature",
          geometry,
          properties
        }))
        .toArray()
    };

    source.setData(data);
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
    if (nextState.features !== this.state.features) {
      this.update(nextState.features);
    }

    if (nextProps.children !== this.props.children) {
      return true;
    }

    return false;
  }

  render() {
    const { sourceName } = this;
    const { children } = this.props;

    return (
      <div>
        {
          Children.map(children, x => {
            return cloneElement(x, {
              addFeature: this.addFeature,
              removeFeature: this.removeFeature,
              sourceName
            });
          })
        }
      </div>
    );
  }
}
