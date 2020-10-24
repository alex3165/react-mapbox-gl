![Logo](/logo.png)

# React-mapbox-gl | [Documentation](docs/API.md) | [Demos](http://alex3165.github.io/react-mapbox-gl/demos)

[![Build Status](https://travis-ci.org/alex3165/react-mapbox-gl.svg?branch=master)](https://travis-ci.org/alex3165/react-mapbox-gl)
[![npm version](https://img.shields.io/npm/v/react-mapbox-gl.svg?style=flat)](https://www.npmjs.com/package/react-mapbox-gl)
[![npm downloads](https://img.shields.io/npm/dm/react-mapbox-gl.svg)](https://www.npmjs.com/package/react-mapbox-gl)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://github.com/microsoft/TypeScript)
<br/>

#### React wrapper for [mapbox-gl-js](https://www.mapbox.com/mapbox-gl-js/api/).

<br/><br/>
![London cycle example gif](docs/london-cycle-example.gif 'London cycle example gif')

## Components

### Proxy components (proxy between React and Mapbox API)

- ReactMapboxGL
- Layer & Feature
  - property `symbol` displays a mapbox symbol.
  - property `line` displays a lineString.
  - property `fill` displays a polygon.
  - property `circle` displays a mapbox circle.
  - property `raster` displays a mapbox raster tiles.
  - property `fill-extrusion` displays a layer with extruded buildings.
  - property `background` displays a mapbox background layer.
  - property `heatmap` displays a mapbox heatmap layer.
- Source
- GeoJSONLayer

### DOM components (normal React components)

- ZoomControl
- ScaleControl
- RotationControl
- Marker (Projected component)
- Popup (Projected component)
- Cluster

## Getting Started

```
npm install react-mapbox-gl mapbox-gl --save
```

Example:

Adding the css in your index.html:

```html
<html>
  <head>
    ...
    <link
      href="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css"
      rel="stylesheet"
    />
  </head>
</html>
```

```jsx
// ES6
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// ES5
var ReactMapboxGl = require('react-mapbox-gl');
var Layer = ReactMapboxGl.Layer;
var Feature = ReactMapboxGl.Feature;
require('mapbox-gl/dist/mapbox-gl.css');

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A'
});

// in render()
<Map
  style="mapbox://styles/mapbox/streets-v9"
  containerStyle={{
    height: '100vh',
    width: '100vw'
  }}
>
  <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
    <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
  </Layer>
</Map>;
```

## Why are `zoom`, `bearing` and `pitch` Arrays ?

If those properties changed at the mapbox-gl-js level and you don't update the value kept in your state, it will be unsynced with the current viewport. At some point you might want to update the viewport value (zoom, pitch or bearing) with the ones in your state but using value equality is not enough. Taking zoom as example, you will still have the unsynced zoom value therefore we can't tell if you want to update the prop or not. In order to explicitly update the current viewport values you can instead break the references of those props and reliably update the current viewport with the one you have in your state to be synced again.

## [Current version documentation](docs/API.md)

## [Version 3.0 documentation](https://github.com/alex3165/react-mapbox-gl/blob/v3.9.2/docs/API.md)

## [Version 2.0 documentation](https://github.com/alex3165/react-mapbox-gl/blob/v2-archive/docs/API.md)

## Contributions

Please try to reproduce your problem with the [boilerplate](https://github.com/alex3165/react-mapbox-gl-debug) before posting an issue.

## mapbox-gl-draw compatibility

Try [react-mapbox-gl-draw](https://github.com/amaurymartiny/react-mapbox-gl-draw)

## Looking for an Angular alternative?

Try [ngx-mapbox-gl](https://github.com/Wykks/ngx-mapbox-gl)
