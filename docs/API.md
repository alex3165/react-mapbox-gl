# ReactMapboxGl

Display a mapbox webgl map
> Render the children elements only when the style of the map is loaded

To use the original Mapbox API use `onStyleLoad` property, the callback function will receive the map object as a first arguments, then you can add your own logic using [mapbox gl API](https://www.mapbox.com/mapbox-gl-js/api/).

### Import

```
import ReactMapboxGl from "react-mapbox-gl";
```

### Properties
- **style** *(required)* : `String || Object`  Mapbox map style
- **accessToken** *(required)* : `String` Mapbox access token.
- **center** *(Default: `[ -0.2416815, 51.5285582 ]`)*: `Array<Number>` Center the map at the position at initialisation
  - Re-center the map if the value change regarding the prev value or the actual center position [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
- **zoom** *(Default: `11`)*: `Number` Zoom level of the map at initialisation
  - Check the previous value and the new one, if the value changed update the zoom value [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
- **scrollZoom** *(Default: `true`)*: See [mapbox scrollZoom](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- **containerStyle** : `Object` The style of the container of the map
- **hash** *(Default: `false`)*: `Boolean`, [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- **preserveDrawingBuffer** *(Default: `false`)*: `Boolean`, [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- **movingMethod** *(Default: `flyTo`)*: `String`, define the method used when changing the center or zoom position. Possible value :
  - `jumpTo`
  - `easeTo`
  - `flyTo`
- **onClick**: `Function` : Triggered whenever user click on the map
  - Function::(map: Object, event: Object)
- **onStyleLoad**: `Function` : Listener of Mapbox event : `map.on("style.load")`
  - Function::(map: Object, event: Object)
- **onMouseMove**: `Function` : Listen the mouse moving on the map
- **onMove**: `Function` : Executed whenever the center of the map change
  - Function::(map: Object, event: Object)
- **onMoveEnd**: `Function` : Executed when the move of the map end
  - Function::(map: Object, event: Object)
- **onMouseUp** : `Function` : Simple binding of Mapbox `mouseup` event
  - Function::(map: Object, event: Object)
- **onDrag** : `Function` : Simple binding of mapbox `ondrag` event
  - Function::(map: Object, event: Object)


### Example

```
<ReactMapboxGl
  style="mapbox://styles/mapbox/streets-v8"
  accessToken="pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A"/>
```

----------
# Layer

Create a new Mapbox layer and create all the sources depending on the children `Feature` components.

If you change the value of the paint or the layout property of the layer, it will automatically update this property using respectively either `setLayoutProperty` or `setPaintProperty`.
> Only work with the first depth of the object.

### Import

```
import { Layer } from "react-mapbox-gl";
```

### Properties
- **id** : `String` The id of the layer or generate an incremented number as id
- **type** *(Default: `symbol`)* : `String` The type of the features childrens elements, possible values :
  -  `symbol`, Include a Mapbox `symbol` (`Point` GeoJson)
  - `line`, Include a Mapbox `line` (`LineString` GeoJson)
  - `fill`, Include a Mapbox `polygon` (`Fill` GeoJson)
  - `circle`, Include a Mapbox `circle` (`Point` GeoJson)
- **layout**: Mapbox layout object passed down to mapbox `addLayer` method [mapbox layout api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-layout)
- **paint**: Mapbox paint object passed down to mapbox `addLayer` method [mapbox paint api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-paint)
- **sourceOptions**: Options object merged to the object used when calling `GeoJSONSource` method


### Example

```
<Layer
  type="symbol"
  layout={{ "icon-image": "harbor-15" }}>
</Layer>
```

----------
# Feature

Display a feature on the map, can only be used when wrapped in a `Layer` component. The type of the feature is defined at the `Layer` level. If you want to create a new type, create an associated new layer.

### Import

```
import { Feature } from "react-mapbox-gl";
```

### Properties
- **coordinates** *(required)* : `Array<Number>` Display the feature at the given position.
- **properties** : `Object` Properties object passed down to the feature at the creation of the source.
- **onClick** : `Function` Triggered when user click on the feature
  - Function::(args: Object)
    - Args contain the feature object, the map object and the arguments passed by mapbox from the event `click`
- **onHover** : `Function` Triggered when the mouse hover the feature element
  - Function::(args: Object)
  - Args contain the feature object, the map object and the arguments passed by mapbox from the event `onmousemove`
- **onEndHover** : `Function` Triggered at the end of the hover state
  - Function::(args: Object)
    - Args contain the map object and the arguments passed by Mapbox from the event `onmousemove`


### Example

```
<Feature coordinates={[-0.13235092163085938,51.518250335096376]}/>
```

----------
# ZoomControl

A custom react zoom control component.

### Import

```
import { ZoomControl } from "react-mapbox-gl";
```

### Properties
- **onControlClick** : `Function` triggered when user click on minus or plus button
  - Function::(map: Object, zoomDiff: Number)
- **style** : `Object` Style object merged with internal style into the container
- **zoomDiff** : `Number` The shift number passed to the callback `onControlClick`
- **position** *(Default: `topRight`)*: `String` The control position, Possible values :
  - `topRight`
  - `topLeft`
  - `bottomRight`
  - `bottomLeft`


### Example

```
<ZoomControl/>
```

----------
# ScaleControl

A custom react scale feedback control component.

### Import

```
import { ScaleControl } from "react-mapbox-gl";
```

### Properties
- **measurement** *(Default: `km`)*: `String`, Possible values :
  - `km`
  - `mi`
- **style** : `Object` Style object merged with internal style into the container
- **position** *(Default: `bottomRight`)*: `String` The control position, Possible values :
  - `topRight`
  - `topLeft`
  - `bottomRight`
  - `bottomLeft`


### Example

```
<ScaleControl/>
```

----------
# Popup

Before using Popup you need to import `mapbox-gl.css` file (see import css file above).

The popup component allow you to display a popup tooltip on top of the map using mapbox-gl-js.
You can define the content of the popup by using react component, it will be rendered as a DOM element using react-dom and injected in the popup.

### Import

```
import { Popup } from "react-mapbox-gl";
```

### Properties
- **coordinates** *(required)*: `Array of Number` Display the popup at the given position.
- **dangerouslySetInnerHTML**: `String` Set the content of the popup using string.
- **text**: `String` Set the text content of the popup
- **closeButton**: `Boolean` Add a cross button to close the popup
- **closeOnClick**: `Boolean` Close the popup in click on it
- **anchor**: `String` Set the anchor point of the popup, Possible values :
  - `top`
  - `bottom`
  - `left`
  - `right`
  - `top-left`
  - `top-right`
  - `bottom-left`
  - `bottom-right`


### Example

```
<Popup coordinates={[-0.13235092163085938,51.518250335096376]}>
  <h1>Popup</h1>
</Popup>
```
