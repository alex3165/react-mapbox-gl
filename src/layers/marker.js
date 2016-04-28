import MapboxGl from "mapbox-gl/dist/mapbox-gl";
import React, { Component } from "react";
import { List } from "immutable";
import MapboxMixin from "./mixin";
import ReactMixin from "react-mixin";
import { elementInteracted } from "../helpers/element-interacted";

@ReactMixin.decorate(MapboxMixin)
export default class Marker extends Component {
  static propTypes = {
    coordinates: React.PropTypes.instanceOf(List).isRequired,
    sourceName: React.PropTypes.string.isRequired,
    iconImage: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
    onHover: React.PropTypes.func,
    onOutHover: React.PropTypes.func,
    iconSize: React.PropTypes.number
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

  componentWillMount() {
    const { sourceName, coordinates, iconImage, onClick, onHover, iconSize } = this.props;
    const { map } = this.context;

    const layer = {
      "id": sourceName,
      "type": "symbol",
      "source": sourceName,
      "layout": {
        "icon-image": iconImage,
        "icon-size": iconSize || 1
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
      map.on("click", elementInteracted.bind(this, {sourceName, interaction: onClick, map}));
    }

    if(onHover) {
      map.on("mousemove", this._onMouseMove.bind(this, {sourceName, interaction: onHover, map}));
    }

    this.setState({ source });
  };

  componentWillUnmount() {
    const { sourceName } = this.props;
    const { map } = this.context;

    map.removeLayer(sourceName);
    map.removeSource(sourceName);
    map.off("mousemove", this._onMouseMove);
    map.off("click", elementInteracted);
  }

  componentWillReceiveProps(next) {
    if (next.iconImage !== this.props.iconImage) {
      const { map } = this.context;
      const { sourceName, iconImage, iconSize } = next;
      const layer = {
        "id": sourceName,
        "type": "symbol",
        "source": sourceName,
        "layout": {
          "icon-image": iconImage,
          "icon-size": iconSize || 1
        }
      };

      map.removeLayer(sourceName);
      map.addLayer(layer);
    }
  }

  _onCoordinatesUpdated = (coordinates) => {
    this.state.source.setData({
      type: "Point",
      coordinates: coordinates.toJS()
    });
  };

  render() {
    return null;
  }
}
