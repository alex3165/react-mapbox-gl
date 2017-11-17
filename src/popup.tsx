import * as React from 'react';
import ProjectedLayer from './projected-layer';
import { Anchor } from './util/overlays';
import * as GeoJSON from 'geojson';
import { getClassName } from './util/classname';
import { Point } from 'mapbox-gl';

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
}

export const defaultClassName = ['mapboxgl-popup'];

export default class Popup extends React.Component<Props> {
  public render() {
    const anchorClass = `mapboxgl-popup-anchor-${this.props.anchor}`;
    const props = { ...this.props, children: undefined };
    const className = getClassName(
      defaultClassName.concat(anchorClass),
      this.props.className
    );

    return (
      <ProjectedLayer {...props} className={className}>
        <div className="mapboxgl-popup-tip" />
        <div className="mapboxgl-popup-content">{this.props.children}</div>
      </ProjectedLayer>
    );
  }
}
