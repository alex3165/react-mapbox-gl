import React from "react";

export default {
  displayName: "MapboxLayer",

  contextTypes: {
    map: React.PropTypes.object
  },

  _checkMapLoaded() {
    this.context.map.on("style.load", () => {
      this._onMapStyleLoaded();
    });
  },

  componentDidMount() {
    const { map } = this.context;

    if(map) {
      if(!map.loaded()) {
        this._checkMapLoaded();
      } else {
        this._onMapStyleLoaded();
      }
    }
  },

  componentDidUpdate() {
    if(this.context.map) {
      this._checkMapLoaded();
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if(!nextProps.coordinates.equals(this.props.coordinates)) {
      this._onCoordinatesUpdated(nextProps.coordinates);
    }
  },
}
