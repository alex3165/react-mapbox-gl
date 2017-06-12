![Logo](./logo.svg)

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

## How to start

```javascript
npm install react-mapbox-gl --save
```

Example:

```jsx
// ES6
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

// ES5
var ReactMapboxGl = require("react-mapbox-gl");
var Layer = ReactMapboxGl.Layer;
var Feature = ReactMapboxGl.Feature;

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A"
});

<Map
  style="mapbox://styles/mapbox/streets-v9"
  accessToken=
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
</Map>
```

## Disclaimer
The zoom property is an array on purpose. With a float as a value we can't tell whether the zoom has changed when checking for value equality `7 === 7 // true`.
We changed it to an array so that between 2 render it check for a reference equality `[7] === [7] // false`,
this way we can reliably update the zoom value.

See https://github.com/alex3165/react-mapbox-gl/issues/57 for more informations.

## [API Documentation](docs/API.md)

## Contribution
- Ideally before posting an issue you can try to reproduce the bug you encounter using this [boilerplate](https://github.com/alex3165/react-mapbox-gl-debug)

## Built with react-mapbox-gl
[monumap.org](https://monumap.org/)
