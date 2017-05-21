import * as React from 'react';
const PropTypes = require('prop-types'); // tslint:disable-line
import {
  Map,
  GeoJSONSource,
  GeoJSONSourceRaw
} from 'mapbox-gl';
import { SourceOptionData, TilesJson } from './util/types';

export interface Context {
  map: Map;
}

export interface Props {
  id: string;
  geoJsonSource?: GeoJSONSourceRaw;
  tileJsonSource?: TilesJson;
  onSourceAdded?: (source: GeoJSONSource | TilesJson) => any;
  onSourceLoaded?: (source: GeoJSONSource | TilesJson) => any;
}

export default class Source extends React.Component<Props, void> {
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
  }

  public componentWillMount() {
    const { map } = this.context;

    map.on('styledata', this.onStyleDataChange);
    this.initialize();
  }

  private initialize = () => {
    const { map } = this.context;
    const { geoJsonSource, tileJsonSource, onSourceAdded } = this.props;

    if (!map.getSource(this.id) && (geoJsonSource || tileJsonSource)) {
      map.addSource(this.id, (geoJsonSource || tileJsonSource) as any);
      map.on('load', this.onData);

      if (onSourceAdded) {
        onSourceAdded(map.getSource(this.id) as GeoJSONSource | TilesJson);
      }
    }
  }

  private onData = (event: any) => {
    const { map } = this.context;

    const source = map.getSource(this.props.id) as GeoJSONSource;

    const { onSourceLoaded } = this.props;
    if (source && onSourceLoaded) {
      onSourceLoaded(source);
    }
    // Will fix datasource being empty
    if (source && this.props.geoJsonSource && this.props.geoJsonSource.data) {
      source.setData(this.props.geoJsonSource.data as SourceOptionData);
    }
    map.off('load', this.onData);
  }

  public componentWillUnmount() {
    const { map } = this.context;

    map.off('styledata', this.onStyleDataChange);

    if (map.getSource(this.id)) {
      map.removeSource(this.id);
    }
  }

  public componentWillReceiveProps(props: Props) {
    const { id } = this;
    const { geoJsonSource, tileJsonSource } = this.props;
    const { map } = this.context;

    // Update tilesJsonSource
    if (tileJsonSource && props.tileJsonSource) {
      const hasNewTilesSource = (
        tileJsonSource.url !== props.tileJsonSource.url ||
        // Check for reference equality on tiles array
        tileJsonSource.tiles !== props.tileJsonSource.tiles ||
        tileJsonSource.minzoom !== props.tileJsonSource.minzoom ||
        tileJsonSource.maxzoom !== props.tileJsonSource.maxzoom
      );

      if (hasNewTilesSource) {
        map.removeSource(id);
        map.addSource(id, props.tileJsonSource as any);
      }
    }

    // Update geoJsonSource data
    if ((geoJsonSource && props.geoJsonSource) && props.geoJsonSource.data !== geoJsonSource.data) {
      const source = map.getSource(id) as GeoJSONSource;
      source.setData(props.geoJsonSource.data as SourceOptionData);
    }
  }

  public render() {
    return null;
  }

}
