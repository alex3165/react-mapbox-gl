import * as React from 'react';
import {
  Map,
  GeoJSONSource,
  GeoJSONSourceRaw
} from 'mapbox-gl';
import { SourceOptionData, TilesJson } from './util/types';
import deepEqual = require('deep-equal');

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
    map: React.PropTypes.object
  };

  private id = this.props.id;

  private onSourceData = (e: any) => {
    const { map } = this.context;
    const { id, props } = this;
    if (e.isSourceLoaded && e.sourceId === this.props.id) {
      // Refresh data (sometimes unloade without apparent reason)
      const source = map.getSource(id) as GeoJSONSource | TilesJson;
      if (source && props.geoJsonSource && props.geoJsonSource.data) {
        (source as GeoJSONSource).setData(props.geoJsonSource.data);
      }
      if (source && props.onSourceLoaded) {
        props.onSourceLoaded(source);
      }
      map.off('sourcedata', this.onSourceData);
    }
  }

  private onMapLoaded = () => {
    const { id, props } = this;
    const { map } = this.context;
    const { geoJsonSource, tileJsonSource, onSourceAdded } = props;
    if (tileJsonSource) {
      const source = map.getSource(id) as TilesJson;
      if (!source) {
        map.addSource(id, tileJsonSource as any);
        map.on('sourcedata', this.onSourceData);
        if (onSourceAdded) {
          onSourceAdded(map.getSource(id) as GeoJSONSource | TilesJson);
        }
      }
    }

    // Update geoJsonSource data
    if (geoJsonSource) {
      const source = map.getSource(id) as GeoJSONSource;
      if (!source) {
        map.addSource(id, geoJsonSource as GeoJSONSource);
        map.on('sourcedata', this.onSourceData);
        if (onSourceAdded) {
          onSourceAdded(map.getSource(id) as GeoJSONSource | TilesJson);
        }
      }
    }
  }

  public shouldComponentUpdate(nextProps: any) {
    const { geoJsonSource, tileJsonSource } = this.props;
    const { nextGeoJsonSource, nextTileJsonSource } = nextProps;
    return !(deepEqual(geoJsonSource, nextGeoJsonSource) && deepEqual(tileJsonSource, nextTileJsonSource));
  }

  public componentDidUpdate(prevProps: any) {
    const { map } = this.context;
    const { geoJsonSource, tileJsonSource, id } = this.props;
    // Update tilesJsonSource
    if (tileJsonSource && prevProps.tileJsonSource) {
      const hasNewTilesSource = (
        tileJsonSource.url !== prevProps.tileJsonSource.url ||
        // Check for reference equality on tiles array
        tileJsonSource.tiles !== prevProps.tileJsonSource.tiles ||
        tileJsonSource.minzoom !== prevProps.tileJsonSource.minzoom ||
        tileJsonSource.maxzoom !== prevProps.tileJsonSource.maxzoom
      );

      if (hasNewTilesSource) {
        map.removeSource(id);
        map.addSource(id, prevProps.tileJsonSource as any);
      }
    }
    // Update geoJsonSource data
    if ((geoJsonSource && prevProps.geoJsonSource) && prevProps.geoJsonSource.data !== geoJsonSource.data) {
      const source = map.getSource(id) as GeoJSONSource;
      source.setData(prevProps.geoJsonSource.data as SourceOptionData);
    }

  }

  public componentWillUnmount() {
    const { map } = this.context;
    if (map && map.getStyle()) {
      if (this.id && map.getSource(this.id)) {
        map.removeSource(this.id);
      }
      map.off('load', this.onMapLoaded);
    }
  }

  public componentDidMount() {
    const { map } = this.context;
    if (map.loaded()) {
      this.onMapLoaded();
    } else {
      map.on('load', this.onMapLoaded);
    }
  }

  public render() {
    return null;
  }

}
