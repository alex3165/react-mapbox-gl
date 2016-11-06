import React, { PropTypes } from 'react';

class Feature extends React.PureComponent {
  render() {
    return null;
  }
}

Feature.propTypes = {
  coordinates: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  onEndHover: PropTypes.func,
  properties: PropTypes.object,
};

export default Feature;
