const fs = require("fs-extra");
const geobuf = require("geobuf");
const path = require("path");
const coordtransform = require("coordtransform");
const turf = require("@turf/turf");
const Pbf = require("pbf");

const getDirPbf = (dir) => {
  return fs
    .readdirSync(path.resolve(__dirname, dir))
    .filter((item) => item.endsWith(".pbf"))
    .map((item) => path.resolve(__dirname, dir, item));
};

const pdfPath = [
  ...getDirPbf("../data"),
  ...getDirPbf("../data/gcj02"),
  ...getDirPbf("../data/wgs84"),
];

pdfPath.map((item) => {
  const geojson = geobuf.decode(new Pbf(fs.readFileSync(item)));
  fs.writeFileSync(item.replace(".pbf", ".json"), JSON.stringify(geojson));
});
