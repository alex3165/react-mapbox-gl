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

  compareTileUrls(nextTileUrls) {
    const tileUrls = this.props.sourceOptions.tiles;
    let changed = false;
    changed = tileUrls.some((tileUrl, index, array) => {
      if (array.length !== nextTileUrls.length) {
        return true;
      }
      if (nextTileUrls[index] !== tileUrl) {
        return true;
      }
      return false;
    });
    return changed;
  }

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

  componentWillReceiveProps(nextProps) {
    const { id } = this;
    const { sourceOptions } = this.props;
    const { map } = this.context;
    let newTiles = false;
    if (typeof this.props.sourceOptions.tiles !== typeof nextProps.sourceOptions.tiles) {
      newTiles = true;
    } else if (Array.isArray(this.props.sourceOptions.tiles)) {
      newTiles = this.compareTileUrls(nextProps.sourceOptions.tiles);
    }
    if (newTiles === true) {
      this.source = nextProps.sourceOptions;
      this.map = nextProps.id;
      map
        .removeSource(id);
      map.addSource(this.id, this.source);
    }
    if (nextProps.sourceOptions.data !== sourceOptions.data) {
      map
        .getSource(id)
        .setData(nextProps.sourceOptions.data);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.sourceOptions.data !== this.props.sourceOptions.data;
  }

  render() {
    return null;
  }

}
