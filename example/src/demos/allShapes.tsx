import * as React from 'react';
import ReactMapboxGl, {
  ScaleControl,
  ZoomControl,
  RotationControl,
  Layer,
  Feature
} from '../../../';
import { AllShapesPolygonCoords, AllShapesMultiPolygonCoords } from './data';
// tslint:disable-next-line:no-var-requires
const { token } = require('./config.json');
// tslint:disable-next-line:no-var-requires
const mapData = require('./allShapesStyle.json');
interface Point {
  lat: number;
  lng: number;
}
interface Route {
  // tslint:disable-next-line:no-any
  [key: string]: any;
  points: Point[];
}
// tslint:disable-next-line:no-var-requires
const route: Route = require('./route.json');

const mappedRoute = route.points.map(
  point => [point.lng, point.lat] as [number, number]
);

const Map = ReactMapboxGl({ accessToken: token });

const mapStyle = {
  flex: 1
};

const lineLayout = {
  'line-cap': 'round' as 'round',
  'line-join': 'round' as 'round'
};

const linePaint = {
  'line-color': '#4790E5',
  'line-width': 12
};

const polygonPaint = {
  'fill-color': '#6F788A',
  'fill-opacity': 0.7
};

const multiPolygonPaint = {
  'fill-color': '#3bb2d0',
  'fill-opacity': 0.5
};

export interface State {
  center: [number, number];
  circleRadius: number;
  routeIndex: number;
  zoom: [number];
}

export interface Props {
  // tslint:disable-next-line:no-any
  onStyleLoad?: (map: any) => any;
}

class AllShapes extends React.Component<Props, State> {
  public state: State = {
    center: [-0.120736, 51.5118219],
    zoom: [8],
    circleRadius: 30,
    routeIndex: 0
  };

  private intervalHandle: any = undefined;
  private timeoutHandle: any = undefined;
  private mounted = false;

  public UNSAFE_componentWillMount() {
    this.mounted = true;
    this.timeoutHandle = setTimeout(() => {
      if (this.mounted) {
        this.setState({
          center: mappedRoute[0],
          zoom: [10],
          circleRadius: 10
        });
      }
    }, 3000);

    this.intervalHandle = setInterval(() => {
      if (this.mounted) {
        this.setState({
          routeIndex: this.state.routeIndex + 1
        });
      }
    }, 8000);
  }

  public componentWillUnmount() {
    clearTimeout(this.timeoutHandle);
    clearInterval(this.intervalHandle);
  }

  private getCirclePaint = () => ({
    'circle-radius': this.state.circleRadius,
    'circle-color': '#E54E52',
    'circle-opacity': 0.8
  });

  private onStyleLoad = (map: any) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  public render() {
    return (
      <Map
        style={mapData}
        containerStyle={mapStyle}
        // tslint:disable-next-line:jsx-no-lambda
        onStyleLoad={this.onStyleLoad}
        center={this.state.center}
        zoom={this.state.zoom}
      >
        {/* Controls */}
        <ScaleControl />
        <ZoomControl />
        <RotationControl style={{ top: 80 }} />

        {/* Line example */}
        <Layer type="line" layout={lineLayout} paint={linePaint}>
          <Feature coordinates={mappedRoute} />
        </Layer>

        {/* Circle example */}
        <Layer type="circle" paint={this.getCirclePaint()}>
          <Feature coordinates={mappedRoute[this.state.routeIndex]} />
        </Layer>

        {/* Polygon example */}
        <Layer type="fill" paint={polygonPaint}>
          <Feature coordinates={AllShapesPolygonCoords} />
        </Layer>

        {/* Multi Polygon example */}
        <Layer type="fill" paint={multiPolygonPaint}>
          <Feature coordinates={AllShapesMultiPolygonCoords} />
        </Layer>
      </Map>
    );
  }
}

export default AllShapes;
