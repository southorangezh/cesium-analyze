import { TimeInterval, defined, CzmlDataSource } from "@cesium/engine";
import ConicSensorGraphics from "./ConicSensorGraphics.js";
import processCommonSensorProperties from "./processCommonSensorProperties.js";

const iso8601Scratch = {
  iso8601: undefined,
};

export default function processConicSensor(
  entity,
  packet,
  entityCollection,
  sourceUri,
) {
  const conicSensorData = packet.agi_conicSensor;
  if (!defined(conicSensorData)) {
    return;
  }

  let interval;
  const intervalString = conicSensorData.interval;
  if (defined(intervalString)) {
    iso8601Scratch.iso8601 = intervalString;
    interval = TimeInterval.fromIso8601(iso8601Scratch);
  }

  let conicSensor = entity.conicSensor;
  if (!defined(conicSensor)) {
    entity.conicSensor = conicSensor = new ConicSensorGraphics();
  }

  processCommonSensorProperties(
    conicSensor,
    conicSensorData,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Number,
    conicSensor,
    "innerHalfAngle",
    conicSensorData.innerHalfAngle,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Number,
    conicSensor,
    "outerHalfAngle",
    conicSensorData.outerHalfAngle,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Number,
    conicSensor,
    "minimumClockAngle",
    conicSensorData.minimumClockAngle,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Number,
    conicSensor,
    "maximumClockAngle",
    conicSensorData.maximumClockAngle,
    interval,
    sourceUri,
    entityCollection,
  );
}
