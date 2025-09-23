import {
  Cartesian2,
  Cartesian3,
  DeveloperError,
  Matrix4,
} from "@cesium/engine";

const scratchPlaneCenter = new Cartesian3();
const scratchPixelSize = new Cartesian2();
const scratchOldScale = new Cartesian3();
const scratchNetScale = new Cartesian3();

function getPixelSize(frameState, planeCenter, result) {
  const context = frameState.context;
  const cameraCenter = frameState.camera.positionWC;
  const distance = Cartesian3.distance(planeCenter, cameraCenter);
  const width = context.drawingBufferWidth;
  const height = context.drawingBufferHeight;
  return frameState.camera.frustum.getPixelDimensions(
    width,
    height,
    distance,
    frameState.pixelRatio,
    result,
  );
}

function getNetScaleFactor(
  pixelSize,
  maximumSizeInMeters,
  metersPerPixel,
  oldScale,
  result,
) {
  let scaleX = 1.0;
  let scaleY = 1.0;
  let scaleZ = 1.0;

  let sizeMeters;
  if (pixelSize.x > 0) {
    sizeMeters = pixelSize.x * metersPerPixel.x;
    scaleX = Math.min(sizeMeters, maximumSizeInMeters.x) / oldScale.x;
  }

  if (pixelSize.y > 0) {
    sizeMeters = pixelSize.y * metersPerPixel.y;
    scaleY = Math.min(sizeMeters, maximumSizeInMeters.y) / oldScale.y;
  }

  scaleZ = (scaleX + scaleY) / 2.0;
  return Cartesian3.fromElements(scaleX, scaleY, scaleZ, result);
}

/**
 * Use the Camera frustum to generate a scalingMatrix that scales primitives
 * relative to the number of pixels they should occupy on screen.
 *
 * @param {Cartesian2} pixelSize Desired number of pixels this primitive should occupy after scaling
 * @param {Cartesian2} maximumSizeInMeters Maximum number of meters this primitive should occupy after scaling
 * @param {FrameState} frameState Framestate with active camera / WebGL rendering context to use for scaling
 * @param {Matrix4} modelMatrix Existing modelMatrix to scale
 * @param {Matrix4} result The object into which to store the result
 * @returns {Matrix4} The modified result parameter.
 *
 * @private
 * @ionsdk
 */
export default function getScreenSpaceScalingMatrix(
  pixelSize,
  maximumSizeInMeters,
  frameState,
  modelMatrix,
  result,
) {
  //>>includeStart('debug', pragmas.debug);
  if (pixelSize.x < 0 || pixelSize.y < 0) {
    throw new DeveloperError(
      `pixelSize={${pixelSize.x}, ${pixelSize.y}}, both components must be >= 0`,
    );
  }

  if (maximumSizeInMeters.x < 0 || maximumSizeInMeters.y < 0) {
    throw new DeveloperError(
      `maximumSizeInMeters={${maximumSizeInMeters.x}, ${maximumSizeInMeters.y}}, both components must be >= 0`,
    );
  }
  //>>includeEnd('debug');

  const planeCenter = Matrix4.getTranslation(modelMatrix, scratchPlaneCenter);
  const metersPerPixel = getPixelSize(
    frameState,
    planeCenter,
    scratchPixelSize,
  );
  const oldScale = Matrix4.getScale(modelMatrix, scratchOldScale);
  const netScale = getNetScaleFactor(
    pixelSize,
    maximumSizeInMeters,
    metersPerPixel,
    oldScale,
    scratchNetScale,
  );
  return Matrix4.multiplyByScale(modelMatrix, netScale, result);
}
