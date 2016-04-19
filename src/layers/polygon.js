import MapboxGl from "mapbox-gl/dist/mapbox-gl";
import React, { Component } from "react";
import { List } from "immutable";
import MapboxMixin from "./mixin";
import ReactMixin from "react-mixin";
import { elementInteracted } from "../helpers/element-interacted";

@ReactMixin.decorate(MapboxMixin)
export default class Polygon extends Component {
  static propTypes = {
    coordinates: React.PropTypes.instanceOf(List).isRequired,
    sourceName: React.PropTypes.string.isRequired,
    fillColor: React.PropTypes.string,
    fillOpacity: React.PropTypes.number,
    onClick: React.PropTypes.func,
    onHover: React.PropTypes.func,
    onOutHover: React.PropTypes.func
  };

  _onMouseMove = (args, evt) => {
    const isHovering = elementInteracted(args, evt);
    const { onOutHover } = this.props;

    if(!isHovering && this.state.hovering) {
      this.setState({ hovering: false });
      if(onOutHover) {
        onOutHover(args.map);
      }
    }

    if(isHovering && !this.state.hovering) {
      this.setState({ hovering: true });
    }
  };

  _onMapStyleLoaded = () => {
    const {
      sourceName,
      coordinates,
      fillColor,
      fillOpacity,
      onClick,
      onHover
    } = this.props;

    const { map } = this.context;

    const layer = {
      "id": sourceName,
      "type": "fill",
      "source": sourceName,
      "layout": {},
      "paint": {
        "fill-color": fillColor,
        "fill-opacity": fillOpacity
      }
    }

    const source = new MapboxGl.GeoJSONSource({
      data: {
        type: "Polygon",
        coordinates: [coordinates.toJS()]
      }
    });

    if(onClick) {
      map.on("click", elementInteracted.bind(this, {sourceName, interaction: onClick, map}));
    }

    if(onHover) {
      map.on("mousemove", this._onMouseMove.bind(this, {sourceName, interaction: onHover, map}));
    }

    map.addSource(sourceName, source);

    map.addLayer(layer);
  };

  componentWillUnmount() {
    const { sourceName } = this.props;
    const { map } = this.context;

    map.removeSource(sourceName);
  }

  _onCoordinatesUpdated = (coordinates) => {
    this.state.source.setData({
      type: "Polygon",
      coordinates: coordinates.toJS()
    });
  };

  render() {
    return null;
  }
}
