import React, { PropTypes } from 'react';
import isEqual from 'deep-equal';
import diff from './util/diff';

let index = 0;
const generateID = () => {
  const newId = index + 1;
  index = newId;
  return index;
};

export default class GeoJSONLayer extends React.PureComponent {
  static contextTypes = {
    map: PropTypes.object,
  };

  static propTypes = {
    id: PropTypes.string,

    data: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,

    lineLayout: PropTypes.object,
    symbolLayout: PropTypes.object,
    circleLayout: PropTypes.object,
    fillLayout: PropTypes.object,

    linePaint: PropTypes.object,
    symbolPaint: PropTypes.object,
    circlePaint: PropTypes.object,
    fillPaint: PropTypes.object,

    sourceOptions: PropTypes.string,
    before: PropTypes.string,
  };

  id = this.props.id || `geojson-${generateID()}`;

  source = {
    type: 'geojson',
    ...this.props.sourceOptions,
    data: this.props.data,
  };

  layerIds = [];

  createLayer = (type) => {
    const { id, layerIds } = this;
    const { before } = this.props;
    const { map } = this.context;

    const layerId = `${id}-${type}`;
    layerIds.push(layerId);

    const paint = this.props[`${type}Paint`] || {};
    const layout = this.props[`${type}Layout`] || {};

    map.addLayer({
      id: layerId,
      source: id,
      type,
      paint,
      layout,
    }, before);
  };

  componentWillMount() {
    const { id, source } = this;
    const { map } = this.context;

    map.addSource(id, source);

    this.createLayer('symbol');
    this.createLayer('line');
    this.createLayer('fill');
    this.createLayer('circle');
  }

  componentWillUnmount() {
    const { id, layerIds } = this;
    const { map } = this.context;

    map.removeSource(id);

    layerIds.forEach(key => map.removeLayer(key));
  }

  componentWillReceiveProps(props) {
    const { id } = this;
    const { data, paint, layout } = this.props;
    const { map } = this.context;

    if (!isEqual(props.paint, paint)) {
      const paintDiff = diff(paint, props.paint);

      Object.keys(paintDiff).forEach((key) => {
        map.setPaintProperty(this.id, key, paintDiff[key]);
      });
    }

    if (!isEqual(props.layout, layout)) {
      const layoutDiff = diff(layout, props.layout);

      Object.keys(layoutDiff).forEach((key) => {
        map.setLayoutProperty(this.id, key, layoutDiff[key]);
      });
    }

    if (props.data !== data) {
      map
        .getSource(id)
        .setData(props.data);
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(nextProps.paint, this.props.paint) ||
      !isEqual(nextProps.layout, this.props.layout) ||
      nextProps.data !== this.props.data
    );
  }

  render() {
    return null;
  }
}

