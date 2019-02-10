const { readFile, writeFile } = require('fs');

const files = [
  'allShapes.tsx',
  'londonCycle.tsx',
  'htmlFeatures.tsx',
  'threeDMap.tsx',
  'htmlCluster.tsx',
  'switchStyle.tsx',
  'geojsonLayer.tsx',
  'heatmap.tsx'
];

files.forEach((file) => {
  readFile(`./src/demos/${file}`, (err, data) => {
    if (err) {
      return console.log(err);
    }

    writeFile(`./src/demos/raws/${file.replace('tsx', 'raw')}`, data, () => {});
  });
});
