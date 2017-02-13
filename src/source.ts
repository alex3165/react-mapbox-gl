import * as React from 'react';
import {
  Map,
  GeoJSONSource,
  GeoJSONSourceRaw
} from 'mapbox-gl/dist/mapbox-gl';
import { SourceOptionData, TilesJson } from './util/types';

export interface Context {
  map: Map;
}

export interface Props {
  id: string;
  geoJsonSource?: GeoJSONSourceRaw;
  tileJsonSource?: TilesJson;
}

export default class Source extends React.Component<Props, void> {
  public context: Context;

  public static contextTypes = {
    map: React.PropTypes.object
  };

  private id = this.props.id;

  public componentWillMount() {
    const { map } = this.context;
    const { geoJsonSource, tileJsonSource } = this.props;

    if (!map.getSource(this.id) && (geoJsonSource || tileJsonSource)) {
      map.addSource(this.id, (geoJsonSource || tileJsonSource) as any);
    }
  }

  public componentWillUnmount() {
    const { map } = this.context;
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
