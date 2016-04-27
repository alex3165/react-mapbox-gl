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

    const clicked = map.queryRenderedFeatures(evt.point, {
      layers: [id]
    });

    features
      .filter(x => clicked.indexOf(x) > -1)
      .forEach(({ onClick }) => {
        onClick(evt);
      });
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

  render() {
    const { sourceName, source } = this;
    const { features } = this.state;
    const { children } = this.props;

    const data = {
      type: "FeatureCollection",
      features: features
        .map(({ geometry }) => ({
          type: "Feature",
          geometry
        }))
        .toArray()
    };

    source.setData(data);

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
