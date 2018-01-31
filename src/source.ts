import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Map, GeoJSONSource, GeoJSONSourceRaw } from 'mapbox-gl';
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

  public componentWillUnmount() {
    const { map } = this.context;

    if (!map || !map.getStyle()) {
      return;
    }

    map.off('styledata', this.onStyleDataChange);

    if (map.getSource(this.id)) {
      const { layers } = map.getStyle();

      if (layers) {
        layers
          .filter(layer => layer.source === this.id)
          .forEach(layer => map.removeLayer(layer.id));
      }

      map.removeSource(this.id);
    }
  }

  public componentWillReceiveProps(props: Props) {
    const { geoJsonSource, tileJsonSource } = this.props;
    const { map } = this.context;

    // Update tilesJsonSource
    if (tileJsonSource && props.tileJsonSource) {
      const hasNewTilesSource =
        tileJsonSource.url !== props.tileJsonSource.url ||
        // Check for reference equality on tiles array
        tileJsonSource.tiles !== props.tileJsonSource.tiles ||
        tileJsonSource.minzoom !== props.tileJsonSource.minzoom ||
        tileJsonSource.maxzoom !== props.tileJsonSource.maxzoom;

      if (hasNewTilesSource) {
        map.removeSource(this.id);
        map.addSource(this.id, props.tileJsonSource);
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
