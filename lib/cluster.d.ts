import * as React from 'react';
import { Map } from 'mapbox-gl';
import { Props as MarkerProps } from './marker';
import { Supercluster } from 'supercluster';
import * as GeoJSON from 'geojson';
export interface Props {
    ClusterMarkerFactory(coordinates: GeoJSON.Position, pointCount: number, getLeaves: (limit?: number, offset?: number) => Array<React.ReactElement<MarkerProps>>): React.ReactElement<MarkerProps>;
    radius?: number;
    maxZoom?: number;
    minZoom?: number;
    extent?: number;
    nodeSize?: number;
    log?: boolean;
    zoomOnClick?: boolean;
    zoomOnClickPadding?: number;
    children?: Array<React.ReactElement<MarkerProps>>;
    style?: React.CSSProperties;
    className?: string;
    tabIndex?: number;
    map: Map;
}
export interface State {
    superC: Supercluster;
    clusterPoints: Array<GeoJSON.Feature<GeoJSON.Point>>;
}
export declare class Cluster extends React.Component<Props, State> {
    static defaultProps: {
        radius: number;
        minZoom: number;
        maxZoom: number;
        extent: number;
        nodeSize: number;
        log: boolean;
        zoomOnClick: boolean;
        zoomOnClickPadding: number;
    };
    state: State;
    private featureClusterMap;
    componentWillMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    private childrenChange;
    private mapChange;
    private feature;
    private childrenToFeatures;
    private getLeaves;
    zoomToClusterBounds: (event: React.MouseEvent<HTMLElement>) => void;
    private findMarkerElement;
    render(): JSX.Element;
}
declare const _default: <T>(props: T) => JSX.Element;
export default _default;
