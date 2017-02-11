import * as React from 'react';
import {
  Map,
  GeoJSONSource,
  GeoJSONSourceRaw
} from 'mapbox-gl/dist/mapbox-gl';
import { SourceOptionData } from './util/types';
export interface Context {
  map: Map;
}

export type Sources = GeoJSONSourceRaw;

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

    if (props.sourceOptions.data !== sourceOptions.data) {
      const source = map.getSource(id) as GeoJSONSource;
      const data = props.sourceOptions.data as SourceOptionData;
      source.setData(data);
    }
  }

  public shouldComponentUpdate(nextProps: Props) {
    return nextProps.sourceOptions.data !== this.props.sourceOptions.data;
  }

  public render() {
    return null;
  }

}
