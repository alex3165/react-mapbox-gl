import React, { Component } from "react";
import ReactMapboxGl, {
  Layer,
  Feature,
  ScaleControl,
  ZoomControl,
  RotationControl,
  Marker
} from "react-mapbox-gl";
import route from "./route.json";
import config from "./config.json";
import style from "./style.json";

const { accessToken } = config;

const containerStyle = {
  height: "100vh",
  width: "100%"
};

const polygonCoords = [[
  [-0.13235092163085938, 51.518250335096376],
  [-0.1174163818359375, 51.52433860667918],
  [-0.10591506958007812, 51.51974577545329],
  [-0.10831832885742188, 51.51429786349477],
  [-0.12531280517578122, 51.51429786349477],
  [-0.13200759887695312, 51.517823057404094]
]];

const multiPolygonCoords = [
  [[
    [-0.18235092163085938, 51.518250335096376],
    [-0.1674163818359375, 51.52433860667918],
    [-0.15591506958007812, 51.51974577545329],
    [-0.15831832885742188, 51.51429786349477],
    [-0.17531280517578122, 51.51429786349477],
    [-0.18200759887695312, 51.517823057404094]
  ]],
  [[
    [-0.18235092163085938, 51.538250335096376],
    [-0.1674163818359375, 51.54433860667918],
    [-0.15591506958007812, 51.53974577545329],
    [-0.15831832885742188, 51.53429786349477],
    [-0.17531280517578122, 51.53429786349477],
    [-0.18200759887695312, 51.537823057404094]
  ]]
];

const markerCoord = [
  -0.2416815,
  51.5285582
];

const mappedRoute = route.points.map(point => [ point.lat, point.lng ]);

const Map = ReactMapboxGl({ accessToken });

export default class AllShapes extends Component {
  intervalHandle = null
  timeoutHandle = null
  mounted = false

  state = {
    popup: null,
    center: [-0.120736, 51.5118219],
    circleRadius: 30,
    routeIndex: 0
  };

  componentWillMount() {
    this.mounted = true;
    this.timeoutHandle = setTimeout(() => {
      if (this.mounted) {
        this.setState({
          center: [-0.13, 51.52],
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

  componentWillUnmount() {
    this.mounted = false;
    clearInterval(this.intervalHandle);
    clearTimeout(this.timeoutHandle);
  }

  _onClickMarker = ({ feature }) => {
    this.setState({
      center: feature.geometry.coordinates
    });
  };

  _onClickMap(map) {
    console.log("Clicked on the map : ", map);
  }

  _onStyleLoad(map) {
    console.log("Style loaded: ", map);
  }

  _onHover({ map }) {
    map.getCanvas().style.cursor = "pointer";
  }

  _onZoom(map) {
    console.log("Zoom level changed to ", map.getZoom());
  }

  _onEndHover({ map }) {
    map.getCanvas().style.cursor = "";
  }

  _markerClick() {
    console.log('Marker clicked');
  }

  _markerMouseEnter() {
    console.log('Marker mouse enter');
  }

  _markerMouseLeave() {
    console.log('Marker mouse leave');
  }

  _polygonClicked = ({ feature }) => {
    console.log("Polygon clicked", feature.geometry.coordinates);
  };

  render() {
    return (
      <Map
        style={style}
        onClick={this._onClickMap}
        onZoom={this._onZoom}
        onStyleLoad={this._onStyleLoad}
        center={this.state.center}
        movingMethod="jumpTo"
        containerStyle={containerStyle}>
        <ScaleControl/>
        <ZoomControl/>
        <RotationControl style={{ top: 80 }}/>

        <Layer
          type="symbol"
          layout={{ "icon-image": "harbor-15" }}>
          <Feature
            coordinates={markerCoord}
            onHover={this._onHover}
            onEndHover={this._onEndHover}
            onClick={this._onClickMarker}/>
        </Layer>

        <Layer
          id="mapbox-route-example"
          type="line"
          sourceId="route"
          layout={{
            "line-join": "round",
            "line-cap": "round"
          }}
          paint={{
            "line-color": "#888",
            "line-width": 8
          }}/>

        <Layer
          type="line"
          layout={{ "line-cap": "round", "line-join": "round" }}
          paint={{ "line-color": "#4790E5", "line-width": 12 }}>
          <Feature coordinates={mappedRoute}/>
        </Layer>

        <Layer
          type="circle"
          paint={{ "circle-radius": this.state.circleRadius, "circle-color": "#E54E52", "circle-opacity": .8 }}>
          <Feature coordinates={mappedRoute[this.state.routeIndex]}/>
        </Layer>

        <Marker
          onClick={this._markerClick}
          anchor="top"
          onMouseEnter={this._markerMouseEnter}
          onMouseLeave={this._markerMouseLeave}
          className="test"
          coordinates={markerCoord}>
            <h1>TEST</h1>
        </Marker>

        <Layer
          type="fill"
          paint={{ "fill-color": "#6F788A", "fill-opacity": .7 }}>
          <Feature
            onClick={this._polygonClicked}
            coordinates={polygonCoords}/>
        </Layer>

        <Layer
          type="fill"
          paint={{ "fill-color": "#3bb2d0", "fill-opacity": .5 }}>
          <Feature
            onClick={this._polygonClicked}
            coordinates={multiPolygonCoords}/>
        </Layer>

      </Map>
    );
  }
}
