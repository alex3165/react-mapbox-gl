import * as React from 'react';
import * as MapboxGL from 'mapbox-gl';
const isEqual = require('deep-equal'); //tslint:disable-line
import diff from './util/diff';
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

// tslint:disable-next-line:no-any
export type MouseEvent = (evt: any) => any;

export interface LayerEvents {
  onMouseMove?: MouseEvent;
  onMouseEnter?: MouseEvent;
  onMouseLeave?: MouseEvent;
  onMouseDown?: MouseEvent;
  onMouseUp?: MouseEvent;
  onClick?: MouseEvent;
  onTouchStart?: MouseEvent;
  onTouchEnd?: MouseEvent;
  onTouchCancel?: MouseEvent;
}

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
  map: MapboxGL.Map;
}

export type Props = LayerCommonProps & LayerEvents & OwnProps;

type EventToHandlersType = {
  [key in keyof MapboxGL.MapLayerEventType]?: keyof LayerEvents
};

const eventToHandler: EventToHandlersType = {
  touchstart: 'onTouchStart',
  touchend: 'onTouchEnd',
  touchcancel: 'onTouchCancel',
  mousemove: 'onMouseMove',
  mouseenter: 'onMouseEnter',
  mouseleave: 'onMouseLeave',
  mousedown: 'onMouseDown',
  mouseup: 'onMouseUp',
  click: 'onClick'
};

export default class Layer extends React.Component<Props> {
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
  private geometry = (coordinates: any): GeoJSON.Geometry => {
    switch (this.props.type) {
      case 'symbol':
      case 'circle':
        return {
          type: 'Point',
          coordinates
        };

      case 'fill':
        if (Array.isArray(coordinates[0][0][0])) {
          return {
            type: 'MultiPolygon',
            coordinates
          };
        }
        return {
          type: 'Polygon',
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

  private makeFeature = (
    props: FeatureProps,
    id: number
  ): GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> => ({
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
    const { map } = this.props;

    const layer: MapboxGL.Layer = {
      id,
      source: sourceId || id,
      // TODO: Fix mapbox-gl types
      // tslint:disable-next-line:no-any
      type: type as any,
      layout,
      // TODO: Fix mapbox-gl types
      // tslint:disable-next-line:no-any
      paint: paint as any,
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
      (normalizedImages as ImageDefinitionWithOptions[])
        .filter(image => !map.hasImage(image[0]))
        .forEach(image => {
          map.addImage(image[0], image[1], image[2]);
        });
    }

    if (!sourceId && !map.getSource(id)) {
      map.addSource(id, this.source);
    }

    if (!map.getLayer(id)) {
      map.addLayer(layer, before);
    }

    (Object.entries(eventToHandler) as Array<
      [keyof EventToHandlersType, keyof LayerEvents]
    >).forEach(([event, propName]) => {
      const handler = this.props[propName];
      if (handler) {
        map.on(event, id, handler);
      }
    });
  };

  private onStyleDataChange = () => {
    // if the style of the map has been updated and we don't have layer anymore,
    // add it back to the map and force re-rendering to redraw it
    if (!this.props.map.getLayer(this.props.id)) {
      this.initialize();
      this.forceUpdate();
    }
  };

  public componentDidMount() {
    const { map } = this.props;

    this.initialize();

    map.on('styledata', this.onStyleDataChange);
  }

  public componentWillUnmount() {
    const { map } = this.props;
    const { images, id } = this.props;

    if (!map || !map.getStyle()) {
      return;
    }

    map.off('styledata', this.onStyleDataChange);

    (Object.entries(eventToHandler) as Array<
      [keyof EventToHandlersType, keyof LayerEvents]
    >).forEach(([event, propName]) => {
      const handler = this.props[propName];
      if (handler) {
        map.off(event, id, handler);
      }
    });

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
        .forEach(map.removeImage.bind(map));
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      paint,
      layout,
      before,
      filter,
      id,
      minZoom,
      maxZoom,
      map
    } = prevProps;

    if (!isEqual(this.props.paint, paint)) {
      const paintDiff = diff(paint, this.props.paint);

      Object.keys(paintDiff).forEach(key => {
        map.setPaintProperty(id, key, paintDiff[key]);
      });
    }

    if (!isEqual(this.props.layout, layout)) {
      const layoutDiff = diff(layout, this.props.layout);

      Object.keys(layoutDiff).forEach(key => {
        map.setLayoutProperty(id, key, layoutDiff[key]);
      });
    }

    if (!isEqual(this.props.filter, filter)) {
      map.setFilter(id, this.props.filter);
    }

    if (before !== this.props.before) {
      map.moveLayer(id, this.props.before);
    }

    if (minZoom !== this.props.minZoom || maxZoom !== this.props.maxZoom) {
      // TODO: Fix when PR https://github.com/DefinitelyTyped/DefinitelyTyped/pull/22036 is merged
      map.setLayerZoomRange(id, this.props.minZoom!, this.props.maxZoom!);
    }

    (Object.entries(eventToHandler) as Array<
      [keyof EventToHandlersType, keyof LayerEvents]
    >).forEach(([event, propName]) => {
      const oldHandler = prevProps[propName];
      const newHandler = this.props[propName];

      if (oldHandler !== newHandler) {
        if (oldHandler) {
          map.off(event, id, oldHandler);
        }

        if (newHandler) {
          map.on(event, id, newHandler);
        }
      }
    });
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
    const { map } = this.props;
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
        features: features as GeoJSON.Feature[]
      });
    }

    return null;
  }
}
