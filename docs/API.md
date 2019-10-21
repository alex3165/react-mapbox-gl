# ReactMapboxGL

Factory function that returns a React Mapbox component. Parameters of the factory function are static; properties of your component are dynamic and get updated if they change between rendering.

## Pre-requirement

You will need a CSS loader to use this library as it injects mapbox-gl css.

### How to use

```jsx
import ReactMapboxGl from "react-mapbox-gl";

...

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A"
});

<Map style="mapbox://styles/mapbox/streets-v8"/>
```

### Factory parameters

* **accessToken** _(required)_ : `string` Mapbox access token.
* **apiUrl**: `string` Define a custom URL to fetch the vector tiles.
* **minZoom** _(Default: `0`)_: `number` Minimum zoom level. Must be between 0 and 20.
* **maxZoom** _(Default: `20`)_: `number` Maximum zoom level. Must be between 0 and 20.
* **scrollZoom** _(Default: `true`)_: `boolean` See [mapbox scrollZoom](https://www.mapbox.com/mapbox-gl-js/api/#Map)
* **hash** _(Default: `false`)_: `boolean`, [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/#Map)
* **preserveDrawingBuffer** _(Default: `false`)_: `boolean`, [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/#Map)
* **interactive** _(Default: `true`)_: `boolean` Set to `false` to disable interaction with the map.
* **attributionControl** _(Default: `true`)_: `boolean` Set to `false` to remove the attribution on the map.
* **customAttribution**: `string | string[]` String or strings to show in an AttributionControl. Only applicable if `attributionControl` option is set to `true`.
* **logoPosition** _(Default: `bottom-left`)_: `string` Set the position of the mapbox logo. Possible values:
  * `top-left`
  * `top-right`
  * `bottom-right`
  * `bottom-left`
* **renderWorldCopies** _(Default: `true`)_: `boolean` If `true`, multiple copies of the world will be rendered, when zoomed out.
* **dragRotate** _(Default: `true`)_: `boolean` Set to `false` to disable drag rotation, see [mapbox DragRotateHandler](https://www.mapbox.com/mapbox-gl-js/api/#DragRotateHandler)
* **pitchWithRotate** _(Default: `true`)_: `boolean` Set to `false` to disable pitch with rotation, see [mapbox PitchWithRotate](https://docs.mapbox.com/mapbox-gl-js/api/#map)
* **trackResize** _(Default: `true`)_: `boolean` If `true`, the map will automatically resize when the browser window resizes.
* **touchZoomRotate** _(Default: `true`)_: `boolean` If `true`, the "pinch to rotate and zoom" interaction is enabled. An Object value is passed as options to TouchZoomRotateHandler#enable .
* **doubleClickZoom** _(Default: `true`)_: `boolean` If `true`, the "double click to zoom" interaction is enabled (see DoubleClickZoomHandler).
* **keyboard** _(Default: `true`)_: `boolean` If `true` , keyboard shortcuts are enabled (see KeyboardHandler).
* **dragPan** _(Default: `true`)_: `boolean` If `true` , the "drag to pan" interaction is enabled (see DragPanHandler).
* **refreshExpiredTiles** _(Default: `true`)_: `boolean` If `false` , the map won't attempt to re-request tiles once they expire per their HTTP cacheControl / expires headers.
* **failIfMajorPerformanceCaveat** _(Default: `false`)_: `boolean` If `true` , map creation will fail if the performance of Mapbox GL JS would be dramatically worse than expected (i.e. a software renderer would be used).
* **bearingSnap** _(Default: `7`)_: `number` The threshold, measured in degrees, that determines when the map's bearing (rotation) will snap to north. For example, with a bearingSnap of 7, if the user rotates the map within 7 degrees of north, the map will automatically snap to exact north.
* **antialias** _(Default: `false`)_: `boolean` If  true, the gl context will be created with MSA antialiasing, which can be useful for antialiasing custom layers. This is false by default as a performance optimization.

### Component Properties

* **style** _(required)_ : `string | object` Mapbox map style, if changed, the style will be updated using `setStyle`.
* **onStyleLoad**: `(map, loadEvent) => void` called with the Mapbox Map instance when the `load` event is fired. You can use the callback's first argument to then interact with the Mapbox API.
* **center** _(Default: `[ -0.2416815, 51.5285582 ]`)_: `[number, number]` Center the map at the position at initialisation
  * Must be in longitude, latitude coordinate order (as opposed to latitude, longitude) to match GeoJSON (source: https://www.mapbox.com/mapbox-gl-js/api/#lnglat).
  * Re-center the map if the value change regarding the prev value or the actual center position [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
* **zoom** _(Default: `[11]`)_: `[number]` Zoom level of the map at initialisation wrapped in an array.
  * Check for reference equality between the previous value of zoom and the new one in order to update it or not.
* **maxBounds** : `LngLatBounds | number[][]` If set, the map is constrained to the given bounds [SouthWest, NorthEast]
* **fitBounds** : `[[number, number], [number, number]]` If set, the map will center on the given coordinates, [fitBounds](https://www.mapbox.com/mapbox-gl-js/api/#Map#fitBounds)
* **fitBoundsOptions** : `object` Options for [fitBounds](https://www.mapbox.com/mapbox-gl-js/api/#Map#fitBounds)
* **bearing**: `[number]` Bearing (rotation) of the map at initialisation measured in degrees counter-clockwise from north.
  * Check the previous value and the new one, if the value changed update the bearing value [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
* **pitch**: `[number]` Pitch (tilt) of the map at initialisation, range : `0 - 60`
* **containerStyle** : `object` The style of the container of the map passed as an object
* **className** : `string` ClassName passed down to the container div
* **movingMethod** _(Default: `flyTo`)_: `string` define the method used when changing the center or zoom position. Possible value :
  * `jumpTo`
  * `easeTo`
  * `flyTo`
* **animationOptions** : `object` Options for moving animation [see](https://www.mapbox.com/mapbox-gl-js/api/#animationoptions)
* **flyToOptions** : `object` Options for flyTo animation [see](https://www.mapbox.com/mapbox-gl-js/api/#map#flyto)
* **renderChildrenInPortal** : `boolean` If `true`, Popup and Marker elements will be rendered in a React portal, allowing mouse events to pass through them.

### Events

All mapbox map events are implemented in this library, see events section on mapbox documentation [api](https://www.mapbox.com/mapbox-gl-js/api). All the events have the following signature `(map: Mapbox.Map, evt: React.SyntheticEvent<any>) => void`.

The event names are written in camelCase:

```js
const events = {
  // Triggered when style of the map has loaded
  onStyleLoad,

  // mapbox-gl events
  onResize: 'resize',
  onDblClick: 'dblclick',
  onClick: 'click',
  onMouseMove: 'mousemove',
  onMouseOut: 'mouseout',
  onMoveStart: 'movestart',
  onMove: 'move',
  onMoveEnd: 'moveend',
  onMouseUp: 'mouseup',
  onMouseDown: 'mousedown',
  onDragStart: 'dragstart',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onZoomStart: 'zoomstart',
  onZoom: 'zoom',
  onZoomEnd: 'zoomend',
  onPitch: 'pitch',
  onPitchStart: 'pitchstart',
  onPitchEnd: 'pitchend',
  onWebGlContextLost: 'webglcontextlost',
  onWebGlContextRestored: 'webglcontextrestored',
  onRemove: 'remove',
  onContextMenu: 'contextmenu',
  onRender: 'render',
  onError: 'error',
  onSourceData: 'sourcedata',
  onDataLoading: 'dataloading',
  onStyleDataLoading: 'styledataloading',
  onStyleImageMissing: 'styleimagemissing',
  onTouchCancel: 'touchcancel',
  onData: 'data',
  onSourceDataLoading: 'sourcedataloading',
  onTouchMove: 'touchmove',
  onTouchEnd: 'touchend',
  onTouchStart: 'touchstart',
  onStyleData: 'styledata',
  onBoxZoomStart: 'boxzoomstart',
  onBoxZoomEnd: 'boxzoomend',
  onBoxZoomCancel: 'boxzoomcancel',
  onRotateStart: 'rotatestart',
  onRotate: 'rotate',
  onRotateEnd: 'rotateend'
};
```

---

# Layer

Creates a new Mapbox layer and creates all the sources depending on the child `Feature` components. Layer also creates a source if no sourceId is passed.

If you change the value of the paint or the layout property of the layer, it will automatically update this property using `setPaintProperty` or `setLayoutProperty` respectively.

> Only works with the first depth of the object.

### How to use

```jsx
import { Layer } from "react-mapbox-gl";

...

<Layer
  type="symbol"
  layout={{ "icon-image": "harbor-15" }}>
</Layer>
```

### Properties

* **id** : `string` The id of the layer or generate an incremented number as id
* **type** _(Default: `symbol`)_ : `string` The type of the features childrens elements, possible values :
  * `symbol`, Include a Mapbox `symbol` (`Point` GeoJson)
  * `line`, Include a Mapbox `line` (`LineString` GeoJson)
  * `fill`, Include a Mapbox `polygon` (`Fill` GeoJson)
  * `circle`, Include a Mapbox `circle` (`Point` GeoJson)
  * `raster`, Include a Mapbox raster layer
  * `fill-extrusion`, Include a Mapbox fill extrusion layer
  * `background`, Include a Mapbox background layer
  * `heatmap`, Include a Mapbox heatmap layer
* **layout**: `object` Mapbox layout object passed down to mapbox `map.addLayer` method [mapbox layout api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-layout)
* **paint**: `object` Mapbox paint object passed down to mapbox `map.addLayer` method [mapbox paint api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-paint)
* **geoJSONSourceOptions**: `object` Source options merged to object passed to `map.addSource`
* **metadata**: `object` metadata parameter passed to `map.addLayer`
* **sourceLayer**: `string` source-layer parameter passed to `map.addLayer`
* **minZoom**: `number` minzoom parameter passed to `map.addLayer`
* **maxZoom**: `number` maxzoom parameter passed to `map.addLayer`
* **filter**: `any[]` filter parameter passed to `map.addLayer`, see how to [use expressions to filter elements](https://www.mapbox.com/mapbox-gl-js/style-spec/#layer-filter)
* **sourceId**: `string` When passed to the layer, the source will not be created but only the layer and it will use the given source id.
* **before**: `string` Pass the id of a layer, it will display the current layer before the layer defined by the id. [mapbox api](https://www.mapbox.com/mapbox-gl-js/api/#Map#addLayer)
* **images**: `[imageKey: string, image: HTMLImageElement, options: object]` Also accepts array of the previous image tuple. Add images for use in layout with prop `icon-image`. The value should be the `imageKey` string of the tuple. Alternatively, use mapbox studio to upload the image, it will be fetched with the map style object. (see [map.addImage](https://www.mapbox.com/mapbox-gl-js/api/#map#addimage) options for the tuple options).
* **onMouseMove** `function` Mouse move handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
* **onMouseEnter** `function` Mouse enter handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
* **onMouseLeave** `function` Mouse leave handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
* **onMouseDown** `function` Mouse down handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
* **onMouseUp** `function` Mouse up handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
* **onClick** `function` Mouse click handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)

---

# Source

Add a source to the map (for layers to use, for example).

### How to use

```jsx
import { Source } from "react-mapbox-gl";

...

const RASTER_SOURCE_OPTIONS = {
  "type": "raster",
  "tiles": [
    "https://someurl.com/512/{z}/{x}/{y}",
  ],
  "tileSize": 512
};

<Source id="source_id" tileJsonSource={RASTER_SOURCE_OPTIONS} />
<Layer type="raster" id="layer_id" sourceId="source_id" />
```

### Properties

* **id** _(required)_: `string`
* **geoJsonSource** : `object` GeoJson source, see [mapbox-gl GeoJson](https://www.mapbox.com/mapbox-gl-js/style-spec/#sources-geojson) for options
* **tileJsonSource** : `object` TileJson source, see [mapbox-gl TileJson](https://www.mapbox.com/mapbox-gl-js/style-spec/#sources) for options
* **onSourceAdded** : `function` Executed once the source is added to the map, the source is passed as a first argument.
* **onSourceLoaded** : `function` Executed once the source data has been loaded for the first time (after [mapbox-gl map.event:load](https://www.mapbox.com/mapbox-gl-js/api/#map.event:load)), the source is passed as a first argument.

---

# GeoJSONLayer

Display on the map all the information contained in a geoJSON file.

_Note:_ GeoJSONLayer will not render any layers (`line`, `circle`, `fill`, etc...)
unless an associated `[layer]Layout` or `[layer]Paint` prop is provided.

### How to use

```jsx
import { GeoJSONLayer } from "react-mapbox-gl";

...

<GeoJSONLayer
  data={geojson}
  symbolLayout={{
    "text-field": "{place}",
    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    "text-offset": [0, 0.6],
    "text-anchor": "top"
  }}/>
```

### Properties

* **data** _(required)_: `string | object` The url to the geojson file or the geojson file itself.
* **lineLayout** | **symbolLayout** | **circleLayout** | **fillLayout** | **fillExtrusionLayout**: `Object` Layer layout information. [mapbox layout api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-layout)
* **linePaint** | **symbolPaint** | **circlePaint** | **fillPaint** | **fillExtrusionPaint**: `Object` Paint information. [mapbox paint api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-paint)
* **lineOnMouseDown** | **symbolOnMouseDown** | **circleOnMouseDown** | **fillOnMouseDown** | **fillExtrusionOnMouseDown**: `function` Mouse down handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
* **lineOnMouseUp** | **symbolOnMouseUp** | **circleOnMouseUp** | **fillOnMouseUp** | **fillExtrusionOnMouseUp**: `function` Mouse up handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
* **lineOnMouseMove** | **symbolOnMouseMove** | **circleOnMouseMove** | **fillOnMouseMove** | **fillExtrusionOnMouseMove**: `function` Mouse move handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
* **lineOnMouseEnter** | **symbolOnMouseEnter** | **circleOnMouseEnter** | **fillOnMouseEnter** | **fillExtrusionOnMouseEnter**: `function` Mouse enter handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
* **lineOnMouseLeave** | **symbolOnMouseLeave** | **circleOnMouseLeave** | **fillOnMouseLeave** | **fillExtrusionOnMouseLeave**: `function` Mouse leave handler. [mapbox map api](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
* **lineOnClick** | **symbolOnClick** | **circleOnClick** | **fillOnClick** | **fillExtrusionOnClick**: `function` Mouse click handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
* **sourceOptions**: `object` Options object merged to the object used when calling `GeoJSONSource` method
* **layerOptions**: `object` Passed down to the layer object when setting it out.
* **before**: `string` Pass the id of a layer, it will display the current layer before the layer defined by the id. [mapbox api](https://www.mapbox.com/mapbox-gl-js/api/#Map#addLayer)

---

# Feature

Displays a feature on the map. Can only be used when wrapped in a `Layer` component. The type of the feature is defined at the `Layer` level. If you want to create a new type, create an associated new layer.

### How to use

```jsx
import { Feature } from "react-mapbox-gl";

...

<Feature coordinates={[-0.13235092163085938,51.518250335096376]}/>
```

### Properties

* **coordinates** _(required)_ : `number[]` Display the feature at the given position.
* **properties** : `object` Properties object passed down to the feature at the creation of the source.
* **onClick** : `(mapWithEvt: object) => void` Triggered when user click on the feature
  * Args contain the feature object, the map object and the arguments passed by mapbox from the event `click`
* **onMouseEnter** : `(mapWithEvt: object) => void` Triggered when the mouse enter the feature element
  * Args contain the feature object, the map object and the arguments passed by mapbox from the event `onmousemove`
* **onMouseLeave** : `(mapWithEvt: object) => void` Triggered when the mouse leave the feature element
  * Args contain the map object and the arguments passed by Mapbox from the event `onmousemove`
* **draggable** _(Default: `false`)_ : `boolean` Define wether the feature is draggable or not.
* **onDragStart** : `(mapWithEvt: object) => void` Triggered when the user start dragging the feature.
* **onDrag** : `(mapWithEvt: object) => void` Triggered when the user continue dragging the feature (ie. move).
* **onDragEnd** : `(mapWithEvt: object) => void` Triggered when the user stop dragging the feature.

---

# Image

Adds to the map a image that can be used as [`icon-image`](https://www.mapbox.com/mapbox-gl-js/style-spec#layout-symbol-icon-image)

### How to use

Load local image. [see docs](https://www.mapbox.com/mapbox-gl-js/api#map#addimage)

```jsx harmony
<Image id={'image-uid'} data={someImage} />
```

Load image from url. [see docs](https://www.mapbox.com/mapbox-gl-js/api#map#loadimage)

```jsx harmony
<Image id={'image-uid'} url={'url/to/image'} />
```

### Properties

* **id** _(required)_: `string` the image name
* **url** `string` A url to load the image from [see docs](https://www.mapbox.com/mapbox-gl-js/api#map#loadimage)
* **data** `ImageDataType` The image data [see docs](https://www.mapbox.com/mapbox-gl-js/api#map#loadimage)
* **options** `ImageOptionsType` The image options [see docs](https://www.mapbox.com/mapbox-gl-js/api#map#loadimage)
* **onLoaded** `() => void` Will be called when image loaded to map
* **onError** `(error: Error) => void` Will be called if image did not load

---

# ZoomControl

A custom react zoom control component.

### How to use

```jsx
import { ZoomControl } from "react-mapbox-gl";

...

<ZoomControl/>
```

### Properties

* **onControlClick** : `(map: object, zoomDiff: number) => void` triggered when user clicks on minus or plus button
* **style** : `object` Style object merged with internal style into the container
* **className**: `string` Custom style using className for the container
* **zoomDiff** : `number` The shift number passed to the callback `onControlClick`
* **position** _(Default: `top-right`)_: `string` The control position, Possible values :
  * `top-right`
  * `top-left`
  * `bottom-right`
  * `bottom-left`
* **tabIndex** : `number` define the tab index value of the top container tag

---

# ScaleControl

A custom react scale feedback control component.

### How to use

```jsx
import { ScaleControl } from "react-mapbox-gl";

...

<ScaleControl/>
```

### Properties

* **measurement** _(Default: `km`)_: `string`, Possible values:
  * `km`
  * `mi`
* **style**: `object` Style object merged with internal style into the container
* **className**: `string` Custom style using className for the container
* **position** _(Default: `bottom-right`)_: `string` The control position, Possible values :
  * `top-right`
  * `top-left`
  * `bottom-right`
  * `bottom-left`
* **tabIndex** : `number` define the tab index value of the top container tag

---

# RotationControl

Displays the current map rotation, also resets the rotation to it's origin value on click.

### How to use

```jsx
import { RotationControl } from "react-mapbox-gl";

...

<RotationControl/>
```

### Properties

* **style** : `object` Style object merged with internal style into the container
* **className** : `string` Get passed to the container div
* **position** _(Default: `top-right`)_: `string` The control position, Possible values :
  * `top-right`
  * `top-left`
  * `bottom-right`
  * `bottom-left`
* **tabIndex** : `number` define the tab index value of the top container tag

---

# Popup

The popup component allows you to display a popup tooltip on top of the map using mapbox-gl-js.

### How to use

```jsx
import { Popup } from "react-mapbox-gl";

...

<Popup
  coordinates={[-0.13235092163085938,51.518250335096376]}
  offset={{
    'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
  }}>
  <h1>Popup</h1>
</Popup>
```

### Properties

* **coordinates** _(required)_: `[number, number]` Display the popup at the given position.
* **anchor**: `string` Set the anchor point of the popup, Possible values:
  * `top`
  * `bottom`
  * `left`
  * `right`
  * `center`
  * `top-left`
  * `top-right`
  * `bottom-left`
  * `bottom-right`
  * `null | undefined`: When not set, the anchor is automatically calculated to keep the content of the popup visible.
* **offset** _(Default: 0)_: `number | number[] | object` Set the offset of popup, where the tip of the popup will be pointing.
  * When `number` is passed, the popup will be offset by that number for all anchor positions.
  * When an `number[]` is passed (e.g. [-12, 30]), the popup will be offset by that point.
  * When `object` is passed, it must contain keys for different anchor positions and values as the offset (`number` or `number[]`)
* **onClick**: `function` Triggered whenever user click on the popup
* **style**: `object` Apply style to the marker container
* **className**: `string` Apply the className to the container of the popup
* **tabIndex** : `number` define the tab index value of the top container tag

---

# Marker

Add an HTML marker to the map.

_Note: When rendering many objects, avoid using `Marker`s as it will negatively affect performance. Use `Layer`s and `Feature`s instead._

### How to use

```jsx
import { Marker } from "react-mapbox-gl";

...

<Marker
  coordinates={[-0.2416815, 51.5285582]}
  anchor="bottom">
  <img src={markerUrl}/>
</Marker>
```

### Properties

* **coordinates** _(required)_: `[number, number]` Display the marker at the given position.
* **anchor**: `string` Same as Popup's anchor property.
* **offset**: `string` Same as Popup's offset property.
* **onClick**: `function` Triggered whenever user click on the marker
* **style**: `object` Apply style to the marker container
* **className**: `string` Apply the className to the container of the Marker
* **tabIndex** : `number` define the tab index value of the top container tag

---

# Cluster

Create a cluster of `Marker`.

### How to use

```jsx
import { Cluster } from "react-mapbox-gl";

...

clusterMarker = (coordinates) => (
  <Marker coordinates={coordinates} style={styles.clusterMarker}>
    C
  </Marker>
);

...

<Cluster ClusterMarkerFactory={this.clusterMarker}>
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

### Properties

* **ClusterMarkerFactory** _(required)_: `(coordinates: number[], pointCount: number, getLeaves: (limit?: number, offset?: number) => Array<React.ReactElement<any>>) => Marker` A function called for every cluster, the function must return a Marker component

  * `getLeaves()` return `Cluster` children of a cluster, with pagination support: limit is the number of points to return (set to Infinity for all points, default to 10), and offset is the amount of points to skip (for pagination).

* **radius**: _Default: 60_:`number` Cluster radius, in pixels.
* **minZoom**: _Default: 0_:`number` Minimum zoom level at which clusters are generated.
* **maxZoom**: _Default: 16_:`number` Maximum zoom level at which clusters are generated.
* **extent**: _Default: 512_:`number` (Tiles) Tile extent. Radius is calculated relative to this value.
* **nodeSize**: _Default: 64_:`number` Size of the KD-tree leaf node. Affects performance.
* **log**: _Default: false_:`boolean` Whether timing info should be logged.
* **zoomOnClick**: _Default: false_:`boolean` Zoom to bounds of cluster on click.
* **zoomOnClickPadding**: _Default: 20_:`number` The amount of padding in pixels to add to the cluster bounds for the zoom.
* **style**: `object` Apply style to the marker container
* **className**: `string` Apply the className to the container of the Marker
* **tabIndex** : `number` define the tab index value of the top container tag

---

# Using the original Mapbox API

Sometimes, react-mapbox-gl hasn't wrapped all of the functionality you need. In that case, you might want to access the original [mapbox-gl-js API](https://docs.mapbox.com/mapbox-gl-js/api).

For this, there are two options:

### onStyleLoad

`onStyleLoad` property on the component. The callback function will receive the map object as a first argument, then you can add your own logic alongside react-mapbox-gl.

### Context API

Arguably the nicer way to do this is to use the React context, which v4 added support for. You can grab the Map instance from the context anywhere within the `<Map />` component.

```
import ReactMapboxGL, { MapContext } from 'react-mapbox-gl';

const Map = ReactMapboxGL({ /* factory options */ });

const MyMap = () => (
  <Map style="your-style-here">
    <MapContext.Consumer>
      {(map) => {
        // use `map` here
      }}
    </MapContext.Consumer>
  </Map>
);
```
