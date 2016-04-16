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
    iconImage: React.PropTypes.string,
    coordinates: React.PropTypes.instanceOf(List)
  };

  _onMapStyleLoaded = () => {
    const { sourceName, iconImage, coordinates } = this.props;
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

    this.setState({ source });
  };

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
