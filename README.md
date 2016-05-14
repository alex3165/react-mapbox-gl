# react-mapbox-gl

![London cycle example gif](london-cycle-example.gif "London cycle example gif")

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
import MapboxCSS from "react-mapbox-gl/src/mapbox-css/mapbox-gl.css";

// ES5
require("react-mapbox-gl/src/mapbox-css/mapbox-gl.css");
```

## API

### ReactMapboxGl: `React.Component`

Display a mapbox webgl map
> Render the children elements only when the style of the map is loaded

To use original mapbox API use `onStyleLoad` property, the callback will receive the map object as a first arguments, then you can add your own logic using [mapbox gl API](https://www.mapbox.com/mapbox-gl-js/api/).

#### Properties
- style : `String || Object` (required) Mapbox map style
- accessToken : `String` (required) Mapbox access token.
- center : `Array of Number` Center the map at the position at initialisation
  - Re-center the map if the value change regarding the prev value or the actual center position [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
- zoom : `Number` Zoom level of the map at initialisation
  - Check the previous value and the new one, if the value changed update the zoom value [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
- scrollZoom: See [mapbox scrollZoom](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- containerStyle : `Object` The style of the container of the map
- hash : `Boolean`, Default : `false` [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- preserveDrawingBuffer: `Boolean`, Default: `false` [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- movingMethod: `String`. Default: `"flyTo"`, Possible choices : `jumpTo`, `easeTo`, `flyTo`, define the method used when changing the center or zoom position.

- onClick: `Function` : Triggered whenever user click on the map
  - Function::(map: Object, event: Object)
- onStyleLoad: `Function` : Listener of mapbox event : `map.on("style.load")`
  - Function::(map: Object, event: Object)
- onMouseMove: `Function` : Listen the mouse moving on the map
- onMove: `Function` : Executed whenever the center of the map change
  - Function::(map: Object, event: Object)
- onMoveEnd: `Function` : Executed when the move of the map end
  - Function::(map: Object, event: Object)
- onMouseUp : Simple binding of mapbox `mouseup` event
  - Function::(map: Object, event: Object)
- onDrag : Simple binding of mapbox `ondrag` event
  - Function::(map: Object, event: Object)


### Layer: `React.Component`

Create a new mapbox layer and create all the sources depending on the children components.
All the childrens of a Layer object have to be a Feature component.

If you change the value of the paint or the layout property of the layer,
it will automatically update this property using respectively either `setLayoutProperty` or `setPaintProperty`.
> Only work with the first depth of the object.

#### Properties
- id : `String` The id of the layer or generate an incremented number as id
- type : `String` The type of the features childs element
  - Possible value : `symbol`, Include a mapbox `symbol` (`Point` GeoJson)
  - Possible value : `line`, Include a mapbox `line` (`LineString` GeoJson)
  - Possible value : `fill`, Include a mapbox `polygon` (`Fill` GeoJson)
  - Possible value : `circle`, Include a mapbox `circle` (`Point` GeoJson)

- layout: Mapbox layout object passed down to mapbox `addLayer` method [mapbox layout api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-layout)
- paint: Mapbox paint object passed down to mapbox `addLayer` method [mapbox paint api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-paint)
- sourceOptions: Options object merged to the object used when calling `GeoJSONSource` method


### Feature: `React.Component`

Display a feature on the map, can only be used when wrapped in a `Layer` component. The type of the feature is defined at the `Layer` level. If you want to create a new type, create an associated new layer.

#### Properties
- coordinates : `Array of Number` (required) Display the feature at the given position.
- onClick : `Function` Triggered when user click on the feature
  - Function::(args: Object)
    - args contain the feature object, the map object and the arguments passed by mapbox from the event `click`
- onHover : `Function` Triggered when the mouse hover the feature element
  - Function::(args: Object)
    - args contain the feature object, the map object and the arguments passed by mapbox from the event `onmousemove`
- onEndHover : `Function` Triggered at the end of the hover state
  - Function::(args: Object)
    - args contain the map object and the arguments passed by mapbox from the event `onmousemove`


### ZoomControl: `React.Component`

A custom react zoom control component (This component is new and not tested yet, we advise to create your own component)

#### Properties
- onControlClick : `Function` triggered when user click on minus or plus button
  - Function::(map: Object, zoomDiff: Number)
- zoomDiff : `Number` The shift number passed to the callback `onControlClick`


### Popup: `React.Component`

Before using Popup you need to import `mapbox-gl.css` file (see import css file above).

The popup component allow you to display a popup tooltip on top of the map using mapbox-gl-js.
You can define the content of the popup by using react component, it will be rendered as a DOM element using react-dom and injected in the popup.

#### Properties
- coordinates : `Array of Number` (required) Display the popup at the given position.
- dangerouslySetInnerHTML: `String` Set the content of the popup using string.
- text: `String` Set the text content of the popup
- closeButton: `Boolean` Add a cross button to close the popup
- closeOnClick: `Boolean` Close the popup in click on it
- anchor: `String` Set the anchor point of the popup.
