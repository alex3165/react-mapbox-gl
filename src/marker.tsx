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
}

export default class Marker extends React.Component<Props, void> {
  public render() {
    return (
      <ProjectedLayer
        {...{ ...this.props, children: undefined}}
        className="mapboxgl-marker"
      >
        {this.props.children}
      </ProjectedLayer>
    );
  }
}
