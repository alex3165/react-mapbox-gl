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
