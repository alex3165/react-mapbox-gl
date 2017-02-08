import * as React from 'react';

export interface Props {
  coordinates: number[];
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
