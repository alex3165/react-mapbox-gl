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

### ReactMapboxGl: `React.Component`

Display a mapbox webgl map

#### Properties
- style : `String || Immutable.Map` (required) Mapbox map style
- accessToken : `String` (required) Mapbox access token.
- center : `List<Number>` Center the map at the position at initialisation
> When updating the map component if the center values changed, the library will re-center the map to the new position using [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
- zoom : `Number` Zoom level of the map at initialisation
> When updating the map component if the zoom values changed, the library will change the zoom using [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
- containerStyle : `Object` The style of the container of the map
- hash : `Boolean`, Default : `false` [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/)
- preserveDrawingBuffer: `Boolean`, Default : `false` [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/)
- onClick: `Function` : Triggered whenever user click on the map
- onStyleLoad: `Function` : Simple listener of mapbox event : `map.on("style.load")`
- onMouseMove: `Function` : Listen the mouse moving on the map
- onMove: `Function` : Executed whenever the center of the map change
  - Function : (center: Object<Number>, event: Object)
- onMoveEnd: `Function` : Executed when the move of the map end
  - Function : (center: Object<Number>, event: Object)

### Marker: `React.Component`

Display a marker on the map

#### Properties
- coordinates : `List<Number>` (required) Display the marker at the given position
- sourceName : `String` (required) A unique key to identify the marker
- iconImage : `String` (required) The image name of the marker, defined on mapbox studio or on the style of the map
- onClick : `Function` Triggered when user click on the icon
- onHover : `Function` Triggered when the user hover the icon
- onOutHover : `Function` Triggered when the user is not hovering anymore

### Path: `React.Component`

Display a path on the map

#### Properties
- coordinates : `List<Number>` (required) Display the marker at the given position
- sourceName : `String` (required) A unique key to identify the marker
- lineColor : `String` The color of the line
- lineWidth : `Number` The width of the line
- lineCap : `String`
- lineJoin : `String`
