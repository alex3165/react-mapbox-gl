import { Component } from 'react';

export interface Props {
  // lat lng array (circle, line, symbol) or array of array... of lat lng (polygons)
  coordinates: number[] | number[][] | number[][][] | number[][][][];
  properties?: any;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  draggable?: boolean;
  onDragEnd?: React.MouseEventHandler<HTMLElement>;
}

class Feature extends Component<Props, {}> {
  public render() {
    return null;
  }
}

export default Feature;
