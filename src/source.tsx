import * as React from 'react';
import {
  Map,
  VectorSource,
  RasterSource,
  GeoJSONSource,
  ImageSource,
  VideoSource,
  GeoJSONSourceRaw
} from 'mapbox-gl';

interface Context {
  map: Map;
}

type Sources = VectorSource | RasterSource | GeoJSONSource | ImageSource | VideoSource | GeoJSONSourceRaw;

interface Props {
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

  public render() {
    return null;
  }

}
