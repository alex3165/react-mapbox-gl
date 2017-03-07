import { Component } from 'react';
import * as GeoJSON from 'geojson';

export interface Props {
  coordinates: GeoJSON.Position;
  properties?: any;
  onClick?: (args: any) => any;
  onHover?: (args: any) => any;
  onEndHover?: (args: any) => any;
}

class Feature extends Component<Props, void> {
  public render() {
    return null;
  }
}

export default Feature;
