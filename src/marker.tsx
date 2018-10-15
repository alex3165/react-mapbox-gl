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
  children?: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  className?: string;
  tabIndex?: number;
}

const defaultClassName = ['mapboxgl-marker'];

export const Marker: React.StatelessComponent<Props> = props => (
  <ProjectedLayer
    {...{ ...props }}
    type="marker"
    className={getClassName(defaultClassName, props.className)}
  />
);

export default Marker;
