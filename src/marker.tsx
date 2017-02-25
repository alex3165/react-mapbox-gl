import * as React from 'react';
import ProjectedLayer from './projected-layer';
import * as GeoJSON from 'geojson';

export interface Props {
  coordinates: GeoJSON.Position;
  anchor?: any;
  offset?: any;
  children?: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  className?: string;
}

const defaultClassName = 'mapboxgl-marker';

const Marker: React.StatelessComponent<Props> = (props) => (
  <ProjectedLayer
    {...{ ...props, children: undefined}}
    className={`${props.className} ${defaultClassName}`}
  >
    {props.children}
  </ProjectedLayer>
);

export default Marker;
