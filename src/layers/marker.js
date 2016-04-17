import MapboxGl from "mapbox-gl/dist/mapbox-gl";
import React, { Component } from "react";
import { List } from "immutable";
import MapboxMixin from "./mixin";
import ReactMixin from "react-mixin";


const defaultStyle = {
  pointerEvents: "none",
  position: "absolute",
  left: 0,
  top: 0,
  display: "none"
};

@ReactMixin.decorate(MapboxMixin)
export default class Marker extends Component {
  static propTypes = {
    coordinates: React.PropTypes.instanceOf(List).isRequired,
    sourceName: React.PropTypes.string.isRequired,
    iconImage: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  };

  _onMapStyleLoaded = () => {
    const { sourceName, iconImage, coordinates, onClick } = this.props;
    const { map } = this.context;

    const layer = {
      "id": sourceName,
      "type": "symbol",
      "source": sourceName,
      "layout": {
        "icon-image": iconImage
      }
    };

    const source = new MapboxGl.GeoJSONSource({
      data: {
        type: "Point",
        coordinates: coordinates.toJS()
      }
    });

    map.addSource(sourceName, source);

    map.addLayer(layer);

    if(onClick) {
      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: [sourceName] });

        if (!features.length) {
            return;
        }

        const feature = features[0];

        onClick(feature, map);
      });
    }

    this.setState({ source });
  };

  componentWillUnmount() {
    const { sourceName } = this.props;
    const { map } = this.context;

    map.removeSource(sourceName);
  }

  _onCoordinatesUpdated = (coordinates) => {
    this.state.source.setData({
      type: "Point",
      coordinates: coordinates.toJS()
    });
  };

  render() {
    return (
      <div style={defaultStyle} className="mapbox-marker-layer">
      </div>
    )
  }
}
