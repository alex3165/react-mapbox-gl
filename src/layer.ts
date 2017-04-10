import * as React from 'react';
import * as MapboxGL from 'mapbox-gl';
const isEqual = require('deep-equal'); //tslint:disable-line
import diff from './util/diff';
import * as GeoJSON from 'geojson';
import { generateID } from './util/uid';
import { Sources } from './util/types';
import { Feature } from './util/types';
import { Props as FeatureProps } from './feature';

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
  map: ReactMapboxGL.Map;
}

export default class Layer extends React.Component<Props, void> {
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
    const features = evt.features as Feature[];
    const children: Array<React.ReactElement<FeatureProps>> = ([] as any).concat(this.props.children);
    const { map } = this.context;

    if (features) {
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
  }

  private onMouseMove = (evt: any) => {
    const features = evt.features as Feature[];
    const children: Array<React.ReactElement<FeatureProps>> = ([] as any).concat(this.props.children);
    const { map } = this.context;
    const oldHover = this.hover;
    const hover: string[] = [];

    if (features) {
      features.forEach((feature) => {
        const { id } = feature.properties;
        if (children) {
          const child = children[id];
          hover.push(id);

          const onMouseEnter = child && child.props.onMouseEnter;
          if (onMouseEnter) {
            onMouseEnter({ ...evt, feature, map });
          }
        }
      });
    }

    oldHover
      .filter((prevHoverId) => hover.indexOf(prevHoverId) === -1)
      .forEach((key) => {
        const child = children[key as any];
        const onMouseLeave = child && child.props.onMouseLeave;
        if (onMouseLeave) {
          onMouseLeave({ ...evt, map });
        }
      });

    this.hover = hover;
  }

  private addLayer = (map: ReactMapboxGL.Map, layer: any, before?: any) => {
    map.addLayer(layer, before);

    map.on('click', this.onClick);
    map.on('mousemove', this.onMouseMove);
  }

  private initialize = (map: ReactMapboxGL.Map) => {
    const { id, source } = this;
    const { type, layout, paint, layerOptions, sourceId, before } = this.props;

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
      this.addLayer(map, layer, before);
    }
    if (sourceId && !map.getSource(sourceId)) {
      const onSourceLoaded = (e: any) => {
        if (e.isSourceLoaded && e.sourceId === sourceId) {
          if (map.getLayer(id)) {
            map.removeLayer(id);
          }
          map.off('sourcedata');
          this.addLayer(map, layer, before);
        }
      };
      map.on('sourcedata', onSourceLoaded);
    } else {
      this.addLayer(map, layer, before);
    }
  }

  private clear = (map: ReactMapboxGL.Map, id: string) => {
    if (map && map.getStyle()) {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      // if pointing to an existing source, don't remove
      // as other layers may be dependent upon it
      if (!this.props.sourceId && map.getSource(id)) {
        map.removeSource(id);
      }

      map.off('click', this.onClick);
      map.off('mousemove', this.onMouseMove);
    }
  }

  private onStyleDataChange = () => {
    // if the style of the map has been updated and we don't have layer anymore,
    // add it back to the map and force re-rendering to redraw it
    if (!this.context.map.getLayer(this.id)) {
      this.initialize(this.context.map);
      this.forceUpdate();
    }
  }

  public componentWillMount() {
    this.context.map.on('styledata', this.onStyleDataChange);
    this.initialize(this.context.map);
  }

  public componentWillUnmount() {
    this.context.map.off('styledata', this.onStyleDataChange);
    this.clear(this.context.map, this.id);
  }

  public componentWillReceiveProps(props: Props) {
    const { paint, layout, before, layerOptions } = this.props;
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

    if ((props.layerOptions && layerOptions) && !isEqual(props.layerOptions.filter, layerOptions.filter)) {
      map.setFilter(this.id, props.layerOptions.filter ? props.layerOptions.filter : []);
    }

    if (before !== props.before) {
      map.moveLayer(this.id, props.before);
    }
  }

  public render() {
    const { map } = this.context;

    const children = ([] as any).concat(this.props.children || []);

    const features = children
      .map(({ props }: any, id: string) => this.makeFeature(props, id))
      .filter(Boolean);

    const source = map.getSource(this.props.sourceId || this.id) as MapboxGL.GeoJSONSource;

    if (source && source.setData) {
      source.setData({
        type: 'FeatureCollection',
        features
      });
    }

    return null;
  }
}
