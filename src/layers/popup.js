import MapboxGl from "mapbox-gl/dist/mapbox-gl";
import React, { Component } from "react";
import { List } from "immutable";
import MapboxMixin from "./mixin";
import ReactMixin from "react-mixin";

@ReactMixin.decorate(MapboxMixin)
export default class Marker extends Component {
  static propTypes = {
    coordinates: React.PropTypes.instanceOf(List).isRequired,
    HTMLContent: React.PropTypes.string
  };

  componentWillMount() {
    let { HTMLContent, coordinates } = this.props;
    const { map } = this.context;

    if(!HTMLContent) {
      HTMLContent = "<div></div>";
    }

    const popup = new MapboxGl.Popup()
      .setLngLat(coordinates)
      .setHTML(HTMLContent)
      .addTo(map);

    this.setState({ popup });
  }

  componentWillUnmount() {
    this.state.popup.remove();
  }

  _onCoordinatesUpdated = (coordinates) => {
    this.state.popup.setLngLat(coordinates);
  };

  render() {
    return null;
  }
}
