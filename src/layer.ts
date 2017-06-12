import * as React from 'react';
const PropTypes = require('prop-types'); // tslint:disable-line

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
  layerOptions?: Partial<MapboxGL.Layer>;
  children?: JSX.Element | JSX.Element[];
}

export interface Context {
  map: MapboxGL.Map;
}

export default class Layer extends React.Component<Props, void> {
  public context: Context;

  public static contextTypes = {
    map: PropTypes.object
  };

  public static defaultProps = {
    type: 'symbol',
    layout: {},
    paint: {}
  };

  private hover: number[] = [];
  private isDragging: boolean = false;
  private draggedChildren: any = undefined;

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
      case 'circle':
        return {
          type: 'Point',
          coordinates
        };

      case 'fill':
        return {
          type: coordinates.length > 1 ? 'MultiPolygon' : 'Polygon',
          coordinates
        };

      case 'line':
        return {
          type: 'LineString',
          coordinates
        };

      default:
        return {
          type: 'Point',
          coordinates
        };
    }
  };

  private makeFeature = (props: any, id: number): Feature => ({
    type: 'Feature',
    geometry: this.geometry(props.coordinates),
    properties: { ...props.properties, id }
  });

  private onClick = (evt: any) => {
    const features = evt.features as Feature[];
    const children = this.getChildren();

    const { map } = this.context;

    if (features) {
      features.forEach(feature => {
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
  };

  private getChildren = () =>
    ([] as any).concat(this.props.children) as Array<
      React.ReactElement<FeatureProps>
    >;

  private onMouseEnter = (evt: any) => {
    const children = this.getChildren();
    const { map } = this.context;

    // TODO: Check if a children is draggable
    map.dragPan.disable();

    this.hover = [];

    evt.features.forEach((feature: Feature) => {
      const { id } = feature.properties;
      if (children) {
        const child = children[id];

        this.hover.push(id);
        const onMouseEnter = child && child.props.onMouseEnter;
        if (onMouseEnter) {
          onMouseEnter({ ...evt, feature, map });
        }
      }
    });
  };

  private onMouseLeave = (evt: any) => {
    const children = this.getChildren();
    const { map } = this.context;

    // TODO: Check if a children is draggable
    map.dragPan.enable();

    this.hover.forEach(id => {
      const child = children[id];
      const onMouseLeave = child && child.props.onMouseLeave;
      if (onMouseLeave) {
        onMouseLeave({ ...evt, map });
      }
    });

    this.hover = [];
  };

  private onMouseDown = () => {
    const { map } = this.context;
    if (this.hover.length === 0) {
      return;
    }

    this.isDragging = true;
    map.on('mousemove', this.onDragMove);
    map.once('mouseup', this.onDragUp);
  };

  private onDragMove = ({ lngLat }: any) => {
    if (!this.isDragging) {
      return;
    }
    const children = this.getChildren();

    this.draggedChildren = children.map((child, index) => {
      if (this.hover.includes(index) && child.props.draggable) {
        return React.cloneElement(child, {
          coordinates: [lngLat.lng, lngLat.lat]
        });
      }

      return child;
    });

    this.forceUpdate();
  };

  private onDragUp = (evt: any) => {
    const { map } = this.context;
    const children = this.getChildren();

    this.isDragging = false;
    this.draggedChildren = undefined;

    this.hover.map(id => {
      const child = children[id];
      const onDragEnd = child && child.props.onDragEnd;
      if (onDragEnd) {
        onDragEnd({ ...evt, map });
      }
    });

    map.off('mousemove', this.onDragMove);
  };

  private initialize = () => {
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
  };

  private onStyleDataChange = () => {
    // if the style of the map has been updated and we don't have layer anymore,
    // add it back to the map and force re-rendering to redraw it
    if (!this.context.map.getLayer(this.id)) {
      this.initialize();
      this.forceUpdate();
    }
  };

  public componentWillMount() {
    const { map } = this.context;

    this.initialize();

    map.on('click', this.id, this.onClick);
    map.on('mouseenter', this.id, this.onMouseEnter);
    map.on('mouseleave', this.id, this.onMouseLeave);
    map.on('mousedown', this.onMouseDown);
    map.on('styledata', this.onStyleDataChange);
  }

  public componentWillUnmount() {
    const { map } = this.context;
    const { id } = this;
    if (!map || !map.getStyle()) {
      return;
    }

    map.removeLayer(id);
    // if pointing to an existing source, don't remove
    // as other layers may be dependent upon it
    if (!this.props.sourceId) {
      map.removeSource(id);
    }

    map.off('click', this.onClick);
    map.off('mouseenter', this.onMouseEnter);
    map.off('mouseleave', this.onMouseLeave);
    map.off('styledata', this.onStyleDataChange);
  }

  public componentWillReceiveProps(props: Props) {
    const { paint, layout, before, layerOptions } = this.props;
    const { map } = this.context;

    if (!isEqual(props.paint, paint)) {
      const paintDiff = diff(paint, props.paint);

      Object.keys(paintDiff).forEach(key => {
        map.setPaintProperty(this.id, key, paintDiff[key]);
      });
    }

    if (!isEqual(props.layout, layout)) {
      const layoutDiff = diff(layout, props.layout);

      Object.keys(layoutDiff).forEach(key => {
        map.setLayoutProperty(this.id, key, layoutDiff[key]);
      });
    }

    if (
      props.layerOptions &&
      layerOptions &&
      !isEqual(props.layerOptions.filter, layerOptions.filter)
    ) {
      map.setFilter(this.id, props.layerOptions.filter as any);
    }

    if (before !== props.before) {
      map.moveLayer(this.id, props.before);
    }
  }

  public render() {
    const { map } = this.context;
    const { sourceId } = this.props;
    let { children } = this.props;

    if (!children) {
      children = [] as JSX.Element[];
    }

    if (this.draggedChildren) {
      children = this.draggedChildren;
    } else {
      children = Array.isArray(children)
        ? (children as JSX.Element[][]).reduce(
            (arr, next) => arr.concat(next),
            [] as JSX.Element[]
          )
        : [children] as JSX.Element[];
    }

    const features = (children! as Array<React.ReactElement<any>>)
      .map(({ props }, id) => this.makeFeature(props, id))
      .filter(Boolean);

    const source = map.getSource(sourceId || this.id) as MapboxGL.GeoJSONSource;

    if (source && !sourceId && source.setData) {
      source.setData({
        type: 'FeatureCollection',
        features
      });
    }

    return null;
  }
}
