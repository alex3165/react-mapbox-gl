import * as React from 'react';
import ProjectedLayer from './projected-layer';
import * as GeoJSON from 'geojson';
import { getClassName } from './util/classname';
import { Point } from 'mapbox-gl';
import { Anchor } from './util/types';

export interface Props {
  coordinates: GeoJSON.Position;
  anchor?: Anchor;
  offset?: number | number[] | Point;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  onWheel?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  className?: string;
  tabIndex?: number;
}

export const defaultClassName = ['mapboxgl-popup'];

export default class Popup extends React.Component<Props> {
  public render() {
    const { children, className } = this.props;
    const props = { ...this.props, children: undefined };
    const childrenClassName = getClassName(defaultClassName, className);

    return (
      <ProjectedLayer {...props} type="popup" className={childrenClassName}>
        <div className="mapboxgl-popup-tip" />
        <div className="mapboxgl-popup-content">{children}</div>
      </ProjectedLayer>
    );
  }
}
