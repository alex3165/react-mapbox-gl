## 0.19.0 (December 12 2016)

- Implement the `Popup` and the `Marker` Components using React. These components now keep track of the context.

## 0.15.0 (October 23 2016)

- Upgrade mapbox-gl from v0.21.0 to v0.25.1 and don't build the vendor anymore, react-mapbox-gl is now using mapbox-gl/dist/mapbox-gl.js bundle again
- Improve the examples with a navigation to select one.
- Fix a major issue when removing a layer with a sourceId.

## 0.11.0 (September 8 2016)

- Add GeoJSONLayer component to display a raw geojson

## 0.8.0 (July 5 2016)

- Breaking change, zoom is now wrapped in an array so the map component can check for a reference equality of the value.

## 0.7.1 (June 16 2016)

- Update API documentation
- A change of the style geojson passed down to the map component will update the style of the map itself using mapbox `setStyle`
- Get rid of `lodash` for internal methods and smaller packages


## 0.7.0 (June 15 2016)

- Add `layerOptions` property to Layer component
- Layer can use external source : #22
- Add Layer with external source to all-shape example
- `onStyleLoad` callback is now called before childrens components are rendered
- Update mapbox-gl to version 0.20.0
- Add properties property to Feature component
