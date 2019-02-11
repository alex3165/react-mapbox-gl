import { Component } from 'react';
import { AnyShapeCoordinates } from './util/types';
export interface Props {
    coordinates: AnyShapeCoordinates;
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
export declare class Feature extends Component<Props> {
    render(): null;
}
export default Feature;
