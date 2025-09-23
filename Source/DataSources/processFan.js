import {
  Cartesian3,
  Spherical,
  TimeInterval,
  defined,
  Color,
  CzmlDataSource,
  ShadowMode,
} from "@cesium/engine";
import FanGraphics from "./FanGraphics.js";

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

export default function processFan(
  entity,
  packet,
  entityCollection,
  sourceUri,
) {
  const fanData = packet.agi_fan;
  if (!defined(fanData)) {
    return;
  }

  let interval = fanData.interval;
  if (defined(interval)) {
    interval = TimeInterval.fromIso8601(interval);
  }

  let fan = entity.fan;
  if (!defined(fan)) {
    entity.fan = fan = new FanGraphics();
  }

  CzmlDataSource.processPacketData(
    Boolean,
    fan,
    "show",
    fanData.show,
    interval,
    sourceUri,
    entityCollection,
  );
  processDirections(fan, "directions", fanData.directions, entityCollection);
  CzmlDataSource.processPacketData(
    Number,
    fan,
    "radius",
    fanData.radius,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processMaterialPacketData(
    fan,
    "material",
    fanData.material,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Boolean,
    fan,
    "perDirectionRadius",
    fanData.perDirectionRadius,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Boolean,
    fan,
    "fill",
    fanData.fill,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Boolean,
    fan,
    "outline",
    fanData.outline,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Color,
    fan,
    "outlineColor",
    fanData.outlineColor,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Number,
    fan,
    "outlineWidth",
    fanData.outlineWidth,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    Number,
    fan,
    "numberOfRings",
    fanData.numberOfRings,
    interval,
    sourceUri,
    entityCollection,
  );
  CzmlDataSource.processPacketData(
    ShadowMode,
    fan,
    "shadows",
    fanData.shadows,
    interval,
    sourceUri,
    entityCollection,
  );
}
