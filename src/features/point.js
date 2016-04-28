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

  id = `point-${this.props.id || generateID()}`;

  onClick = evt => {
    if (this.props.onClick) {
      this.props.onClick(evt);
    }
  };

  componentWillMount() {
    const { id, onClick } = this;
    const { coordinates } = this.props;

    this.props.addFeature(id, {
      geometry: {
        type: "Point",
        coordinates
      },
      properties: { id },
      onClick
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.coordinates !== this.props.coordinates) {
      const { id, onClick } = this;
      const { coordinates } = nextProps;

      this.props.addFeature(id, {
        geometry: {
          type: "Point",
          coordinates
        },
        properties: { id },
        onClick
      });
    }
  }

  componentWillUnmount() {
    const { id } = this;
    this.props.removeFeature(this.id);
  }

  render() {
    return null;
  }
}

