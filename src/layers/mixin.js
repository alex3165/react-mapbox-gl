import React from "react";

export default {
  displayName: "MapboxLayer",

  contextTypes: {
    map: React.PropTypes.object.isRequired
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if(!nextProps.coordinates.equals(this.props.coordinates)) {
      this._onCoordinatesUpdated(nextProps.coordinates);
    }
  }
}
