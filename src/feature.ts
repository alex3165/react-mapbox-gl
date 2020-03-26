import { Component } from 'react';
import { AnyShapeCoordinates } from './util/types';

export interface Props {
  // lat lng array (circle, line, symbol) or array of array... of lat lng (polygons)
  coordinates: AnyShapeCoordinates;
  // tslint:disable-next-line:no-any
  properties?: any;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  draggable?: boolean;
  onDragStart?: React.MouseEventHandler<HTMLElement>;
  onDrag?: React.MouseEventHandler<HTMLElement>;
  onDragEnd?: React.MouseEventHandler<HTMLElement>;
}

export class Feature extends Component<Props> {
  public render() {
    return null;
  }
}

export default Feature;
