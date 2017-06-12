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

export default class GeoJSONLayer extends React.Component<Props, void> {
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

  private createLayer = (type: string) => {
    const { id, layerIds } = this;
    const { before, layerOptions } = this.props;
    const { map } = this.context;

    const layerId = `${id}-${type}`;
    layerIds.push(layerId);

    const paint: Paints = this.props[`${typeToLayerLUT[type]}Paint`] || {};

    // default undefined layers to invisible
    const visibility = Object.keys(paint).length ? 'visible' : 'none';
    const layout: Layouts = this.props[`${typeToLayerLUT[type]}Layout`] || {
      visibility
    };

    map.addLayer(
      {
        id: layerId,
        source: id,
        type: type as any,
        paint,
        layout,
        ...layerOptions
      },
      before
    );
  };

  public componentWillMount() {
    const { id, source } = this;
    const { map } = this.context;

    map.addSource(id, source);

    this.createLayer('symbol');
    this.createLayer('line');
    this.createLayer('fill');
    this.createLayer('fill-extrusion');
    this.createLayer('circle');
  }

  public componentWillUnmount() {
    const { id, layerIds } = this;
    const { map } = this.context;

    if (!map || !map.getStyle()) {
      return;
    }

    map.removeSource(id);

    layerIds.forEach(lId => map.removeLayer(lId));
  }

  public componentWillReceiveProps(props: Props) {
    const { id } = this;
    const { data } = this.props;
    const { map } = this.context;

    if (props.data !== data) {
      (map.getSource(id) as MapboxGL.GeoJSONSource).setData(props.data);
    }

    for (const type in typeToLayerLUT) {
      if (typeToLayerLUT.hasOwnProperty(type)) {
        const prop = typeToLayerLUT[type] + 'Paint';

        if (!isEqual(props[prop], this.props[prop])) {
          const paintDiff = diff(this.props[prop], props[prop]);

          Object.keys(paintDiff).forEach(key => {
            map.setPaintProperty(`${this.id}-${type}`, key, paintDiff[key]);
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
            map.setLayoutProperty(`${this.id}-${type}`, key, layoutDiff[key]);
          });
        }
      }
    }
  }

  public render() {
    return null;
  }
}
