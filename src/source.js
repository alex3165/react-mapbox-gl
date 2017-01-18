import React, { PropTypes } from 'react';

export default class Source extends React.Component {

  static contextTypes = {
    map: PropTypes.object,
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    sourceOptions: PropTypes.object,
  };

  id = this.props.id;

  source = {
    ...this.props.sourceOptions,
  }

  componentWillMount() {
    const { map } = this.context;
    if (!map.getSource(this.id)) {
      map.addSource(this.id, this.source);
    }
  }

  componentWillUnmount() {
    const { map } = this.context;
    if (map.getSource(this.id)) {
      map.removeSource(this.id);
    }
  }

  render() {
    return null;
  }

}
