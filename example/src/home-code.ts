export default `import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

const ReactMap = () => (
  <ReactMapboxGl
    style="mapbox://styles/mapbox/streets-v8"
    accessToken="ACCESS_TOKEN"
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
  </ReactMapboxGl>
);

export default ReactMap;
`;
