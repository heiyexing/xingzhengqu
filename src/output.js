const fs = require("fs-extra");
const path = require("path");
const async = require("async");
const geobuf = require("geobuf");
const Pbf = require("pbf");
const prettier = require("prettier");
const coordtransform = require("coordtransform");
const turf = require("@turf/turf");

const getGeoJsonPbf = (json) => {
  return geobuf.encode(json, new Pbf());
};

const writePbfAndJson = async (filePath, json) => {
  fs.writeFileSync(
    filePath,
    await prettier.format(JSON.stringify(json), {
      parser: "json",
    })
  );
  const buffer = getGeoJsonPbf(json);
  fs.writeFileSync(filePath.replace(".json", ".pbf"), buffer);
};

const transformWGS84ToGCJ02 = (geoJson) => {
  const newGeoJson = turf.clone(geoJson);
  turf.coordEach(newGeoJson, (currentCoord) => {
    const [newLng, newLat] = coordtransform.wgs84togcj02(...currentCoord);
    currentCoord[0] = +(+newLng).toFixed(6);
    currentCoord[1] = +(+newLat).toFixed(6);
  });
  return newGeoJson;
};

async.mapLimit(
  fs.readdirSync(path.resolve(__dirname, "./data")),
  1,
  async (filename) => {
    const geojson = fs.readJsonSync(
      path.resolve(__dirname, "./data", filename)
    );

    await writePbfAndJson(
      path.resolve(__dirname, "../data", filename),
      geojson
    );
    await writePbfAndJson(
      path.resolve(__dirname, "../data/wgs84", filename),
      geojson
    );
    await writePbfAndJson(
      path.resolve(__dirname, "../data/gcj02", filename),
      transformWGS84ToGCJ02(geojson)
    );
  }
);
