import * as React from 'react';
import * as MapboxGL from 'mapbox-gl';
const isEqual = require('deep-equal'); //tslint:disable-line
import diff from './util/diff';
import * as GeoJSON from 'geojson';
import { generateID } from './util/uid';
import { Sources } from './util/types';
import { Feature } from './util/types';

export type Paint = any;
export type Layout = any;

export interface Props {
  id?: string;
  type?: 'symbol' | 'line' | 'fill' | 'circle' | 'raster';
  sourceId?: string;
  before?: string;
  sourceOptions?: Sources;
  paint?: Paint;
  layout?: Layout;
  layerOptions?: MapboxGL.Layer;
  children?: JSX.Element;
}

export interface Context {
  map: MapboxGL.Map;
}

export default class Layer extends React.PureComponent<Props, void> {
  public context: Context;

  public static contextTypes = {
    map: React.PropTypes.object
  };

  public static defaultProps = {
    type: 'symbol',
    layout: {},
    paint: {}
  };

  private hover: string[] = [];

  private id: string = this.props.id || `layer-${generateID()}`;

  private source: Sources = {
    type: 'geojson',
    ...this.props.sourceOptions,
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  private geometry = (coordinates: GeoJSON.Position) => {
    switch (this.props.type) {
      case 'symbol':
      case 'circle': return {
        type: 'Point',
        coordinates
      };

      case 'fill': return {
        type: coordinates.length > 1 ? 'MultiPolygon' : 'Polygon',
        coordinates
      };

      case 'line': return {
        type: 'LineString',
        coordinates
      };

      default: return {
        type: 'Point',
        coordinates
      };
    }
  }

  private makeFeature = (props: any, id: string): Feature => ({
    type: 'Feature',
    geometry: this.geometry(props.coordinates),
    properties: { ...props.properties, id }
  })

  private onClick = (evt: any) => {
    const children = ([] as any).concat(this.props.children);
    const { map } = this.context;
    const features = map.queryRenderedFeatures(evt.point, { layers: [this.id] }) as Feature[];

    features.forEach((feature) => {
      const { id } = feature.properties;
      if (children) {
        const child = children[id];

        const onClick = child && child.props.onClick;
        if (onClick) {
          onClick({ ...evt, feature, map });
        }
      }
    });
  }

  private onMouseMove = (evt: any) => {
    const children = ([] as any).concat(this.props.children);
    const { map } = this.context;

    const oldHover = this.hover;
    const hover: string[] = [];

    const features = map.queryRenderedFeatures(evt.point, { layers: [this.id] }) as Feature[];

    features.forEach((feature) => {
      const { id } = feature.properties;
      if (children) {
        const child = children[id];
        hover.push(id);

        const onHover = child && child.props.onHover;
        if (onHover) {
          onHover({ ...evt, feature, map });
        }
      }
    });

    oldHover
      .filter((prevHoverId) => hover.indexOf(prevHoverId) === -1)
      .forEach((key) => {
        const onEndHover = children[key] && children[key].props.onEndHover;
        if (onEndHover) {
          onEndHover({ ...evt, map });
        }
      });

    this.hover = hover;
  }

  public componentWillMount() {
    const { id, source } = this;
    const { type, layout, paint, layerOptions, sourceId, before } = this.props;
    const { map } = this.context;

    const layer = {
      id,
      source: sourceId || id,
      type,
      layout,
      paint,
      ...layerOptions
    };

    if (!sourceId) {
      map.addSource(id, source);
    }

    map.addLayer(layer, before);

    map.on('click', this.onClick);
    map.on('mousemove', this.onMouseMove);
  }

  public componentWillUnmount() {
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

  public componentWillReceiveProps(props: Props) {
    const { paint, layout,  before } = this.props;
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

    if (before !== props.before) {
      map.moveLayer(this.id, props.before);
    }
  }

  public shouldComponentUpdate(nextProps: Props) {
    return !isEqual(nextProps.children, this.props.children)
        || !isEqual(nextProps.paint, this.props.paint)
        || !isEqual(nextProps.layout, this.props.layout);
  }

  public render() {
    const { map } = this.context;
    const children = ([] as any).concat(this.props.children || []);

    const features = children
      .map(({ props }: any, id: string) => this.makeFeature(props, id))
      .filter(Boolean);

    const source = map.getSource(this.props.sourceId || this.id);
    (source as MapboxGL.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features
    });

    return null;
  }
}
