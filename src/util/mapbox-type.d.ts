declare namespace ReactMapboxGL {
  export class Evented extends mapboxgl.Evented {
    on(type: string, listener: Function): this;
    on(type: string, layerId: string, listener: Function): this;
  }

  export class Map extends mapboxgl.Map {
    setFilter(layer: string, filter?: any[]): this;
  }
}