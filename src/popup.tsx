import * as React from 'react';
import ProjectedLayer from './projected-layer';
import {
  anchors,
  Anchor
} from './util/overlays';
import * as GeoJSON from 'geojson';
import { getClassName } from './util/classname';
import { PointDef } from './util/overlays';

export interface Props {
  coordinates: GeoJSON.Position;
  anchor?: Anchor;
  offset?: number | number[] | PointDef;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  className?: string;
}

const defaultClassName = ['mapboxgl-popup'];

export default class Popup extends React.Component<Props, void> {
  public static defaultProps = {
    anchor: anchors[0]
  };

  public render() {
    const anchorClass = `mapboxgl-popup-anchor-${this.props.anchor}`;
    const props = { ...this.props, children: undefined };

    return (
      <ProjectedLayer
        className={getClassName(defaultClassName.concat(anchorClass), this.props.className)}
        {...props as any}
      >
        <div className="mapboxgl-popup-tip"/>
        <div className="mapboxgl-popup-content">
          {this.props.children}
        </div>
      </ProjectedLayer>
    );
  }
}
