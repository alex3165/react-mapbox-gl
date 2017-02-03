import * as React from 'react';
import ProjectedLayer from './projected-layer';

interface Props {
  coordinates: number[];
  anchor: any;
  offset: any;
  children: JSX.Element;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave: React.MouseEventHandler<HTMLDivElement>;
  style: React.CSSProperties;
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
