import * as React from 'react';
import * as MapboxGL from 'mapbox-gl';
const isEqual = require('deep-equal'); //tslint:disable-line
import diff from './util/diff';
import { generateID } from './util/uid';
import { Sources, LayerType } from './util/types';
import { withMap } from './context';

const types = ['symbol', 'line', 'fill', 'fill-extrusion', 'circle'];
const toCamelCase = (str: string) =>
  str
    .replace(
      /(?:^\w|[A-Z]|\b\w)/g,
      (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/[\s+]|-/g, '');

const eventToHandler = {
  mousemove: 'OnMouseMove',
  mouseenter: 'OnMouseEnter',
  mouseleave: 'OnMouseLeave',
  mousedown: 'OnMouseDown',
  mouseup: 'OnMouseUp',
  click: 'OnClick'
};

// tslint:disable-next-line:no-any
export type MouseEvent = (evt: any) => any;

export interface LineProps {
  linePaint?: MapboxGL.LinePaint;
  lineLayout?: MapboxGL.LineLayout;
  lineOnMouseMove?: MouseEvent;
  lineOnMouseEnter?: MouseEvent;
  lineOnMouseLeave?: MouseEvent;
  lineOnMouseDown?: MouseEvent;
  lineOnMouseUp?: MouseEvent;
  lineOnClick?: MouseEvent;
}

export interface CircleProps {
  circlePaint?: MapboxGL.CirclePaint;
  circleLayout?: MapboxGL.CircleLayout;
  circleOnMouseMove?: MouseEvent;
  circleOnMouseEnter?: MouseEvent;
  circleOnMouseLeave?: MouseEvent;
  circleOnMouseDown?: MouseEvent;
  circleOnMouseUp?: MouseEvent;
  circleOnClick?: MouseEvent;
}

export interface SymbolProps {
  symbolLayout?: MapboxGL.SymbolLayout;
  symbolPaint?: MapboxGL.SymbolPaint;
  symbolOnMouseMove?: MouseEvent;
  symbolOnMouseEnter?: MouseEvent;
  symbolOnMouseLeave?: MouseEvent;
  symbolOnMouseDown?: MouseEvent;
  symbolOnMouseUp?: MouseEvent;
  symbolOnClick?: MouseEvent;
}

export interface FillProps {
  fillLayout?: MapboxGL.FillLayout;
  fillPaint?: MapboxGL.FillPaint;
  fillOnMouseMove?: MouseEvent;
  fillOnMouseEnter?: MouseEvent;
  fillOnMouseLeave?: MouseEvent;
  fillOnMouseDown?: MouseEvent;
  fillOnMouseUp?: MouseEvent;
  fillOnClick?: MouseEvent;
}

export interface FillExtrusionProps {
  fillExtrusionLayout?: MapboxGL.FillExtrusionLayout;
  fillExtrusionPaint?: MapboxGL.FillExtrusionPaint;
  fillExtrusionOnMouseMove?: MouseEvent;
  fillExtrusionOnMouseEnter?: MouseEvent;
  fillExtrusionOnMouseLeave?: MouseEvent;
  fillExtrusionOnMouseDown?: MouseEvent;
  fillExtrusionOnMouseUp?: MouseEvent;
  fillExtrusionOnClick?: MouseEvent;
}

export interface Props
  extends LineProps,
    CircleProps,
    SymbolProps,
    FillProps,
    FillExtrusionProps {
  id?: string;
  data:
    | GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
    | GeoJSON.FeatureCollection<GeoJSON.Geometry>
    | string;
  layerOptions?: MapboxGL.Layer;
  sourceOptions?:
    | MapboxGL.VectorSource
    | MapboxGL.RasterSource
    | MapboxGL.GeoJSONSource
    | MapboxGL.GeoJSONSourceRaw;
  before?: string;
  map: MapboxGL.Map;
}

type MapboxEventTypes = Array<keyof MapboxGL.MapLayerEventType>;

type Paints =
  | MapboxGL.LinePaint
  | MapboxGL.SymbolPaint
  | MapboxGL.CirclePaint
  | MapboxGL.FillExtrusionPaint;
type Layouts =
  | MapboxGL.FillLayout
  | MapboxGL.LineLayout
  | MapboxGL.CircleLayout
  | MapboxGL.FillExtrusionLayout;

export class GeoJSONLayer extends React.Component<Props> {
  private id: string = this.props.id || `geojson-${generateID()}`;

  // TODO: Refactor to use defaultProps
  private source: Sources = {
    type: 'geojson',
    ...this.props.sourceOptions,
    data: this.props.data
    // tslint:disable-next-line:no-any
  } as any;

  private layerIds: string[] = [];

  private buildLayerId = (type: string) => {
    return `${this.id}-${type}`;
  };

  private createLayer = (type: LayerType) => {
    const { before, layerOptions, map } = this.props;

    const layerId = this.buildLayerId(type);
    this.layerIds.push(layerId);

    const paint: Paints = this.props[`${toCamelCase(type)}Paint`] || {};

    // default undefined layers to invisible
    const visibility = Object.keys(paint).length ? 'visible' : 'none';
    const layout: Layouts = this.props[`${toCamelCase(type)}Layout`] || {
      visibility
    };

    const layer: MapboxGL.Layer = {
      id: layerId,
      source: this.id,
      // TODO: Fix mapbox-gl types
      // tslint:disable-next-line:no-any
      type: type as any,
      // TODO: Fix mapbox-gl types
      // tslint:disable-next-line:no-any
      paint: paint as any,
      layout,
      ...layerOptions
    };

    map.addLayer(layer, before);

    this.mapLayerMouseHandlers(type);
  };

  private mapLayerMouseHandlers = (type: string) => {
    const { map } = this.props;

    const layerId = this.buildLayerId(type);

    const events = Object.keys(eventToHandler) as MapboxEventTypes;

    events.forEach(event => {
      const handler =
        this.props[`${toCamelCase(type)}${eventToHandler[event]}`] || null;

      if (handler) {
        map.on(event, layerId, handler);
      }
    });
  };

  private onStyleDataChange = () => {
    // if the style of the map has been updated and we don't have layer anymore,
    // add it back to the map and force re-rendering to redraw it
    if (!this.props.map.getSource(this.id)) {
      this.unbind();
      this.initialize();
      this.forceUpdate();
    }
  };

  private initialize() {
    const { map } = this.props;

    map.addSource(this.id, this.source);

    this.createLayer('symbol');
    this.createLayer('line');
    this.createLayer('fill');
    this.createLayer('fill-extrusion');
    this.createLayer('circle');
  }

  private unbind() {
    const { map } = this.props;

    if (map.getSource(this.id)) {
      const { layers } = map.getStyle();

      if (layers) {
        layers
          .filter(layer => layer.source === this.id)
          .forEach(layer => map.removeLayer(layer.id));
      }

      map.removeSource(this.id);
    }

    types.forEach(type => {
      const events = Object.keys(eventToHandler) as MapboxEventTypes;
      events.forEach(event => {
        const prop = toCamelCase(type) + eventToHandler[event];

        if (this.props[prop]) {
          map.off(event, this.buildLayerId(type), this.props[prop]);
        }
      });
    });

    this.layerIds.forEach(lId => {
      if (map.getLayer(lId)) {
        map.removeLayer(lId);
      }
    });
  }

  public componentDidMount() {
    const { map } = this.props;
    this.initialize();
    map.on('styledata', this.onStyleDataChange);
  }

  public componentWillUnmount() {
    const { map } = this.props;

    if (!map || !map.getStyle()) {
      return;
    }

    map.off('styledata', this.onStyleDataChange);

    this.unbind();
  }

  public isGeoJSONSource = (
    source?: Sources
  ): source is MapboxGL.GeoJSONSource =>
    !!source &&
    typeof (source as MapboxGL.GeoJSONSource).setData === 'function';

  public componentDidUpdate(prevProps: Props) {
    const { data, before, layerOptions, map } = prevProps;
    const source = map.getSource(this.id);
    if (!this.isGeoJSONSource(source)) {
      return;
    }

    if (this.props.data !== data) {
      source.setData(this.props.data);

      this.source = {
        type: 'geojson',
        ...this.props.sourceOptions,
        data: this.props.data
        // tslint:disable-next-line:no-any
      } as any;
    }

    const layerFilterChanged =
      this.props.layerOptions &&
      layerOptions &&
      !isEqual(this.props.layerOptions.filter, layerOptions.filter);

    types.forEach(type => {
      const layerId = this.buildLayerId(type);

      if (this.props.layerOptions && layerFilterChanged) {
        map.setFilter(layerId, this.props.layerOptions.filter || []);
      }

      const paintProp = toCamelCase(type) + 'Paint';

      if (!isEqual(prevProps[paintProp], this.props[paintProp])) {
        const paintDiff = diff(prevProps[paintProp], this.props[paintProp]);

        Object.keys(paintDiff).forEach(key => {
          map.setPaintProperty(layerId, key, paintDiff[key]);
        });
      }

      const layoutProp = toCamelCase(type) + 'Layout';

      if (!isEqual(prevProps[layoutProp], this.props[layoutProp])) {
        const layoutDiff = diff(prevProps[layoutProp], this.props[layoutProp]);

        Object.keys(layoutDiff).forEach(key => {
          map.setLayoutProperty(layerId, key, layoutDiff[key]);
        });
      }

      const events = Object.keys(eventToHandler) as MapboxEventTypes;

      events.forEach(event => {
        const prop = toCamelCase(type) + eventToHandler[event];

        if (prevProps[prop] !== this.props[prop]) {
          if (prevProps[prop]) {
            map.off(event, layerId, prevProps[prop]);
          }

          if (this.props[prop]) {
            map.on(event, layerId, this.props[prop]);
          }
        }
      });

      if (before !== this.props.before) {
        map.moveLayer(layerId, this.props.before);
      }
    });
  }

  public render() {
    return null;
  }
}

export default withMap(GeoJSONLayer);
