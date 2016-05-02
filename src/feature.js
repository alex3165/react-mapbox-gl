import React, { PropTypes } from "react";

const Feature = () => null;

Feature.propTypes = {
  coordinates: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  onEndHover: PropTypes.func
};

export default Feature;
