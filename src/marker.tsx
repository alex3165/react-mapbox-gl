import * as React from 'react';
import ProjectedLayer from './projected-layer';
import * as GeoJSON from 'geojson';
import { getClassName } from './util/classname';
import { Anchor } from './util/overlays';

export interface Props {
  coordinates: GeoJSON.Position;
  anchor?: Anchor;
  offset?: any;
  children?: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  className?: string;
}

const defaultClassName = ['mapboxgl-marker'];

const Marker: React.StatelessComponent<Props> = (props) => (
  <ProjectedLayer
    {...{ ...props, children: undefined}}
    className={getClassName(defaultClassName, props.className)}
  >
    {props.children}
  </ProjectedLayer>
);

export default Marker;
