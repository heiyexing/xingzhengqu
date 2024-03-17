const geobuf = require('geobuf');
const fs = require('fs');
const path = require('path');
const coordtransform = require('coordtransform');
const turf = require('@turf/turf');
const Pbf = require('pbf');
const resolve = (_) => path.resolve(__dirname, _);

const pdfPaths = fs
  .readdirSync(resolve('../data'))
  .map((item) => resolve(`../data/${item}`));

pdfPaths.map((item) => {
  const geoJson = geobuf.decode(new Pbf(fs.readFileSync(item)));

  turf.coordEach(geoJson, (currentCoord) => {
    const [newLng, newLat] = coordtransform.wgs84togcj02(...currentCoord);
    currentCoord[0] = newLng;
    currentCoord[1] = newLat;
  });

  // fs.writeFileSync(item.replace('.pbf', '.json'), JSON.stringify(geoJson));

  const buffer = geobuf.encode(geoJson, new Pbf());
  fs.writeFileSync(
    item.replace('/data', '/gcj02'),
    buffer,
  );
});
