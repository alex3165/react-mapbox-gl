import MapboxGl from "mapbox-gl/dist/mapbox-gl";
import React, { Component } from "react";
import { List } from "immutable";
import MapboxMixin from "./mixin";
import ReactMixin from "react-mixin";

@ReactMixin.decorate(MapboxMixin)
export default class Path extends Component {
  static propTypes = {
    coordinates: React.PropTypes.instanceOf(List).isRequired,
    sourceName: React.PropTypes.string.isRequired,
    lineColor: React.PropTypes.string,
    lineWidth: React.PropTypes.number,
    lineCap: React.PropTypes.string,
    lineJoin: React.PropTypes.string
  };

  _onMapStyleLoaded = () => {
    const {
      sourceName,
      lineJoin,
      lineCap,
      lineColor,
      lineWidth,
      coordinates
    } = this.props;

    const { map } = this.context;

    const layer = {
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      "layout": {
        "line-join": lineJoin,
        "line-cap": lineCap
      },
      "paint": {
        "line-color": lineColor,
        "line-width": lineWidth
      }
    };

    const source = new MapboxGl.GeoJSONSource({
      data: {
        type: "LineString",
        coordinates: coordinates.toJS()
      }
    });

    map.addSource(sourceName, source);

    map.addLayer(layer);

    this.setState({ source });
  };

  componentWillUnmount() {
    const { sourceName } = this.props;
    const { map } = this.context;

    map.removeSource(sourceName);
  }

  _onCoordinatesUpdated = (coordinates) => {
    this.state.source.setData({
      type: "LineString",
      coordinates: coordinates.toJS()
    });
  };

  render() {
    return null;
  }
}
