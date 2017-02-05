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
  };

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

  componentWillReceiveProps(props) {
    const { id } = this;
    const { sourceOptions } = this.props;
    const { map } = this.context;

    if (props.sourceOptions.data !== sourceOptions.data) {
      map
        .getSource(id)
        .setData(props.sourceOptions.data);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.sourceOptions.data !== this.props.sourceOptions.data;
  }

  render() {
    return null;
  }

}
