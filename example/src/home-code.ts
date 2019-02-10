export default (`
const Map = ReactMapboxGl({ accessToken });
const zoom = [8];

render(
  <Map
    style="mapbox://styles/mapbox/streets-v8"
    zoom={zoom}
    containerStyle={{
      height: "100%",
      width: "500px"
    }}>
      <Layer
        type="symbol"
        id="marker"
        layout={{ "icon-image": "marker-15" }}>
        <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
      </Layer>
  </Map>
);
`).trim();
