import * as React from 'react';
import * as PropTypes from 'prop-types';
const isEqual = require('deep-equal'); //tslint:disable-line

import { Map, GeoJSONSource, GeoJSONSourceRaw, Layer } from 'mapbox-gl';
import { SourceOptionData, TilesJson } from './util/types';

export interface Context {
  map: Map;
}

export interface Props {
  id: string;
  geoJsonSource?: GeoJSONSourceRaw;
  tileJsonSource?: TilesJson;
  onSourceAdded?: (source: GeoJSONSource | TilesJson) => void;
  onSourceLoaded?: (source: GeoJSONSource | TilesJson) => void;
}

export interface LayerWithBefore extends Layer {
  before?: string;
}

export default class Source extends React.Component<Props> {
  public context: Context;

  public static contextTypes = {
    map: PropTypes.object
  };

  private id = this.props.id;

  private onStyleDataChange = () => {
    // if the style of the map has been updated we won't have any sources anymore,
    // add it back to the map and force re-rendering to redraw it
    if (!this.context.map.getLayer(this.id)) {
      this.initialize();
      this.forceUpdate();
    }
  };

  public componentWillMount() {
    const { map } = this.context;

    map.on('styledata', this.onStyleDataChange);
    this.initialize();
  }

  private initialize = () => {
    const { map } = this.context;
    const { geoJsonSource, tileJsonSource, onSourceAdded } = this.props;

    if (!map.getSource(this.id) && (geoJsonSource || tileJsonSource)) {
      if (geoJsonSource) {
        map.addSource(this.id, geoJsonSource);
      } else if (tileJsonSource) {
        map.addSource(this.id, tileJsonSource);
      }

      map.on('sourcedata', this.onData);

      if (onSourceAdded) {
        onSourceAdded(map.getSource(this.id) as GeoJSONSource | TilesJson);
      }
    }
  };

  // tslint:disable-next-line:no-any
  private onData = (event: any) => {
    const { map } = this.context;

    const source = map.getSource(this.props.id) as GeoJSONSource;
    if (!source || !map.isSourceLoaded(this.props.id)) {
      return;
    }

    const { onSourceLoaded } = this.props;
    if (source && onSourceLoaded) {
      onSourceLoaded(source);
    }
    // Will fix datasource being empty
    if (source && this.props.geoJsonSource && this.props.geoJsonSource.data) {
      source.setData(this.props.geoJsonSource.data as SourceOptionData);
    }
    map.off('sourcedata', this.onData);
  };

  public removeSource(): LayerWithBefore[] {
    const { map } = this.context;

    if (map.getSource(this.id)) {
      let { layers = [] } = map.getStyle();

      layers = layers
        .map((layer, idx) => {
          const { id: before } = layers[idx + 1] || { id: undefined };
          return { ...layer, before };
        })
        .filter(layer => layer.source === this.id);

      layers.forEach(layer => map.removeLayer(layer.id));

      map.removeSource(this.id);

      return layers.reverse();
    }

    return [];
  }

  public componentWillUnmount() {
    const { map } = this.context;

    if (!map || !map.getStyle()) {
      return;
    }

    map.off('styledata', this.onStyleDataChange);
    this.removeSource();
  }

  public componentWillReceiveProps(props: Props) {
    const { geoJsonSource, tileJsonSource } = this.props;
    const { map } = this.context;

    // Update tilesJsonSource
    if (tileJsonSource && props.tileJsonSource) {
      const hasNewTilesSource =
        tileJsonSource.url !== props.tileJsonSource.url ||
        // Check for reference equality on tiles array
        !isEqual(tileJsonSource.tiles, props.tileJsonSource.tiles) ||
        tileJsonSource.minzoom !== props.tileJsonSource.minzoom ||
        tileJsonSource.maxzoom !== props.tileJsonSource.maxzoom;

      if (hasNewTilesSource) {
        const layers = this.removeSource();
        map.addSource(this.id, props.tileJsonSource);

        layers.forEach(layer => map.addLayer(layer, layer.before));
      }
    }

    // Update geoJsonSource data
    if (
      geoJsonSource &&
      props.geoJsonSource &&
      props.geoJsonSource.data !== geoJsonSource.data &&
      map.getSource(this.id)
    ) {
      const source = map.getSource(this.id) as GeoJSONSource;
      source.setData(props.geoJsonSource.data as SourceOptionData);
    }
  }

  public render() {
    return null;
  }
}
