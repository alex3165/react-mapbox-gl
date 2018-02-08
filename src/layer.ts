import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as MapboxGL from 'mapbox-gl';
const isEqual = require('deep-equal'); //tslint:disable-line
import diff from './util/diff';
import { Feature, Context } from './util/types';
import { Props as FeatureProps } from './feature';

export type Paint =
  | MapboxGL.BackgroundPaint
  | MapboxGL.FillPaint
  | MapboxGL.FillExtrusionPaint
  | MapboxGL.SymbolPaint
  | MapboxGL.LinePaint
  | MapboxGL.RasterPaint
  | MapboxGL.CirclePaint;

export type Layout =
  | MapboxGL.BackgroundLayout
  | MapboxGL.FillLayout
  | MapboxGL.FillExtrusionLayout
  | MapboxGL.LineLayout
  | MapboxGL.SymbolLayout
  | MapboxGL.RasterLayout
  | MapboxGL.CircleLayout;

export interface ImageOptions {
  width?: number;
  height?: number;
  pixelRatio?: number;
}
export type ImageDefinition = [string, HTMLImageElement];
export type ImageDefinitionWithOptions = [
  string,
  HTMLImageElement,
  ImageOptions
];

export interface LayerCommonProps {
  type?:
    | 'symbol'
    | 'line'
    | 'fill'
    | 'circle'
    | 'raster'
    | 'fill-extrusion'
    | 'background'
    | 'heatmap';
  sourceId?: string;
  images?:
    | ImageDefinition
    | ImageDefinition[]
    | ImageDefinitionWithOptions
    | ImageDefinitionWithOptions[];
  before?: string;
  paint?: Paint;
  layout?: Layout;
  // tslint:disable-next-line:no-any
  metadata?: any;
  sourceLayer?: string;
  minZoom?: number;
  maxZoom?: number;
  geoJSONSourceOptions?: MapboxGL.GeoJSONSourceOptions;
  // tslint:disable-next-line:no-any
  filter?: any[];
  children?: JSX.Element | JSX.Element[];
}

export interface OwnProps {
  id: string;
  draggedChildren?: JSX.Element[];
}

export type Props = LayerCommonProps & OwnProps;

export default class Layer extends React.Component<Props> {
  public context: Context;

  public static contextTypes = {
    map: PropTypes.object
  };

  public static defaultProps = {
    type: 'symbol' as 'symbol',
    layout: {},
    paint: {}
  };

  private source: MapboxGL.GeoJSONSourceRaw = {
    type: 'geojson',
    ...this.props.geoJSONSourceOptions,
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  // tslint:disable-next-line:no-any
  private geometry = (coordinates: any) => {
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

  private makeFeature = (props: FeatureProps, id: number): Feature => ({
    type: 'Feature',
    geometry: this.geometry(props.coordinates),
    properties: { ...props.properties, id }
  });

  private initialize = () => {
    const {
      type,
      layout,
      paint,
      sourceId,
      before,
      images,
      id,
      metadata,
      sourceLayer,
      minZoom,
      maxZoom,
      filter
    } = this.props;
    const { map } = this.context;

    const layer: MapboxGL.Layer = {
      id,
      source: sourceId || id,
      // TODO: Fix mapbox-gl types
      // tslint:disable-next-line:no-any
      type: type as any,
      layout,
      paint,
      metadata
    };

    if (sourceLayer) {
      layer['source-layer'] = sourceLayer;
    }

    if (minZoom) {
      layer.minzoom = minZoom;
    }

    if (maxZoom) {
      layer.maxzoom = maxZoom;
    }

    if (filter) {
      layer.filter = filter;
    }

    if (images) {
      const normalizedImages = !Array.isArray(images[0]) ? [images] : images;
      (normalizedImages as ImageDefinitionWithOptions[]).forEach(image => {
        map.addImage(image[0], image[1], image[2]);
      });
    }

    if (!sourceId && !map.getSource(id)) {
      map.addSource(id, this.source);
    }

    if (!map.getLayer(id)) {
      map.addLayer(layer, before);
    }
  };

  private onStyleDataChange = () => {
    // if the style of the map has been updated and we don't have layer anymore,
    // add it back to the map and force re-rendering to redraw it
    if (!this.context.map.getLayer(this.props.id)) {
      this.initialize();
      this.forceUpdate();
    }
  };

  public componentWillMount() {
    const { map } = this.context;

    this.initialize();

    map.on('styledata', this.onStyleDataChange);
  }

  public componentWillUnmount() {
    const { map } = this.context;
    const { images, id } = this.props;

    if (!map || !map.getStyle()) {
      return;
    }

    if (map.getLayer(id)) {
      map.removeLayer(id);
    }
    // if pointing to an existing source, don't remove
    // as other layers may be dependent upon it
    if (!this.props.sourceId) {
      map.removeSource(id);
    }

    if (images) {
      const normalizedImages = !Array.isArray(images[0]) ? [images] : images;
      (normalizedImages as ImageDefinitionWithOptions[])
        .map(([key, ...rest]) => key)
        .forEach(map.removeImage);
    }

    map.off('styledata', this.onStyleDataChange);
  }

  public componentWillReceiveProps(props: Props) {
    const { paint, layout, before, filter, id, minZoom, maxZoom } = this.props;
    const { map } = this.context;

    if (!isEqual(props.paint, paint)) {
      const paintDiff = diff(paint, props.paint);

      Object.keys(paintDiff).forEach(key => {
        map.setPaintProperty(id, key, paintDiff[key]);
      });
    }

    if (!isEqual(props.layout, layout)) {
      const layoutDiff = diff(layout, props.layout);

      Object.keys(layoutDiff).forEach(key => {
        map.setLayoutProperty(id, key, layoutDiff[key]);
      });
    }

    if (props.filter && filter && !isEqual(props.filter, filter)) {
      map.setFilter(id, props.filter || []);
    }

    if (before !== props.before) {
      map.moveLayer(id, props.before);
    }

    if (minZoom !== props.minZoom || maxZoom !== props.maxZoom) {
      // TODO: Fix when PR https://github.com/DefinitelyTyped/DefinitelyTyped/pull/22036 is merged
      map.setLayerZoomRange(id, props.minZoom!, props.maxZoom!);
    }
  }

  public getChildren = () => {
    const { children } = this.props;

    if (!children) {
      return [];
    }

    if (Array.isArray(children)) {
      return (children as JSX.Element[][]).reduce(
        (arr, next) => arr.concat(next),
        [] as JSX.Element[]
      );
    }

    return [children] as JSX.Element[];
  };

  public render() {
    const { map } = this.context;
    const { sourceId, draggedChildren } = this.props;
    let children = this.getChildren();

    if (draggedChildren) {
      const draggableChildrenIds = draggedChildren.map(child => child.key);
      children = children.map(child => {
        const indexChildren = draggableChildrenIds.indexOf(child.key);
        if (indexChildren !== -1) {
          return draggedChildren[indexChildren];
        }
        return child;
      });
    }

    const features = (children! as Array<React.ReactElement<FeatureProps>>)
      .map(({ props }, id) => this.makeFeature(props, id))
      .filter(Boolean);

    const source = map.getSource(
      sourceId || this.props.id
    ) as MapboxGL.GeoJSONSource;

    if (source && !sourceId && source.setData) {
      source.setData({
        type: 'FeatureCollection',
        features
      });
    }

    return null;
  }
}
