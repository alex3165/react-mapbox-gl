import * as React from 'react';
const PropTypes = require('prop-types'); // tslint:disable-line
import * as MapboxGL from 'mapbox-gl';
const isEqual = require('deep-equal'); //tslint:disable-line
import diff from './util/diff';
import { generateID } from './util/uid';
import { Sources, SourceOptionData } from './util/types';

const typeToLayerLUT = {
  fill: 'fill',
  'fill-extrusion': 'fillExtrusion',
  symbol: 'symbol',
  circle: 'circle',
  line: 'line'
};

const eventToHandler = {
  mousemove: 'OnMouseMove',
  mouseenter: 'OnMouseEnter',
  mouseleave: 'OnMouseLeave',
  mousedown: 'OnMouseDown',
  mouseup: 'OnMouseUp',
  click: 'OnClick'
};

export interface Props {
  id?: string;
  data: SourceOptionData;
  sourceOptions?:
    | MapboxGL.VectorSource
    | MapboxGL.RasterSource
    | MapboxGL.GeoJSONSource
    | MapboxGL.GeoJSONSourceRaw;
  before?: string;

  fillLayout?: MapboxGL.FillLayout;
  fillExtrusionLayout?: MapboxGL.FillExtrusionLayout;
  symbolLayout?: MapboxGL.SymbolLayout;
  circleLayout?: MapboxGL.CircleLayout;
  lineLayout?: MapboxGL.LineLayout;

  fillPaint?: MapboxGL.FillPaint;
  fillExtrusionPaint?: MapboxGL.FillExtrusionPaint;
  symbolPaint?: MapboxGL.SymbolPaint;
  circlePaint?: MapboxGL.CirclePaint;
  linePaint?: MapboxGL.LinePaint;

  layerOptions?: MapboxGL.Layer;
}

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

export interface Context {
  map: MapboxGL.Map;
}

export default class GeoJSONLayer extends React.Component<Props, {}> {
  public context: Context;

  public static contextTypes = {
    map: PropTypes.object
  };

  private id: string = this.props.id || `geojson-${generateID()}`;

  private source: Sources = {
    type: 'geojson',
    ...this.props.sourceOptions,
    data: this.props.data
  };

  private layerIds: string[] = [];

  private buildLayerId = (type: string) => {
    return `${this.id}-${type}`;
  }

  private createLayer = (type: string) => {
    // const { id, layerIds } = this;
    const { before, layerOptions } = this.props;
    const { map } = this.context;

    const layerId = this.buildLayerId(type);
    this.layerIds.push(layerId);

    const paint: Paints = this.props[`${typeToLayerLUT[type]}Paint`] || {};

    // default undefined layers to invisible
    const visibility = Object.keys(paint).length ? 'visible' : 'none';
    const layout: Layouts = this.props[`${typeToLayerLUT[type]}Layout`] || {
      visibility
    };

    map.addLayer(
      {
        id: layerId,
        source: this.id,
        type: type as any,
        paint,
        layout,
        ...layerOptions
      },
      before
    );

    this.mapLayerMouseHandlers(type)
  };

  private mapLayerMouseHandlers = (type: string) => {
    const { map } = this.context;

    const layerId = this.buildLayerId(type);

    const events = Object.keys(eventToHandler);

    events.forEach(event => {
      const handler = this.props[`${typeToLayerLUT[type]}${eventToHandler[event]}`] || null;

      if (handler) {
        map.on(event, layerId, handler);
      }
    })
  }

  private onStyleDataChange = () => {
    // if the style of the map has been updated and we don't have layer anymore,
    // add it back to the map and force re-rendering to redraw it
    if (!this.context.map.getSource(this.id)) {
      this.initialize();
      this.forceUpdate();
    }
  };

  private initialize() {
    const { map } = this.context;

    map.addSource(this.id, this.source);

    this.createLayer('symbol');
    this.createLayer('line');
    this.createLayer('fill');
    this.createLayer('fill-extrusion');
    this.createLayer('circle');
  }

  public componentWillMount() {
    const { map } = this.context;
    this.initialize();
    map.on('styledata', this.onStyleDataChange);
  }

  public componentWillUnmount() {
    const { map } = this.context;

    if (!map || !map.getStyle()) {
      return;
    }

    map.removeSource(this.id);
    map.off('styledata', this.onStyleDataChange);
    this.layerIds.forEach(lId => map.removeLayer(lId));

    for (const type in typeToLayerLUT) {
      if (typeToLayerLUT.hasOwnProperty(type)) {
        for (const event in eventToHandler) {
          if (eventToHandler.hasOwnProperty(event)) {
            const prop = typeToLayerLUT[type] + eventToHandler[event];

            if (this.props[prop]) {
              map.off(event, this.buildLayerId(type), this.props[prop]);
            }
          }
        }
      }
    }
  }

  public componentWillReceiveProps(props: Props) {
    const { data } = this.props;
    const { map } = this.context;

    if (props.data !== data) {
      (map.getSource(this.id) as MapboxGL.GeoJSONSource).setData(props.data);
    }

    for (const type in typeToLayerLUT) {
      if (typeToLayerLUT.hasOwnProperty(type)) {
        const prop = typeToLayerLUT[type] + 'Paint';

        if (!isEqual(props[prop], this.props[prop])) {
          const paintDiff = diff(this.props[prop], props[prop]);

          Object.keys(paintDiff).forEach(key => {
            map.setPaintProperty(this.buildLayerId(type), key, paintDiff[key]);
          });
        }
      }
    }

    for (const type in typeToLayerLUT) {
      if (typeToLayerLUT.hasOwnProperty(type)) {
        const prop = typeToLayerLUT[type] + 'Layout';

        if (!isEqual(props[prop], this.props[prop])) {
          const layoutDiff = diff(this.props[prop], props[prop]);

          Object.keys(layoutDiff).forEach(key => {
            map.setLayoutProperty(this.buildLayerId(type), key, layoutDiff[key]);
          });
        }
      }
    }

    for (const type in typeToLayerLUT) {
      if (typeToLayerLUT.hasOwnProperty(type)) {
        for (const event in eventToHandler) {
          if (eventToHandler.hasOwnProperty(event)) {
            const prop = typeToLayerLUT[type] + eventToHandler[event];

            if (!isEqual(props[prop], this.props[prop])) {
              if (this.props[prop]) {
                map.off(event, this.buildLayerId(type), this.props[prop]);
              }

              if (props[prop]) {
                map.on(event, this.buildLayerId(type), props[prop]);
              }
            }
          }
        }
      }
    }
  }

  public render() {
    return null;
  }
}
