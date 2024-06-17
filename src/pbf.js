const fs = require("fs-extra");
const geobuf = require("geobuf");
const path = require("path");
const coordtransform = require("coordtransform");
const turf = require("@turf/turf");
const Pbf = require("pbf");
const { groupBy, fromPairs } = require("lodash");

const getDirPbf = (dir) => {
  return fs
    .readdirSync(path.resolve(__dirname, dir))
    .filter((item) => item.endsWith(".json"))
    .map((item) => path.resolve(__dirname, dir, item));
};

const jsonPath = [
  ...getDirPbf("../data"),
  ...getDirPbf("../data/gcj02"),
  ...getDirPbf("../data/wgs84"),
];

jsonPath.forEach((item) => {
  const json = fs.readJsonSync(item);
  const buffer = geobuf.encode(json, new Pbf());
  fs.writeFileSync(item.replace(".json", ".pbf"), buffer);
});
