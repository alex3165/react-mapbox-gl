import React from 'react';
import { Map } from 'mapbox-gl';
export interface MapContext {
  map: Map;
}
export type Props = Partial<MapContext>;
// tslint:disable:no-object-literal-type-assertion
const { Provider, Consumer: MapConsumer } = React.createContext(
  {} as MapContext
);
// tslint:enable

class MapProvider extends React.Component<Props, MapContext> {
  public state: MapContext = { map: this.props.map! };
  public static getDerivedStateFromProps(nextProps: Props, state: MapContext) {
    if (nextProps.map && nextProps.map !== state.map) {
      return { map: nextProps.map };
    }
    return null;
  }
  public render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

const withMapContext = <P extends object>(
  WrappedComponent:
    | React.ComponentClass<P & MapContext>
    | React.SFC<P & MapContext>
) => (props: P) => (
  <MapConsumer>
    {({ map }) => <WrappedComponent {...props} map={map} />}
  </MapConsumer>
);

export { MapProvider, MapConsumer, withMapContext };
