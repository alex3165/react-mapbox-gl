import React, { Component, PropTypes } from "react";

let index = 0;
function generateID() {
  return index++;
}

export default class Point extends Component {
  static propTypes = {
    addFeature: PropTypes.func.isRequired,
    removeFeature: PropTypes.func.isRequired,
    sourceName: PropTypes.func.isRequired,

    id: PropTypes.string,
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    onClick: PropTypes.func
  };

  render() {
    return null;
  }
}

