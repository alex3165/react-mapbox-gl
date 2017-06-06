export default (`
const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A'
});

render(
  <Map
    style="mapbox://styles/mapbox/streets-v8"
    containerStyle={{
      height: "100vh",
      width: "100vw"
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
