![Logo](logo.svg)

# React-mapbox-gl [Doc](docs/API.md)

[![Greenkeeper badge](https://badges.greenkeeper.io/alex3165/react-mapbox-gl.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/alex3165/react-mapbox-gl.svg?branch=master)](https://travis-ci.org/alex3165/react-mapbox-gl)
[![npm version](https://img.shields.io/npm/v/react-mapbox-gl.svg?style=flat)](https://www.npmjs.com/package/react-mapbox-gl)
<br/><br/>
![London cycle example gif](docs/london-cycle-example.gif "London cycle example gif")

React wrapper of [mapbox-gl-js](https://www.mapbox.com/mapbox-gl-js/api/) which bring the API to a react friendly way.
On top of the layers provided, `react-mapbox-gl` add some React rendered layers, projected using `map.project`.

Include the following elements:
- ReactMapboxGl
- Layer
- Source
- Feature
  - Layer type properties `symbol` display a mapbox symbol.
  - Layer type properties `line` display a lineString.
  - Layer type properties `fill` display a polygon.
  - Layer type properties `circle` display a mapbox circle.
- GeoJSONLayer
- ZoomControl
- ScaleControl
- RotationControl
- Marker (Projected component)
- Popup (Projected component)
- Cluster

> The source files are written in Typescript, you can consume the compiled files in Javascript or Typescript and get the type definition files.


## Do you need `mapbox-gl-js` and `react-mapbox-gl`
Mapbox-gl expose a map rendered in a canvas using WebGl which mean:
- Vector tiles
- Fast rendering
- Smooth transitions
- Data on the client side (interact with anything on the map)
- Highly customizable using [mapbox studio](https://www.mapbox.com/mapbox-studio/)
- Considerable bundle size

Details of all the features exposed: [mapbox-gl-js](https://www.mapbox.com/maps/)


## How to start

```javascript
npm install react-mapbox-gl --save
```

Example:

```javascript
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
The zoom property is an array on purpose. With a float as a value we can't tell whether the zoom has changed when checking for value equality `7 === 7 // true`.
We changed it to an array so that between 2 render it check for a reference equality `[7] === [7] // false`,
this way we can reliably update the zoom value.

See https://github.com/alex3165/react-mapbox-gl/issues/57 for more informations.

## Examples
- Display a big amount of markers: [London cycle example](example/src/london-cycle.js)
- Display all the availables shapes: [All shapes example](example/src/all-shapes.js)
- Display a GEOJson file: [geojson example](example/src/geojson-example.js)
- Display Cluster of Markers: [cluster example](example/src/cluster.js)

### Run the examples
- Clone the repository
- Go to the example folder
- Install the dependencies: `npm install`
- link react-mapbox-gl: `npm run link`
- start: `npm run start` (default port: 3000)

## [API Documentation](docs/API.md)

## Contribution
- Ideally before posting an issue you can try to reproduce the bug you encounter using this [boilerplate](https://github.com/alex3165/react-mapbox-gl-debug)

## Built with react-mapbox-gl
[monumap.org](https://monumap.org/)
