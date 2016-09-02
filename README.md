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
- Go to example folder
- Install the dependencies: `npm install`
- Run the example : `npm run start`
  - Default port: `8080`

> Change the example by replacing the example component in `example/main.js` file.

## Notes

The CSS file is now already included in the library.

## [API](docs/API.md)
