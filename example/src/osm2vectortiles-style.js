// code taken here https://osm2vectortiles.tileserver.com/#v3/mapboxgl.code

const tileJSON = {"attribution":"<a href=\\\"http://www.openstreetmap.org/about/\\\" target=\\\"_blank\\\">&copy; OpenStreetMap contributors</a>","center":[-12.2168,28.6135,4],"description":"A tileset showcasing all layers in OpenMapTiles. http://openmaptiles.org","maxzoom":14,"minzoom":0,"name":"OpenMapTiles v3.1","id":"openmaptiles","mtime":"1477318673787","format":"pbf","type":"baselayer","version":"3.1","bounds":[-180,-85.0511,180,85.0511],"basename":"v3","profile":"mercator","scale":1,"tiles":["https://osm2vectortiles-0.tileserver.com/v3/{z}/{x}/{y}.pbf","https://osm2vectortiles-1.tileserver.com/v3/{z}/{x}/{y}.pbf","https://osm2vectortiles-2.tileserver.com/v3/{z}/{x}/{y}.pbf","https://osm2vectortiles-3.tileserver.com/v3/{z}/{x}/{y}.pbf"],"tilejson":"2.0.0","scheme":"xyz","grids":["https://osm2vectortiles-0.tileserver.com/v3/{z}/{x}/{y}.grid.json","https://osm2vectortiles-1.tileserver.com/v3/{z}/{x}/{y}.grid.json","https://osm2vectortiles-2.tileserver.com/v3/{z}/{x}/{y}.grid.json","https://osm2vectortiles-3.tileserver.com/v3/{z}/{x}/{y}.grid.json"],"vector_layers":[{"id":"boundary","description":"","minzoom":0,"maxzoom":14,"fields":{"admin_level":"Number","scalerank":"Number","class":"String"}},{"id":"highway","description":"","minzoom":0,"maxzoom":14,"fields":{"class":"String","subclass":"String"}},{"id":"building","description":"","minzoom":0,"maxzoom":14,"fields":{"osm_id":"Number","render_height":"Number"}},{"id":"place","description":"","minzoom":0,"maxzoom":14,"fields":{"name":"String","name_en":"String","place":"String","abbrev":"String","postal":"String","scalerank":"Number"}},{"id":"water","description":"","minzoom":0,"maxzoom":14,"fields":{"class":"String"}},{"id":"waterway","description":"","minzoom":0,"maxzoom":14,"fields":{"class":"String"}},{"id":"landcover","description":"","minzoom":0,"maxzoom":14,"fields":{"osm_id":"Number","class":"String","subclass":"String"}},{"id":"landuse","description":"","minzoom":0,"maxzoom":14,"fields":{"osm_id":"Number","class":"String","subclass":"String"}}],"zoom":7,"tileUrl":"https://osm2vectortiles-0.tileserver.com/v3/4/7/6.pbf"};

const layers_ = []

function generateColor(str) {
  var rgb = [0, 0, 0];
  for (var i = 0; i < str.length; i++) {
      var v = str.charCodeAt(i);
      rgb[v % 3] = (rgb[i % 3] + (13*(v%13))) % 12;
  }
  var r = 4 + rgb[0];
  var g = 4 + rgb[1];
  var b = 4 + rgb[2];
  r = (r * 16) + r;
  g = (g * 16) + g;
  b = (b * 16) + b;
  return [r,g,b,1];
};

tileJSON['vector_layers'].forEach(function(el) {
  let color = generateColor(el['id']);
  let colorText = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')';
  layers_.push({
    id: el['id'] + Math.random(),
    source: 'vector_layer_',
    'source-layer': el['id'],
    interactive: true,
    type: 'line',
    paint: {'line-color': colorText}
  });
});

const style = {
  version: 8,
  sources: {
    'vector_layer_': {
      type: 'vector',
      tiles: tileJSON['tiles'],
      minzoom: tileJSON['minzoom'],
      maxzoom: tileJSON['maxzoom']
    }
  },
  layers: layers_
}

export default style;
