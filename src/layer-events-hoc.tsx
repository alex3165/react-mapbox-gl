import * as React from 'react';
import { Props as FeatureProps } from './feature';
import { generateID } from './util/uid';
import { LayerCommonProps, Props as LayerProps } from './layer';
import { Map } from 'mapbox-gl';

export interface EnhancedLayerProps {
  id?: string;
  map: Map;
}

export type OwnProps = EnhancedLayerProps & LayerCommonProps;

type LayerChildren = React.ReactElement<FeatureProps> | undefined;

export function layerMouseTouchEvents(
  WrappedComponent: React.ComponentClass<LayerProps>
) {
  return class EnhancedLayer extends React.Component<OwnProps> {
    public hover: number[] = [];
    public draggedChildren:
      | Array<React.ReactElement<FeatureProps>>
      | undefined = undefined;

    public id: string = this.props.id || `layer-${generateID()}`;

    public getChildren = () =>
      ([] as LayerChildren[])
        .concat(this.props.children)
        .filter(
          (el): el is React.ReactElement<FeatureProps> =>
            typeof el !== 'undefined'
        );
    public getChildFromId = (
      children: Array<React.ReactElement<FeatureProps>>,
      id: number
    ) => children[id];

    public areFeaturesDraggable = (
      children: Array<React.ReactElement<FeatureProps>>,
      featureIds: number[] = this.hover
    ) =>
      !!featureIds
        .map(
          id =>
            this.getChildFromId(children, id)
              ? this.getChildFromId(children, id)!.props.draggable
              : false
        )
        .filter(Boolean).length;

    // tslint:disable-next-line:no-any
    public onClick = (evt: any) => {
      const features = evt.features as Array<
        GeoJSON.Feature<GeoJSON.GeometryObject, { id: number }>
      >;
      const children = this.getChildren();

      const { map } = this.props;

      if (features) {
        features.forEach(feature => {
          const { id } = feature.properties;
          if (children) {
            const child = this.getChildFromId(children, id);

            const onClick = child && child.props.onClick;
            if (onClick) {
              onClick({ ...evt, feature, map });
            }
          }
        });
      }
    };

    // tslint:disable-next-line:no-any
    public onMouseEnter = (evt: any) => {
      const children = this.getChildren();

      const { map } = this.props;
      this.hover = [];

      evt.features.forEach(
        (feature: GeoJSON.Feature<GeoJSON.GeometryObject, { id: number }>) => {
          const { id } = feature.properties;
          const child = this.getChildFromId(children, id);
          this.hover.push(id);

          const onMouseEnter = child && child.props.onMouseEnter;
          if (onMouseEnter) {
            onMouseEnter({ ...evt, feature, map });
          }
        }
      );

      if (this.areFeaturesDraggable(children)) {
        map.dragPan.disable();
      }
    };

    // tslint:disable-next-line:no-any
    public onMouseLeave = (evt: any) => {
      const children = this.getChildren();
      const { map } = this.props;
      if (this.areFeaturesDraggable(children)) {
        map.dragPan.enable();
      }

      this.hover.forEach(id => {
        const child = this.getChildFromId(children, id);
        const onMouseLeave = child && child.props.onMouseLeave;
        if (onMouseLeave) {
          onMouseLeave({ ...evt, map });
        }
      });

      if (!this.draggedChildren) {
        this.hover = [];
      }
    };

    public onMouseDown = () => {
      // User did this on a feature
      if (this.hover.length) {
        this.onFeatureDown('mousedown');
      }
    };

    // tslint:disable-next-line:no-any
    public onTouchStart = (evt: any) => {
      // tslint:disable-next-line:no-any
      this.hover = evt.features.map((feature: any) => feature.properties.id);

      if (this.hover.length) {
        this.onFeatureDown('touchstart');
      }
    };

    public onFeatureDown = (startEvent: string) => {
      const moveEvent = startEvent === 'mousedown' ? 'mousemove' : 'touchmove';
      const endEvent = startEvent === 'mousedown' ? 'mouseup' : 'touchend';
      const { map } = this.props;

      map.once(moveEvent, this.onFeatureDragStart);
      map.on(moveEvent, this.onFeatureDrag);

      // tslint:disable-next-line:no-any
      map.once(endEvent, (evt: any) => {
        map.off(moveEvent, this.onFeatureDragStart);
        map.off(moveEvent, this.onFeatureDrag);
        this.onFeatureDragEnd(evt);
      });
    };

    // tslint:disable-next-line:no-any
    public onFeatureDragStart = (evt: any) => {
      const { map } = this.props;
      const children = this.getChildren();

      this.hover.forEach(id => {
        const child = this.getChildFromId(children, id);
        if (child && !child.props.draggable) {
          return;
        }

        const onDragStart = child && child.props.onDragStart;
        if (onDragStart) {
          onDragStart({ ...evt, map });
        }
      });
    };

    // tslint:disable-next-line:no-any
    public onFeatureDrag = (evt: any) => {
      const children = this.getChildren();
      const { map } = this.props;
      const { lngLat: { lng, lat } } = evt;
      this.draggedChildren = [];

      this.hover.forEach(id => {
        const child = this.getChildFromId(children, id);
        const onDrag = child && child.props.onDrag;

        // drag children if draggable
        if (child && child.props.draggable) {
          this.draggedChildren!.push(
            React.cloneElement(child, {
              coordinates: [lng, lat]
            })
          );

          if (onDrag) {
            onDrag({ ...evt, map });
          }
        }
      });

      this.forceUpdate();
    };

    // tslint:disable-next-line:no-any
    public onFeatureDragEnd = (evt: any) => {
      const { map } = this.props;
      const children = this.getChildren();

      this.hover.forEach(id => {
        const child = this.getChildFromId(children, id);
        const onDragEnd = child && child.props.onDragEnd;

        if (onDragEnd && child!.props.draggable && this.draggedChildren) {
          onDragEnd({ ...evt, map });
        }
      });

      this.draggedChildren = undefined;
    };

    public componentDidMount() {
      const { map } = this.props;

      map.on('click', this.id, this.onClick);
      map.on('mouseenter', this.id, this.onMouseEnter);
      map.on('mouseleave', this.id, this.onMouseLeave);
      map.on('mousedown', this.id, this.onMouseDown);
      map.on('touchstart', this.id, this.onTouchStart);
    }

    public componentWillUnmount() {
      const { map } = this.props;

      map.off('click', this.onClick);
      map.off('mouseenter', this.onMouseEnter);
      map.off('mouseleave', this.onMouseLeave);
      map.off('mousedown', this.onMouseDown);
      map.off('touchstart', this.onTouchStart);
    }

    public render() {
      return (
        <WrappedComponent
          {...this.props}
          id={this.id}
          map={this.props.map}
          draggedChildren={this.draggedChildren}
        />
      );
    }
  };
}

export default layerMouseTouchEvents;
