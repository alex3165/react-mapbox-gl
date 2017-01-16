# react-mapbox-gl

![London cycle example gif](docs/london-cycle-example.gif "London cycle example gif")

Based on [mapbox-gl-js](https://www.mapbox.com/mapbox-gl-js/api/) this library aim to bring the api to a React friendly way with some additional extra behavior.
The library include the following elements :

- ReactMapboxGl
- Layer
- Source
- GeoJSONLayer
- Marker (Html marker)
- Feature
  - Layer type properties `symbol` display a mapbox symbol.
  - Layer type properties `line` display a lineString.
  - Layer type properties `fill` display a polygon.
  - Layer type properties `circle` display a mapbox circle.
- ZoomControl
- ScaleControl
- Popup
- Cluster

## How to start

```
npm install react-mapbox-gl --save
```

Example:

```
// ES6
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

// ES5
var ReactMapboxGl = require("react-mapbox-gl");
var Layer = ReactMapboxGl.Layer;
var Feature = ReactMapboxGl.Feature;

<ReactMapboxGl
  style="mapbox://styles/mapbox/streets-v8"
  accessToken="pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A"
  containerStyle={{
    height: "100vh",
    width: "100vw"
  }}>
    <Layer
      type="symbol"
      id="marker"
      layout={{ "icon-image": "marker-15" }}>
      <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
    </Layer>
</ReactMapboxGl>
```

## Disclaimer

The zoom property is an array on purpose. With a float as a value we can't tell whether the zoom has changed because `7 === 7 // true`. We did a work around using array so that `[7] !== [7] // true`, this way we can reliably update the zoom value.

See https://github.com/alex3165/react-mapbox-gl/issues/57 for more informations.

## Examples

- See the example to display a big amount of markers : [London cycle example](example/src/london-cycle.js)
- See the example to display all the availables shapes : [All shapes example](example/src/all-shapes.js)
- See the example to display a GEOJson file : [geojson example](example/src/geojson-example.js)

### Run the examples

- Clone the repository
- Go to example folder
- Install the dependencies: `npm install`
- Run the example
  - Build the library `npm run build`
  - Go to example folder `cd example`
  - Run example `npm run start`
  - Default port: `8080`

## [API](docs/API.md)
