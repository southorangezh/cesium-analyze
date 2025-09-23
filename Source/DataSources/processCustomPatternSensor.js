import {
  Cartesian3,
  Spherical,
  TimeInterval,
  defined,
  CzmlDataSource,
} from "@cesium/engine";
import CustomPatternSensorGraphics from "./CustomPatternSensorGraphics.js";
import processCommonSensorProperties from "./processCommonSensorProperties.js";

const iso8601Scratch = {
  iso8601: undefined,
};

function unitSphericalUnpackArray(array) {
  const length = array.length;
  const result = new Array(length / 2);

  for (let i = 0; i < length; i += 2) {
    const index = i / 2;
    result[index] = new Spherical(array[i], array[i + 1]);
  }
  return result;
}

function sphericalUnpackArray(array) {
  const length = array.length;
  const result = new Array(length / 3);

  for (let i = 0; i < length; i += 3) {
    const index = i / 3;
    result[index] = new Spherical(array[i], array[i + 1], array[i + 2]);
  }
  return result;
}

function processDirectionsPacketData(
  object,
  propertyName,
  directionsData,
  entityCollection,
) {
  if (defined(directionsData.unitSpherical)) {
    directionsData.array = unitSphericalUnpackArray(
      directionsData.unitSpherical,
    );
  } else if (defined(directionsData.spherical)) {
    directionsData.array = sphericalUnpackArray(directionsData.spherical);
  } else if (defined(directionsData.unitCartesian)) {
    directionsData.array = Cartesian3.unpackArray(
      directionsData.unitCartesian,
    ).map(function (unitCartesian) {
      const spherical = Spherical.fromCartesian3(unitCartesian);
      return Spherical.normalize(spherical, spherical);
    });
  } else if (defined(directionsData.cartesian)) {
    directionsData.array = Cartesian3.unpackArray(directionsData.cartesian).map(
      function (cartesian) {
        return Spherical.fromCartesian3(cartesian);
      },
    );
  }

  if (defined(directionsData.array)) {
    CzmlDataSource.processPacketData(
      Array,
      object,
      propertyName,
      directionsData,
      undefined,
      undefined,
      entityCollection,
    );
  }
}

function processDirections(
  object,
  propertyName,
  directionsData,
  entityCollection,
) {
  if (!defined(directionsData)) {
    return;
  }

  if (Array.isArray(directionsData)) {
    for (let i = 0, length = directionsData.length; i < length; i++) {
      processDirectionsPacketData(
        object,
        propertyName,
        directionsData[i],
        entityCollection,
      );
    }
  } else {
    processDirectionsPacketData(
      object,
      propertyName,
      directionsData,
      entityCollection,
    );
  }
}

export default function processCustomPatternSensor(
  entity,
  packet,
  entityCollection,
  sourceUri,
) {
  const customPatternSensorData = packet.agi_customPatternSensor;
  if (!defined(customPatternSensorData)) {
    return;
  }

  let interval;
  const intervalString = customPatternSensorData.interval;
  if (defined(intervalString)) {
    iso8601Scratch.iso8601 = intervalString;
    interval = TimeInterval.fromIso8601(iso8601Scratch);
  }

  let customPatternSensor = entity.customPatternSensor;
  if (!defined(customPatternSensor)) {
    entity.customPatternSensor = customPatternSensor =
      new CustomPatternSensorGraphics();
  }

  processCommonSensorProperties(
    customPatternSensor,
    customPatternSensorData,
    interval,
    sourceUri,
    entityCollection,
  );
  processDirections(
    customPatternSensor,
    "directions",
    customPatternSensorData.directions,
    entityCollection,
  );
}
