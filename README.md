# react-mapbox-gl

![London cycle example gif](docs/london-cycle-example.gif "London cycle example gif")

Based on [mapbox-gl-js](https://www.mapbox.com/mapbox-gl-js/api/) this library aim to bring the api to a React friendly way with some additional extra behavior.
The library include the following elements :

- ReactMapboxGl
- Layer
- Feature
  - Layer type properties `symbol` display a mapbox symbol.
  - Layer type properties `line` display a lineString.
  - Layer type properties `fill` display a polygon.
  - Layer type properties `circle` display a mapbox circle.
- ZoomControl
- Popup

## Breaking change

`zoom` property is now an array it is required to test for a reference equality in `componentWillReceiveProps` of the map component in order to properly update the zoom when the reference changed.

## How to start

```
npm install react-mapbox-gl --save
```

Import the component :

```
// ES6
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

// ES5
var ReactMapboxGl = require("react-mapbox-gl");
var Layer = ReactMapboxGl.Layer;
var Feature = ReactMapboxGl.Feature;
```

## Examples

- See the example to display a big amount of markers : [London cycle example](example/london-cycle.js)
- See the example to display all the availables shapes : [All shapes example](example/all-shapes.js)

### Run the examples

- Clone the repository
- Install the dependencies: `npm install`
- Run the example : `npm run example`
  - Default port: `8080`

> Change the example by replacing the example component in `example/main.js` file.

## Notes

Mapbox throw a warning because react-mapbox-gl is using a compiled version of mapbox-gl which is necessary when using webpack for now as long as the sources files requires the node package `fs` to read the shaders.

## Import mapbox css file

If you are using webpack we advise you to use [style-loader and css-loader](https://webpack.github.io/docs/stylesheets.html) and require mapbox css file when needed, check london-cycle for more information. React-mapbox-gl include a revisited version of mapbox-gl.css file but you can definitely use the original css file as well. Though if you want to use our custom css file you can import it like this (assuming we are in a webpack environment) :

```
// ES6
import MapboxCSS from "react-mapbox-gl/dist/mapbox-css/mapbox-gl.css";

// ES5
require("react-mapbox-gl/dist/mapbox-css/mapbox-gl.css");
```

## [API](docs/API.md)
