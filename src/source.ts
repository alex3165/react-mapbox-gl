import * as React from 'react';
import {
  Map,
  VectorSource,
  RasterSource,
  GeoJSONSource,
  ImageSource,
  VideoSource,
  GeoJSONSourceRaw
} from 'mapbox-gl/dist/mapbox-gl';

export interface Context {
  map: Map;
}

export type Sources = VectorSource | RasterSource | GeoJSONSource | ImageSource | VideoSource | GeoJSONSourceRaw;

export interface Props {
  id: string;
  sourceOptions: Sources;
}

export default class Source extends React.Component<Props, void> {
  public context: Context;

  public static contextTypes = {
    map: React.PropTypes.object
  };

  private id = this.props.id;

  public componentWillMount() {
    const { map } = this.context;
    if (!map.getSource(this.id)) {
      map.addSource(this.id, this.props.sourceOptions);
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
    const { sourceOptions } = this.props;
    const { map } = this.context;

    if ((props.sourceOptions as GeoJSONSourceRaw).data !== (sourceOptions as GeoJSONSourceRaw).data) {
      (map
        .getSource(id) as GeoJSONSource)
        .setData((props.sourceOptions as GeoJSONSourceRaw).data as any);
    }
  }

  public shouldComponentUpdate(nextProps: Props) {
    return (nextProps.sourceOptions as GeoJSONSourceRaw).data !== (this.props.sourceOptions as GeoJSONSourceRaw).data;
  }

  public render() {
    return null;
  }

}
