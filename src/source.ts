import * as React from 'react';
import { Map, GeoJSONSource, GeoJSONSourceRaw, Layer } from 'mapbox-gl';
import { TilesJson } from './util/types';
import { withMap } from './context';

export interface Props {
  id: string;
  geoJsonSource?: GeoJSONSourceRaw;
  tileJsonSource?: TilesJson;
  map: Map;
  onSourceAdded?: (source: GeoJSONSource | TilesJson) => void;
  onSourceLoaded?: (source: GeoJSONSource | TilesJson) => void;
}

export type LayerWithBefore = Layer & { before?: string };

export class Source extends React.Component<Props> {
  private id = this.props.id;

  private onStyleDataChange = () => {
    // if the style of the map has been updated we won't have any sources anymore,
    // add it back to the map and force re-rendering to redraw it
    if (!this.props.map.getLayer(this.id)) {
      this.initialize();
      this.forceUpdate();
    }
  };

  public componentDidMount() {
    const { map } = this.props;

    map.on('styledata', this.onStyleDataChange);
    this.initialize();
  }

  private initialize = () => {
    const { map } = this.props;
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

  private onData = () => {
    const { map } = this.props;

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
      source.setData(this.props.geoJsonSource.data);
    }
    map.off('sourcedata', this.onData);
  };

  public removeSource(): LayerWithBefore[] {
    const { map } = this.props;

    if (map.getSource(this.id)) {
      let { layers = [] } = map.getStyle();

      layers = layers
        .map((layer, idx): LayerWithBefore => {
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
    const { map } = this.props;

    if (!map || !map.getStyle()) {
      return;
    }

    map.off('styledata', this.onStyleDataChange);
    this.removeSource();
  }

  public componentDidUpdate(prevProps: Props) {
    const { geoJsonSource, tileJsonSource, map } = prevProps;
    const source = map.getSource(this.id);

    // Update tilesJsonSource
    if (tileJsonSource && this.props.tileJsonSource) {
      let urlUpdated = false;
      let tilesUpdated = false;

      if (source && source.type === 'vector') {
        const hasNewSourceUrl =
          tileJsonSource.url !== this.props.tileJsonSource.url;

        if (hasNewSourceUrl && this.props.tileJsonSource.url !== undefined) {
          source.setUrl(this.props.tileJsonSource.url);
          urlUpdated = true;
        }

        const hasNewSourceTiles =
          tileJsonSource.tiles !== this.props.tileJsonSource.tiles;

        if (
          hasNewSourceTiles &&
          this.props.tileJsonSource.tiles !== undefined
        ) {
          source.setTiles(this.props.tileJsonSource.tiles);
          tilesUpdated = true;
        }
      }

      // Prefer the more targetted updates, but fallback to swapping out the entire source
      // This applies to raster tile sources, for example
      const hasNewTilesSource =
        (!urlUpdated && tileJsonSource.url !== this.props.tileJsonSource.url) ||
        // Check for reference equality on tiles array
        (!tilesUpdated &&
          tileJsonSource.tiles !== this.props.tileJsonSource.tiles) ||
        tileJsonSource.minzoom !== this.props.tileJsonSource.minzoom ||
        tileJsonSource.maxzoom !== this.props.tileJsonSource.maxzoom;

      if (hasNewTilesSource) {
        const layers = this.removeSource();
        map.addSource(this.id, this.props.tileJsonSource);

        layers.forEach(layer => map.addLayer(layer, layer.before));
      }
    }

    // Update geoJsonSource data
    if (
      geoJsonSource &&
      this.props.geoJsonSource &&
      this.props.geoJsonSource.data !== geoJsonSource.data &&
      this.props.geoJsonSource.data &&
      source &&
      source.type === 'geojson'
    ) {
      source.setData(this.props.geoJsonSource.data);
    }
  }

  public render() {
    return null;
  }
}

export default withMap(Source);
