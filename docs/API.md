# ReactMapboxGl

Display a mapbox webgl map
> Render the children elements only when the style of the map is loaded

To use the original Mapbox API use `onStyleLoad` property, the callback function will receive the map object as a first arguments, then you can add your own logic using [mapbox gl API](https://www.mapbox.com/mapbox-gl-js/api/).

### Import

```
import ReactMapboxGl from "react-mapbox-gl";
```

### Properties
- **style** *(required)* : `String | Object`  Mapbox map style, if changed, the style will be updated using `setStyle`.
- **accessToken** *(required)* : `String` Mapbox access token.
- **center** *(Default: `[ -0.2416815, 51.5285582 ]`)*: `Array<Number>` Center the map at the position at initialisation
  - Re-center the map if the value change regarding the prev value or the actual center position [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
- **zoom** *(Default: `[11]`)*: `Array<Number>` Zoom level of the map at initialisation wrapped in an array.
  - Check for reference equality between the previous value of zoom and the new one in order to update it or not.
- **minZoom** *(Default: `0`)*: `Number` Minimum zoom level. Must be between 0 and 20.
- **maxZoom** *(Default: `20`)*: `Number` Maximum zoom level. Must be between 0 and 20.
- **maxBounds** : `LngLatBounds | Array<Array<number>>` If set, the map is constrained to the given bounds [SouthWest, NorthEast]
- **fitBounds** : `Array<Array<number>>` If set, the map will center on the given coordinates, [fitBounds](https://www.mapbox.com/mapbox-gl-js/api/#Map#fitBounds)
- **fitBoundsOptions** : `FitBoundsOptions` Options for [fitBounds](https://www.mapbox.com/mapbox-gl-js/api/#Map#fitBounds)
- **bearing** *(Default: `0`)*: `Number` Bearing (rotation) of the map at initialisation measured in degrees counter-clockwise from north.
  - Check the previous value and the new one, if the value changed update the bearing value [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
- **pitch** *(Default: `0`)*: `Number` Pitch (tilt) of the map at initialisation, range : `0 - 60`
- **scrollZoom** *(Default: `true`)*: See [mapbox scrollZoom](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- **containerStyle** : `Object` The style of the container of the map
- **hash** *(Default: `false`)*: `Boolean`, [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- **preserveDrawingBuffer** *(Default: `false`)*: `Boolean`, [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- **interactive** *(Default: `true`)*: `Boolean` Set to `false` to disable interaction with the map.
- **movingMethod** *(Default: `flyTo`)*: `String` define the method used when changing the center or zoom position. Possible value :
  - `jumpTo`
  - `easeTo`
  - `flyTo`
- **attributionPosition**: `String` The corner of the map to include the mandatory Mapbox attribution. Possible values:
  - `top-left`
  - `top-right`
  - `bottom-left`
  - `bottom-right`
- **onClick**: `(map: Object, event: Object) => void` : Triggered whenever user click on the map
- **onStyleLoad**: `(map: Object, event: Object) => void` : Listener of Mapbox event : `map.on("style.load")`
- **onMouseMove**: `(map: Object, event: Object) => void` : Listen the mouse moving on the map
- **onMove**: `(map: Object, event: Object) => void` : Executed whenever the center of the map change
- **onMoveStart**: `(map: Object, event: Object) => void` : Executed when the move of the map start
- **onMoveEnd**: `(map: Object, event: Object) => void` : Executed when the move of the map end
- **onMouseUp** : `(map: Object, event: Object) => void` : Simple binding of Mapbox `mouseup` event
- **onDrag** : `(map: Object, event: Object) => void` : Simple binding of mapbox `ondrag` event
- **onDragStart** : `(map: Object, event: Object) => void` : Simple binding of mapbox `ondragstart` event
- **onDragEnd** : `(map: Object, event: Object) => void` : Simple binding of mapbox `ondragend` event
- **onZoom**: `(map: Object, event: Object) => void` : Executed repeatedly during transitions between zoom levels
- **onZoomStart**: `(map: Object, event: Object) => void` : Executed at the start of a transition between zoom levels
- **onZoomEnd**: `(map: Object, event: Object) => void` : Executed at the end of a transition between zoom levels
- **onPitch**: `(map: Object, event: Object) => void` : Executed when a pitch event is fired
- **onPitchStart**: `(map: Object, event: Object) => void` : Executed when the map pitch event start
- **onPitchEnd**: `(map: Object, event: Object) => void` : Executed when the map pitch event end
- **dragRotate** *(Default: `true`)*: `Boolean` Set to `false` to disable drag rotation, see [mapbox DragRotateHandler](https://www.mapbox.com/mapbox-gl-js/api/#DragRotateHandler)

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
  - `raster`, Include a Mapbox raster layer
- **layout**: `Object` Mapbox layout object passed down to mapbox `addLayer` method [mapbox layout api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-layout)
- **paint**: `Object` Mapbox paint object passed down to mapbox `addLayer` method [mapbox paint api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-paint)
- **sourceOptions**: `Object` Options object merged to the object used when calling `GeoJSONSource` method
- **layerOptions**: `Object` Passed down to the layer object when setting it out.
- **sourceId**: `String` When passed to the layer, the source will not be created but only the layer and it will use the given source id.
- **before**: `String` Pass the id of a layer, it will display the current layer before the layer defined by the id. [mapbox api](https://www.mapbox.com/mapbox-gl-js/api/#Map#addLayer)

### Example

```
<Layer
  type="symbol"
  layout={{ "icon-image": "harbor-15" }}>
</Layer>
```

----------
# Source

Add a source to the map (for layers to use, for example).

### Import

```
import { Source } from "react-mapbox-gl";
```

### Properties
- **id** *(required)*: `String`
- **geoJsonSource** : `Object` GeoJson source, see [mapbox-gl GeoJson](https://www.mapbox.com/mapbox-gl-js/style-spec/#sources-geojson) for options
- **tileJsonSource** : `Object` TileJson source, see [mapbox-gl TileJson](https://www.mapbox.com/mapbox-gl-js/style-spec/#sources) for options
- **onSourceAdded** : `Function` Executed once the source is added to the map, the source is passed as a first argument.
- **onSourceLoaded** : `Function` Executed once the source data has been loaded for the first time (after [mapbox-gl map.event:load](https://www.mapbox.com/mapbox-gl-js/api/#map.event:load)), the source is passed as a first argument.

### Example

```
const RASTER_SOURCE_OPTIONS = {
  "type": "raster",
  "tiles": [
    "https://someurl.com/512/{z}/{x}/{y}",
  ],
  "tileSize": 512
};

<Source id="example_id" tileJsonSource={RASTER_SOURCE_OPTIONS} />
<Layer type="raster" id="example_id" sourceId="example_id" />
```

----------
# GeoJSONLayer

Display on the map all the informations contained in a geojson file.

_Note:_ GeoJSONLayer will not render any layers (`line`, `circle`, `fill`, etc...)
unless an associated `[layer]Layout` or `[layer]Paint` prop is provided.

### Import
```
import { GeoJSONLayer } from "react-mapbox-gl";
```

### Properties
- **data** *(required)* : `String | Object` The url to the geojson file or the geojson file itself.
- **lineLayout** | **symbolLayout** | **circleLayout** | **fillLayout** | **fillExtrusionLayout** : `Object` Layer layout informations. [mapbox layout api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-layout)
- **linePaint** | **symbolPaint** | **circlePaint** | **fillPaint** | **fillExtrusionPaint** : `Object` Paint informations. [mapbox paint api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-paint)
- **sourceOptions**: `Object` Options object merged to the object used when calling `GeoJSONSource` method
- **layerOptions**: `Object` Passed down to the layer object when setting it out.
- **before**:`String` Pass the id of a layer, it will display the current layer before the layer defined by the id. [mapbox api](https://www.mapbox.com/mapbox-gl-js/api/#Map#addLayer)

### Example

```
<GeoJSONLayer
  data={geojson}
  symbolLayout={{
    "text-field": "{place}",
    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    "text-offset": [0, 0.6],
    "text-anchor": "top"
  }}/>
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
- **onClick** : `(args: Object) => void` Triggered when user click on the feature
  - Args contain the feature object, the map object and the arguments passed by mapbox from the event `click`
- **onMouseEnter** : `(args: Object) => void` Triggered when the mouse enter the feature element
  - Args contain the feature object, the map object and the arguments passed by mapbox from the event `onmousemove`
- **onMouseLeave** : `(args: Object) => void` Triggered when the mouse leave the feature element
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
- **onControlClick** : `(map: Object, zoomDiff: Number) => void` triggered when user click on minus or plus button
- **style** : `Object` Style object merged with internal style into the container
- **className**: `String` Custom style using className for the container 
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

The popup component allow you to display a popup tooltip on top of the map using mapbox-gl-js.

### Import

```
import { Popup } from "react-mapbox-gl";
```

### Properties
- **coordinates** *(required)*: `Array<Number>` Display the popup at the given position.
- **anchor**: `String` Set the anchor point of the popup, Possible values :
  - `top`
  - `bottom`
  - `left`
  - `right`
  - `top-left`
  - `top-right`
  - `bottom-left`
  - `bottom-right`
  - `null | undefined`: When not set, the anchor is automatically calculated to keep the content of the popup visible.
- **offset** *(Default: 0)*: `Number | Array<Number> | Object` Set the offset of popup, where the tip of the popup will be pointing.
  - When `Number` is passed, the popup will be offset by that number for all anchor positions.
  - When an `Array<Number>` is passed (e.g. [-12, 30]), the popup will be offset by that point.
  - When `Object` is passed, it must contain keys for different anchor positions and values as the offset (`Number` or `Array<Number>`)
- **onClick**: `Function` Triggered whenever user click on the popup
- **style**: `Object` Apply style to the marker container
- **className**: `String` Apply the className to the container of the popup

### Example

```
<Popup
  coordinates={[-0.13235092163085938,51.518250335096376]}
  offset={{
    'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
  }}>
  <h1>Popup</h1>
</Popup>
```

----------
# Marker

Add an html marker to the map.

### Import

```
import { Marker } from "react-mapbox-gl";
```

### Properties
- **coordinates** *(required)*: `Array<Number>` Display the marker at the given position.
- **anchor**: `String` Same as Popup's anchor property.
- **offset**: `String` Same as Popup's offset property.
- **onClick**: `Function` Triggered whenever user click on the marker
- **style**: `Object` Apply style to the marker container
- **className**: `String` Apply the className to the container of the Marker

### Example

```
<Marker
  coordinates={[-0.2416815, 51.5285582]}
  anchor="bottom">
  <img src={markerUrl}/>
</Marker>
```

________
# Cluster

Create a cluster of `Marker`

### Import

```
import { Cluster } from "react-mapbox-gl";
```

### Properties
- **ClusterMarkerFactory** *(required)*: `(coordinates: number[], pointCount: number) => Marker` A function called for every cluster, the function must return a Marker component
- **clusterThreshold**: *Default: 1*: `Number` Limit of number of cluster points to display wheter clustered marker or marker.
- **radius**: *Default: 60*:`Number` Cluster radius, in pixels.
- **minZoom**: *Default: 0*:`Number` Minimum zoom level at which clusters are generated.
- **maxZoom**: *Default: 16*:`Number` Maximum zoom level at which clusters are generated.
- **extent**: *Default: 512*:`Number` (Tiles) Tile extent. Radius is calculated relative to this value.
- **nodeSize**: *Default: 64*:`Number` Size of the KD-tree leaf node. Affects performance.
- **log**: *Default: false*:`Boolean` Whether timing info should be logged.

### Example

```
clusterMarker = (coordinates) => (
  <Marker coordinates={coordinates} style={styles.clusterMarker}>
    C
  </Marker>
);

...

<Cluster ClusterMarkerFactory={this.clusterMarker} clusterThreshold={8}>
  {
    places.features.map((feature, key) =>
      <Marker
        key={key}
        style={styles.marker}
        coordinates={feature.geometry.coordinates}
        onClick={this.onMarkerClick.bind(this, feature.geometry.coordinates)}>
        M
      </Marker>
    )
  }
</Cluster>
```
