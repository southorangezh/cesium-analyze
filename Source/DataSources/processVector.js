import {
  TimeInterval,
  defined,
  Cartesian3,
  Color,
  CzmlDataSource,
} from "@cesium/engine";
import VectorGraphics from "./VectorGraphics.js";

const iso8601Scratch = {
  iso8601: undefined,
};

export default function processVector(
  entity,
  packet,
  entityCollection,
  sourceUri,
) {
  const vectorData = packet.agi_vector;
  if (!defined(vectorData)) {
    return;
  }

  let interval;
  const intervalString = vectorData.interval;
  if (defined(intervalString)) {
    iso8601Scratch.iso8601 = intervalString;
    interval = TimeInterval.fromIso8601(iso8601Scratch);
  }

  let vector = entity.vector;
  if (!defined(vector)) {
    entity.vector = vector = new VectorGraphics();
  }

  CzmlDataSource.processPacketData(
    Color,
    vector,
    "color",
    vectorData.color,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Boolean,
    vector,
    "show",
    vectorData.show,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Cartesian3,
    vector,
    "direction",
    vectorData.direction,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Number,
    vector,
    "length",
    vectorData.length,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Number,
    vector,
    "minimumLengthInPixels",
    vectorData.minimumLengthInPixels,
    interval,
    sourceUri,
    entityCollection,
  );
}
