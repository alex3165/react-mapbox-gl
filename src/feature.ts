import * as React from 'react';
import * as GeoJSON from 'geojson';

export interface Props {
  coordinates: GeoJSON.Position;
  properties: any;
  onClick?: Function;
  onHover?: Function;
  onEndHover?: Function;
}
class Feature extends React.Component<Props, void> {
  public render() {
    return null;
  }
}

export default Feature;
