import { TimeInterval, defined, CzmlDataSource } from "@cesium/engine";
import RectangularSensorGraphics from "./RectangularSensorGraphics.js";
import processCommonSensorProperties from "./processCommonSensorProperties.js";

const iso8601Scratch = {
  iso8601: undefined,
};

export default function processRectangularSensor(
  entity,
  packet,
  entityCollection,
  sourceUri,
) {
  const rectangularSensorData = packet.agi_rectangularSensor;
  if (!defined(rectangularSensorData)) {
    return;
  }

  let interval;
  const intervalString = rectangularSensorData.interval;
  if (defined(intervalString)) {
    iso8601Scratch.iso8601 = intervalString;
    interval = TimeInterval.fromIso8601(iso8601Scratch);
  }

  let rectangularSensor = entity.rectangularSensor;
  if (!defined(rectangularSensor)) {
    entity.rectangularSensor = rectangularSensor =
      new RectangularSensorGraphics();
  }

  processCommonSensorProperties(
    rectangularSensor,
    rectangularSensorData,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Number,
    rectangularSensor,
    "xHalfAngle",
    rectangularSensorData.xHalfAngle,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Number,
    rectangularSensor,
    "yHalfAngle",
    rectangularSensorData.yHalfAngle,
    interval,
    sourceUri,
    entityCollection,
  );
}
