import {
  Check,
  defined,
  Cartesian2,
  Cartesian3,
  Math as CesiumMath,
} from "@cesium/engine";

import getWorldPosition from "../getWorldPosition.js";
import filterPickForMeasurement from "./filterPickForMeasurement.js";

const positionScratch = new Cartesian3();
const normalScratch = new Cartesian3();
const surfaceNormalScratch = new Cartesian3();

const scratchCartesian2s = [
  new Cartesian2(),
  new Cartesian2(),
  new Cartesian2(),
  new Cartesian2(),
];
const scratchCartesian3s = [
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3(),
];

/**
 * Computes the slope at a point defined by window coordinates.
 *
 * @param {Scene} scene The scene
 * @ionsdk
 * @param {Cartesian2} windowCoordinates The window coordinates
 * @returns {Number} The slope at the point relative to the ground between [0, PI/2].
 */
function getSlope(scene, windowCoordinates) {
  Check.defined("scene", scene);
  Check.defined("windowCoordinates", windowCoordinates);

  const worldPosition = getSlope._getWorldPosition(
    scene,
    windowCoordinates,
    filterPickForMeasurement,
    positionScratch,
  );
  if (!defined(worldPosition)) {
    return;
  }

  const distanceCameraToPositionThreshold = 10000.0;
  const pixelOffset = 2;
  const offsetDistanceRatioThreshold = 0.05;

  const cameraPosition = scene.camera.position;
  const distanceCameraToPosition = Cartesian3.distance(
    worldPosition,
    cameraPosition,
  );

  if (distanceCameraToPosition > distanceCameraToPositionThreshold) {
    // don't compute slope if camera is more than 10km away from point
    return;
  }

  const sc0 = scratchCartesian3s[0];
  const sc1 = scratchCartesian3s[1];
  const sc2 = scratchCartesian3s[2];
  const sc3 = scratchCartesian3s[3];

  let normal = scene.frameState.mapProjection.ellipsoid.geodeticSurfaceNormal(
    worldPosition,
    normalScratch,
  );
  normal = Cartesian3.negate(normal, normal);

  const sampledWindowCoordinate0 = Cartesian2.clone(
    windowCoordinates,
    scratchCartesian2s[0],
  );
  sampledWindowCoordinate0.x -= pixelOffset;
  sampledWindowCoordinate0.y -= pixelOffset;

  const sampledWindowCoordinate1 = Cartesian2.clone(
    windowCoordinates,
    scratchCartesian2s[1],
  );
  sampledWindowCoordinate1.x -= pixelOffset;
  sampledWindowCoordinate1.y += pixelOffset;

  const sampledWindowCoordinate2 = Cartesian2.clone(
    windowCoordinates,
    scratchCartesian2s[2],
  );
  sampledWindowCoordinate2.x += pixelOffset;
  sampledWindowCoordinate2.y += pixelOffset;

  const sampledWindowCoordinate3 = Cartesian2.clone(
    windowCoordinates,
    scratchCartesian2s[3],
  );
  sampledWindowCoordinate3.x += pixelOffset;
  sampledWindowCoordinate3.y -= pixelOffset;

  const sPosition0 = getSlope._getWorldPosition(
    scene,
    sampledWindowCoordinate0,
    filterPickForMeasurement,
    sc0,
  );
  const sPosition1 = getSlope._getWorldPosition(
    scene,
    sampledWindowCoordinate1,
    filterPickForMeasurement,
    sc1,
  );
  const sPosition2 = getSlope._getWorldPosition(
    scene,
    sampledWindowCoordinate2,
    filterPickForMeasurement,
    sc2,
  );
  const sPosition3 = getSlope._getWorldPosition(
    scene,
    sampledWindowCoordinate3,
    filterPickForMeasurement,
    sc3,
  );

  let v0, v1, v2, v3;
  if (defined(sPosition0)) {
    const line0 = Cartesian3.subtract(sPosition0, worldPosition, sc0);
    const d0 = Cartesian3.magnitude(line0);
    v0 =
      d0 / distanceCameraToPosition <= offsetDistanceRatioThreshold
        ? Cartesian3.normalize(line0, sc0)
        : undefined;
  }

  if (defined(sPosition1)) {
    const line1 = Cartesian3.subtract(sPosition1, worldPosition, sc1);
    const d1 = Cartesian3.magnitude(line1);
    v1 =
      d1 / distanceCameraToPosition <= offsetDistanceRatioThreshold
        ? Cartesian3.normalize(line1, sc1)
        : undefined;
  }

  if (defined(sPosition2)) {
    const line2 = Cartesian3.subtract(sPosition2, worldPosition, sc2);
    const d2 = Cartesian3.magnitude(line2);
    v2 =
      d2 / distanceCameraToPosition <= offsetDistanceRatioThreshold
        ? Cartesian3.normalize(line2, sc2)
        : undefined;
  }

  if (defined(sPosition3)) {
    const line3 = Cartesian3.subtract(sPosition3, worldPosition, sc3);
    const d3 = Cartesian3.magnitude(line3);
    v3 =
      d3 / distanceCameraToPosition <= offsetDistanceRatioThreshold
        ? Cartesian3.normalize(line3, sc3)
        : undefined;
  }

  let surfaceNormal = Cartesian3.clone(Cartesian3.ZERO, surfaceNormalScratch);
  let scratchNormal = scratchCartesian3s[4];

  if (defined(v0) && defined(v1)) {
    scratchNormal = Cartesian3.normalize(
      Cartesian3.cross(v0, v1, scratchNormal),
      scratchNormal,
    );
    surfaceNormal = Cartesian3.add(surfaceNormal, scratchNormal, surfaceNormal);
  }
  if (defined(v1) && defined(v2)) {
    scratchNormal = Cartesian3.normalize(
      Cartesian3.cross(v1, v2, scratchNormal),
      scratchNormal,
    );
    surfaceNormal = Cartesian3.add(surfaceNormal, scratchNormal, surfaceNormal);
  }
  if (defined(v2) && defined(v3)) {
    scratchNormal = Cartesian3.normalize(
      Cartesian3.cross(v2, v3, scratchNormal),
      scratchNormal,
    );
    surfaceNormal = Cartesian3.add(surfaceNormal, scratchNormal, surfaceNormal);
  }
  if (defined(v3) && defined(v0)) {
    scratchNormal = Cartesian3.normalize(
      Cartesian3.cross(v3, v0, scratchNormal),
      scratchNormal,
    );
    surfaceNormal = Cartesian3.add(surfaceNormal, scratchNormal, surfaceNormal);
  }

  if (surfaceNormal.equals(Cartesian3.ZERO)) {
    return;
  }

  surfaceNormal = Cartesian3.normalize(surfaceNormal, surfaceNormal);

  return CesiumMath.asinClamped(
    Math.abs(Math.sin(Cartesian3.angleBetween(surfaceNormal, normal))),
  ); // Always between 0 and PI/2.
}

// exposed for specs
getSlope._getWorldPosition = getWorldPosition;
export default getSlope;
