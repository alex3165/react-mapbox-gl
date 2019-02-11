import * as React from 'react';
import { Props as FeatureProps } from './feature';
import { LayerCommonProps, Props as LayerProps } from './layer';
import { Map } from 'mapbox-gl';
export interface EnhancedLayerProps {
    id?: string;
    map: Map;
}
export declare type OwnProps = EnhancedLayerProps & LayerCommonProps;
export declare function layerMouseTouchEvents(WrappedComponent: React.ComponentClass<LayerProps>): {
    new (props: Readonly<OwnProps>): {
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
        onTouchEnd: (evt: any) => void;
        onTouchStart: (evt: any) => void;
        onFeatureDown: (startEvent: string) => void;
        onFeatureDragStart: (evt: any) => void;
        onFeatureDrag: (evt: any) => void;
        onFeatureDragEnd: (evt: any) => void;
        componentWillMount(): void;
        componentWillUnmount(): void;
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<OwnProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<OwnProps>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    new (props: OwnProps, context?: any): {
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
        onTouchEnd: (evt: any) => void;
        onTouchStart: (evt: any) => void;
        onFeatureDown: (startEvent: string) => void;
        onFeatureDragStart: (evt: any) => void;
        onFeatureDrag: (evt: any) => void;
        onFeatureDragEnd: (evt: any) => void;
        componentWillMount(): void;
        componentWillUnmount(): void;
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<OwnProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<OwnProps>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
};
export default layerMouseTouchEvents;
