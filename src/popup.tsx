import * as React from 'react';
import ProjectedLayer from './projected-layer';
import {
  anchors,
  Anchor
} from './util/overlays';
import * as GeoJSON from 'geojson';

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

export default class Popup extends React.Component<Props, void> {
  public static defaultProps = {
    anchor: anchors[0]
  };

  public render() {
    return (
      <ProjectedLayer
        {...{ ...this.props, children: undefined }}
        className={`mapboxgl-popup mapboxgl-popup-anchor-${this.props.anchor} ${this.props.className}`}
      >
        <div className="mapboxgl-popup-tip"/>
        <div className="mapboxgl-popup-content">
          {this.props.children}
        </div>
      </ProjectedLayer>
    );
  }
}
