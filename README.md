# react-mapbox-gl

Based on [mapbox-gl-js](https://www.mapbox.com/mapbox-gl-js/api/) this library aim to bring the api to a React friendly way with some additional extra behavior.
The library include the following elements :

- ReactMapboxGl
- Marker
- Path

It will include as well:

- Popup
- Polygon

## Requirements

The library use [immutablejs](https://facebook.github.io/immutable-js/docs/#/) for some properties.

## How to start

```
npm install react-mapbox-gl --save
```

Import the component :

```
// ES6 way
import ReactMapboxGl, { Marker, Path } from "react-mapbox-gl";

// ES5
var ReactMapboxGl = require("react-mapbox-gl");
var Marker = ReactMapboxGl.Marker;
var Path = ReactMapboxGl.Path;
```

[Use it](example/map-example.js)

## Run the example

- Clone the repository
- Install the dependencies: `npm install`
- Run the example : `npm run example`.
> Default port: 8080


## API

### ReactMapboxGl

Display a mapbox webgl map

#### Properties
- style : `String || Immutable.Map` (required) Mapbox map style
- accessToken : `String` (required) Mapbox access token.
- center : `List<Number>` Center the map at the position at initialisation
- zoom : `Number` Zoom level of the map at initialisation
- containerStyle : `Object` The style of the container of the map
- hash : `Boolean`, Default : `false` [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/)
- preserveDrawingBuffer: `Boolean`, Default : `false` [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/)
- onClick: `Function` : Triggered whenever user click on the map
- onStyleLoad: `Function` : Simple listener of mapbox event : `map.on("style.load")`
- onMouseMove: `Function` : Listen the mouse moving on the map

### Marker

Display a marker on the map

#### Properties

TBD


### Path

Display a path on the map

#### Properties

TBD

## TODO :

- re-center the map when changing the center value
