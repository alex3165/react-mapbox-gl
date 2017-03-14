import { Component } from 'react';
import * as GeoJSON from 'geojson';

export interface Props {
  coordinates: GeoJSON.Position;
  properties?: any;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
}

class Feature extends Component<Props, void> {
  public render() {
    return null;
  }
}

export default Feature;
