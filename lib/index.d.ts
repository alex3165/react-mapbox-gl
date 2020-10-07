/// <reference types="react" />
import Map from './map';
import { LayerCommonProps, Props as LayerProps } from './layer';
import { EnhancedLayerProps } from './layer-events-hoc';
import GeoJSONLayer from './geojson-layer';
import Feature, { Props } from './feature';
import ZoomControl from './zoom-control';
import Popup from './popup';
import ScaleControl from './scale-control';
import Marker from './marker';
import Source from './source';
import Cluster from './cluster';
import RotationControl from './rotation-control';
import { Context } from './util/types';
import * as PropTypes from 'prop-types';
export declare type FeatureProps = Props;
export declare type Context = Context;
export declare type LayerCommonProps = LayerCommonProps;
export declare type LayerProps = LayerProps;
export declare type EnhancedLayerProps = EnhancedLayerProps;
export declare const PropTypesAlias: typeof PropTypes;
declare const Layer: {
    new (props: EnhancedLayerProps & LayerCommonProps, context?: any): {
        context: Context;
        hover: number[];
        draggedChildren: React.ReactElement<Props>[] | undefined;
        id: string;
        getChildren: () => React.ReactElement<Props>[];
        getChildFromId: (children: React.ReactElement<Props>[], id: number) => React.ReactElement<Props>;
        areFeaturesDraggable: (children: React.ReactElement<Props>[], featureIds?: number[]) => boolean;
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
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: EnhancedLayerProps & LayerCommonProps) => {} | Pick<{}, K>) | Pick<{}, K>, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<EnhancedLayerProps & LayerCommonProps>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    contextTypes: {
        map: PropTypes.Requireable<any>;
    };
};
export { Feature, Layer, GeoJSONLayer, Map, Popup, ZoomControl, ScaleControl, Marker, Source, Cluster, RotationControl };
export default Map;
