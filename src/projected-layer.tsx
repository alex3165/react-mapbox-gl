import React from 'react';
import { createPortal } from 'react-dom';
import { Point } from 'mapbox-gl';
import { MapConsumer, MapContext } from './map-context';
import { OverlayParams, overlayState, overlayTransform } from './util/overlays';
import { Anchor } from './util/types';

const defaultStyle = {
  zIndex: 3
};

export interface Props {
  type: 'marker' | 'popup';
  coordinates: number[];
  anchor?: Anchor;
  offset?: number | number[] | Point;
  children?: JSX.Element | JSX.Element[];
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  onWheel?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  className: string;
  tabIndex?: number;
}

export class ProjectedLayer extends React.Component<
  Props & MapContext,
  OverlayParams
> {
  private container?: HTMLElement;
  private prevent: boolean = false;

  public static defaultProps = {
    offset: 0,
    // tslint:disable-next-line:no-any
    onClick: (...args: any[]) => args
  };

  public state: OverlayParams = {};

  private setContainer = (el: HTMLElement | null) => {
    if (el) {
      this.container = el;
    }
  };

  private handleMapMove = () => {
    if (!this.prevent) {
      this.setState(overlayState(this.props, this.props.map, this.container!));
    }
  };

  public componentDidMount() {
    const { map } = this.props;

    map.on('move', this.handleMapMove);
    // Now this.container is rendered and the size of container is known.
    // Recalculate the anchor/position
    this.handleMapMove();
  }

  private havePropsChanged(props: Props, nextProps: Props) {
    return (
      props.coordinates[0] !== nextProps.coordinates[0] ||
      props.coordinates[1] !== nextProps.coordinates[1] ||
      props.offset !== nextProps.offset ||
      props.anchor !== nextProps.anchor
    );
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.havePropsChanged(this.props, nextProps)) {
      this.setState(overlayState(nextProps, this.props.map, this.container!));
    }
  }

  public componentWillUnmount() {
    const { map } = this.props;

    this.prevent = true;

    map.off('move', this.handleMapMove);
  }

  public renderIntoContainer(child: React.ReactNode): React.ReactNode {
    if (this.props.type === 'marker') {
      const container = this.props.map.getCanvasContainer();

      return container ? createPortal(child, container) : child;
    }

    return child;
  }

  public render() {
    const {
      style,
      children,
      className,
      onClick,
      onDoubleClick,
      onMouseEnter,
      onMouseLeave,
      onScroll,
      onWheel,
      type,
      tabIndex
    } = this.props;
    const { anchor } = this.state;
    const finalStyle = {
      ...defaultStyle,
      ...style,
      transform: overlayTransform(this.state).join(' ')
    };
    const anchorClassname =
      anchor && type === 'popup' ? `mapboxgl-popup-anchor-${anchor}` : '';
    return this.renderIntoContainer(
      <div
        className={`${className} ${anchorClassname}`}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onScroll={onScroll}
        onWheel={onWheel}
        style={finalStyle}
        ref={this.setContainer}
        tabIndex={tabIndex}
      >
        {children}
      </div>
    );
  }
}

const ProjectedLayerWithMap: React.SFC<Props> = props => (
  <MapConsumer>
    {({ map }) => <ProjectedLayer {...props} map={map} />}
  </MapConsumer>
);

export default ProjectedLayerWithMap;
