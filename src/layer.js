import React, { PropTypes } from 'react';
import isEqual from 'deep-equal';
import diff from './util/diff';

let index = 0;
const generateID = () => {
  const newId = index + 1;
  index = newId;
  return index;
};

export default class Layer extends React.PureComponent {
  static contextTypes = {
    map: PropTypes.object,
  };

  static propTypes = {
    id: PropTypes.string,

    type: PropTypes.oneOf([
      'symbol',
      'line',
      'fill',
      'circle',
      'raster',
    ]),

    layout: PropTypes.object,
    paint: PropTypes.object,
    sourceOptions: PropTypes.object,
    layerOptions: PropTypes.object,
    sourceId: PropTypes.string,
    before: PropTypes.string,
    filter: PropTypes.array,
  };

  static defaultProps = {
    type: 'symbol',
    layout: {},
    paint: {},
  };

  hover = [];

  id = this.props.id || `layer-${generateID()}`;

  source = {
    type: 'geojson',
    ...this.props.sourceOptions,
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  };

  geometry = (coordinates) => {
    switch (this.props.type) {
      case 'symbol':
      case 'circle': return {
        type: 'Point',
        coordinates,
      };

      case 'fill': return {
        type: coordinates.length > 1 ? 'MultiPolygon' : 'Polygon',
        coordinates,
      };

      case 'line': return {
        type: 'LineString',
        coordinates,
      };

      default: return null;
    }
  };

  feature = (props, id) => ({
    type: 'Feature',
    geometry: this.geometry(props.coordinates),
    properties: {
      ...props.properties,
      id,
    },
  })

  onClick = (evt) => {
    const children = [].concat(this.props.children);
    const { map } = this.context;
    const { id } = this;
    const features = map.queryRenderedFeatures(evt.point, { layers: [id] });

    features.forEach((feature) => {
      const { properties } = feature;
      const child = children[properties.id];

      const onClick = child && child.props.onClick;
      if (onClick) {
        onClick({ ...evt, feature, map });
      }
    });
  };

  onMouseMove = (evt) => {
    const children = [].concat(this.props.children);
    const { map } = this.context;
    const { id } = this;

    const oldHover = this.hover;
    const hover = [];

    const features = map.queryRenderedFeatures(evt.point, { layers: [id] });

    features.forEach((feature) => {
      const { properties } = feature;
      const child = children[properties.id];
      hover.push(properties.id);

      const onHover = child && child.props.onHover;
      if (onHover) {
        onHover({ ...evt, feature, map });
      }
    });

    oldHover
      .filter(prevHoverId => hover.indexOf(prevHoverId) === -1)
      .forEach((key) => {
        const onEndHover = children[key] && children[key].props.onEndHover;
        if (onEndHover) {
          onEndHover({ ...evt, map });
        }
      });

    this.hover = hover;
  };

  componentWillMount() {
    const { id, source } = this;
    const { type, layout, paint, layerOptions, sourceId, before, filter } = this.props;
    const { map } = this.context;

    const layer = {
      id,
      source: sourceId || id,
      type,
      layout,
      paint,
      ...layerOptions,
    };

    if (!sourceId) {
      map.addSource(id, source);
    }

    map.addLayer(layer, before);

    if (filter) {
      map.setFilter(id, filter);
    }

    map.on('click', this.onClick);
    map.on('mousemove', this.onMouseMove);
  }

  componentWillUnmount() {
    const { id } = this;

    const { map } = this.context;

    map.removeLayer(id);
    // if pointing to an existing source, don't remove
    // as other layers may be dependent upon it
    if (!this.props.sourceId) {
      map.removeSource(id);
    }

    map.off('click', this.onClick);
    map.off('mousemove', this.onMouseMove);
  }

  componentWillReceiveProps(props) {
    const { paint, layout, filter } = this.props;
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

    if (!isEqual(props.filter, filter)) {
      map.setFilter(this.id, props.filter);
    }
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.children, this.props.children)
        || !isEqual(nextProps.paint, this.props.paint)
        || !isEqual(nextProps.layout, this.props.layout)
        || !isEqual(nextProps.filter, this.props.filter);
  }

  render() {
    const { map } = this.context;

    if (this.props.children) {
      const children = [].concat(this.props.children);

      const features = children
        .map(({ props }, id) => this.feature(props, id))
        .filter(Boolean);

      const source = map.getSource(this.props.sourceId || this.id);
      source.setData({
        type: 'FeatureCollection',
        features,
      });
    }

    return null;
  }
}

