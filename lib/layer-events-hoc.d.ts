/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Context } from './util/types';
import { Props as FeatureProps } from './feature';
import { LayerCommonProps, Props as LayerProps } from './layer';
export interface EnhancedLayerProps {
    id?: string;
}
export declare type OwnProps = EnhancedLayerProps & LayerCommonProps;
declare function layerMouseTouchEvents(WrappedComponent: React.ComponentClass<LayerProps>): {
    new (props: OwnProps, context?: any): {
        context: Context;
        hover: number[];
        draggedChildren: React.ReactElement<FeatureProps>[] | undefined;
        id: string;
        getChildren: () => React.ReactElement<FeatureProps>[];
        getChildFromId: (children: React.ReactElement<FeatureProps>[], id: number) => React.ReactElement<FeatureProps>;
        areFeaturesDraggable: (children: React.ReactElement<FeatureProps>[], featureIds?: number[]) => boolean;
        onClick: (evt: any) => void;
        onMouseEnter: (evt: any) => void;
        onMouseLeave: (evt: any) => void;
        onMouseDown: () => void;
        onTouchStart: (evt: any) => void;
        onFeatureDown: (startEvent: string) => void;
        onFeatureDragStart: (evt: any) => void;
        onFeatureDrag: (evt: any) => void;
        onFeatureDragEnd: (evt: any) => void;
        componentWillMount(): void;
        componentWillUnmount(): void;
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: OwnProps) => {} | Pick<{}, K>) | Pick<{}, K>, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<OwnProps>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    contextTypes: {
        map: PropTypes.Requireable<any>;
    };
};
export default layerMouseTouchEvents;
