import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Context, Feature } from './util/types';
import { Props as FeatureProps } from './feature';
import { generateID } from './util/uid';
import { LayerCommonProps, Props as LayerProps } from './layer';

export interface EnhancedLayerProps {
  id?: string;
}

export type OwnProps = EnhancedLayerProps & LayerCommonProps;

type LayerChildren = React.ReactElement<FeatureProps> | undefined;

function layerMouseTouchEvents(
  WrappedComponent: React.ComponentClass<LayerProps>
) {
  return class EnhancedLayer extends React.Component<OwnProps> {
    public context: Context;
    public hover: number[] = [];
    public isGrabbing: boolean = false;
    public hasDragged: boolean = false;
    public draggedChildren: undefined | JSX.Element[] = undefined;

    public static contextTypes = {
      map: PropTypes.object
    };

    public id: string = this.props.id || `layer-${generateID()}`;

    public getChildren = () =>
      ([] as LayerChildren[])
        .concat(this.props.children)
        // TODO: Fix when https://github.com/Microsoft/TypeScript/issues/18562 is merged
        .filter(
          (el: LayerChildren): el is React.ReactElement<FeatureProps> =>
            typeof el !== 'undefined'
        );

    public areFeaturesDraggable = (
      children: Array<React.ReactElement<FeatureProps>>,
      featureIds: number[] = this.hover
    ) => {
      return !!featureIds
        .map(id => (children[id] ? children[id].props.draggable : false))
        .filter(Boolean).length;
    };

    // tslint:disable-next-line:no-any
    public onClick = (evt: any) => {
      const features = evt.features as Feature[];
      const children = this.getChildren();

      const { map } = this.context;

      if (features) {
        features.forEach(feature => {
          const { id } = feature.properties;
          if (children) {
            const child = children[id];

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
      const { map } = this.context;

      this.hover = [];

      evt.features.forEach((feature: Feature) => {
        const { id } = feature.properties;
        if (children) {
          const child = children[id];

          this.hover.push(id);
          const onMouseEnter = child && child.props.onMouseEnter;
          if (onMouseEnter) {
            onMouseEnter({ ...evt, feature, map });
          }
        }
      });

      if (this.areFeaturesDraggable(children)) {
        map.dragPan.disable();
      }
    };

    // tslint:disable-next-line:no-any
    public onMouseLeave = (evt: any) => {
      const children = this.getChildren();
      const { map } = this.context;
      map.dragPan.enable();

      this.hover.forEach(id => {
        const child = children[id];
        const onMouseLeave = child && child.props.onMouseLeave;
        if (onMouseLeave) {
          onMouseLeave({ ...evt, map });
        }
      });

      if (!this.isGrabbing) {
        this.hover = [];
      }
    };

    public onMouseDown = () => {
      const children = this.getChildren();
      const isHoverDraggable = this.areFeaturesDraggable(children);
      if (!isHoverDraggable) {
        return;
      }

      // User did this on a feature
      const { map } = this.context;
      map.dragPan.disable();

      this.onFeatureDown('mousedown');

      map.once('mouseup', () => {
        map.dragPan.enable()
      });
    };

    // tslint:disable-next-line:no-any
    public onTouchStart = (evt: any) => {
      const children = this.getChildren();
      const { map } = this.context;

      evt.features.forEach((feature: Feature) => {
        // Set hover
        const { id } = feature.properties;
        this.hover = [id];

        if (!this.areFeaturesDraggable(children)) {
          return
        }

        // User did this on a feature
        map.dragPan.disable();

        this.onFeatureDown('touchstart');

        map.once('touchend', () => {
          map.dragPan.enable()
        });
      });
    };

    public onFeatureDown = (startEvent: string) => {
      const moveEvent = startEvent === 'mousedown' ? 'mousemove' : 'touchmove';
      const endEvent = startEvent === 'mousedown' ? 'mouseup' : 'touchend';
      const { map } = this.context;

      this.isGrabbing = true;
      this.hasDragged = false;

      this.draggedChildren = [];
      map.once(moveEvent, this.onFeatureDragStart);
      map.on(moveEvent, this.onFeatureDrag);
      map.once(endEvent, this.onFeatureDragEnd);
      map.once(endEvent, () => {
        map.off(moveEvent, this.onFeatureDrag)
        this.draggedChildren = undefined;
      });
    }

    // tslint:disable-next-line:no-any
    public onFeatureDragStart = (evt: any) => {
      const { map } = this.context;
      const children = this.getChildren();

      this.hasDragged = true;

      this.hover.map(id => {
        const child = children[id];

        const onDragStart = child && child.props.onDragStart;
        if (onDragStart) {
          onDragStart({ ...evt, map });
        }

        const onDrag = child && child.props.onDrag;
        if (onDrag) {
          onDrag({ ...evt, map });
        }
      });
    }

    // tslint:disable-next-line:no-any
    public onFeatureDrag = (evt: any) => {
      if (!this.hasDragged) {
        return;
      }

      const children = this.getChildren();
      const { lngLat: { lng, lat } } = evt;

      // Actualy display dragged children
      this.draggedChildren = children.map((child, index) => {
        if (this.hover.includes(index) && child.props.draggable) {
          return React.cloneElement(child, {
            coordinates: [lng, lat]
          });
        }

        return child;
      });

      this.forceUpdate();

      // Trigger onDrag
      const { map } = this.context;

      this.hover.map(id => {
        const child = children[id];
        const onDrag = child && child.props.onDrag;
        if (onDrag) {
          onDrag({ ...evt, map });
        }
      });
    }

    // tslint:disable-next-line:no-any
    public onFeatureDragEnd = (evt: any) => {
      this.isGrabbing = false;

      if (!this.hasDragged) {
        return;
      }

      const { map } = this.context;
      const children = this.getChildren();

      this.hover.map(id => {
        const child = children[id];
        const onDragEnd = child && child.props.onDragEnd;
        if (onDragEnd) {
          onDragEnd({ ...evt, map });
        }
      });
    }

    public componentWillMount() {
      const { map } = this.context;

      map.on('click', this.id, this.onClick);
      map.on('mouseenter', this.id, this.onMouseEnter);
      map.on('mouseleave', this.id, this.onMouseLeave);
      map.on('mousedown', this.id, this.onMouseDown);
      map.on('touchstart', this.id, this.onTouchStart);
    }

    public componentWillUnmount() {
      const { map } = this.context;

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
          draggedChildren={this.draggedChildren}
          id={this.id}
        />
      );
    }
  };
}

export default layerMouseTouchEvents;
