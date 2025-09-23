import {
  Cartesian2,
  Cartesian3,
  defined,
  destroyObject,
  DeveloperError,
  Frozen,
  HeadingPitchRoll,
  IntersectionTests,
  Matrix4,
  Plane,
  Ray,
  Transforms,
} from "@cesium/engine";

import AxisLinePrimitive from "./AxisLinePrimitive.js";
import getWidgetOrigin from "./getWidgetOrigin.js";
import TransformAxis from "./TransformAxis.js";
import getScreenSpaceScalingMatrix from "../getScreenSpaceScalingMatrix.js";

const widgetOriginScratch = new Cartesian3();
const originScratch = new Cartesian3();
const directionScratch = new Cartesian3();
const planeNormalScratch = new Cartesian3();
const pickedPointScratch = new Cartesian3();
const moveScratch = new Cartesian3();
const offsetProjectedScratch = new Cartesian3();
const rayScratch = new Ray();
const defaultPixelSize = 100;
const defaultMaximumMeterSize = Infinity;

function getLinePrimitive(axis) {
  return new AxisLinePrimitive({
    positions: [Cartesian3.ZERO, TransformAxis.getValue(axis)],
    arrow: true,
    color: TransformAxis.getColor(axis),
    id: axis,
    show: false,
  });
}

/**
 * @private
 * @ionsdk
 *
 * @param {Object} options
 * @param {Scene} options.scene
 * @param {Cartesian3} options.originOffset
 * @param {Function} options.setPosition
 * @param {Matrix4} options.transform
 * @param {Number} options.radius
 * @param {Number} options.pixelSize
 * @param {Number} options.maximumSizeInMeters
 */
function TranslationEditor(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  const scene = options.scene;

  this.originOffset = options.originOffset;

  this._polylineX = scene.primitives.add(getLinePrimitive(TransformAxis.X));
  this._polylineY = scene.primitives.add(getLinePrimitive(TransformAxis.Y));
  this._polylineZ = scene.primitives.add(getLinePrimitive(TransformAxis.Z));

  this._scene = scene;
  this._canvas = scene.canvas;
  this._setPositionCallback = options.setPosition;
  this._modelMatrix = new Matrix4();
  this._fixedFrame = new Matrix4();
  this._hpr = new HeadingPitchRoll();

  this._dragAlongVector = undefined;
  this._offsetVector = new Cartesian3();
  this._pickingPlane = new Plane(Cartesian3.UNIT_X, 0.0);
  this._dragging = false;
  this._active = false;

  this._transform = options.transform;
  this._radius = options.radius;
  this._pixelSize = defined(options.pixelSize)
    ? new Cartesian2(options.pixelSize, options.pixelSize)
    : new Cartesian2(defaultPixelSize, defaultPixelSize);
  this._maximumSizeInMeters = defined(options.maximumSizeInMeters)
    ? new Cartesian2(options.maximumSizeInMeters, options.maximumSizeInMeters)
    : new Cartesian2(defaultMaximumMeterSize, defaultMaximumMeterSize);

  //>>includeStart('debug', pragmas.debug);
  if (this._pixelSize.x < 0) {
    throw new DeveloperError(`pixelSize = ${this._pixelSize.x}, must be >= 0`);
  }

  if (this._maximumSizeInMeters.x < 0) {
    throw new DeveloperError(
      `maximumSizeInMeters = ${this._maximumSizeInMeters.x}, must be >= 0`,
    );
  }
  //>>includeEnd('debug');
  this.update();
}

Object.defineProperties(TranslationEditor.prototype, {
  active: {
    get: function () {
      return this._active;
    },
    set: function (active) {
      this._active = active;
      if (active) {
        this._polylineX.show = true;
        this._polylineY.show = true;
        this._polylineZ.show = true;
      } else {
        this._polylineX.show = false;
        this._polylineY.show = false;
        this._polylineZ.show = false;
        this._dragging = false;
      }
    },
  },

  pixelSize: {
    get: function () {
      return this._pixelSize.x;
    },
  },

  maximumSizeInMeters: {
    get: function () {
      return this._maximumSizeInMeters.x;
    },
  },
});

TranslationEditor.prototype.update = function () {
  const transform = this._transform;
  const ellipsoid = this._scene.mapProjection.ellipsoid;

  let modelMatrix = this._modelMatrix;
  const modelOrigin = Matrix4.getTranslation(transform, originScratch);
  const widgetOrigin = getWidgetOrigin(
    transform,
    this.originOffset,
    widgetOriginScratch,
  );

  const length = this._radius * Matrix4.getMaximumScale(this._transform) * 1.5;
  const hpr = Transforms.fixedFrameToHeadingPitchRoll(
    this._transform,
    ellipsoid,
    undefined,
    this._hpr,
  );
  hpr.pitch = 0;
  hpr.roll = 0;

  let hprToFF = Transforms.headingPitchRollToFixedFrame(
    modelOrigin,
    hpr,
    ellipsoid,
    undefined,
    this._fixedFrame,
  );
  hprToFF = Matrix4.setTranslation(hprToFF, widgetOrigin, hprToFF);
  modelMatrix = Matrix4.multiplyByUniformScale(hprToFF, length, modelMatrix);

  if (this._pixelSize.x > 0) {
    modelMatrix = getScreenSpaceScalingMatrix(
      this._pixelSize,
      this._maximumSizeInMeters,
      this._scene.frameState,
      modelMatrix,
      modelMatrix,
    );
  }

  this._polylineX.modelMatrix = modelMatrix;
  this._polylineY.modelMatrix = modelMatrix;
  this._polylineZ.modelMatrix = modelMatrix;
};

TranslationEditor.prototype.handleLeftDown = function (position) {
  const scene = this._scene;
  const camera = scene.camera;

  const pickedObjects = scene.drillPick(position);

  let pickedAxis;
  for (let i = 0; i < pickedObjects.length; i++) {
    const object = pickedObjects[i];
    if (defined(object.id) && defined(TransformAxis[object.id])) {
      pickedAxis = object.id;
      break;
    }
  }
  if (!defined(pickedAxis)) {
    return;
  }

  const origin = Matrix4.getTranslation(this._transform, originScratch);
  const dragAlongVector = TransformAxis.getValue(pickedAxis);
  const directionVector = Matrix4.multiplyByPointAsVector(
    this._fixedFrame,
    dragAlongVector,
    directionScratch,
  );

  //Finds a picking plane that includes the dragged axis and is somewhat perpendicular to the camera
  let planeNormal = planeNormalScratch;
  if (Math.abs(Cartesian3.dot(camera.upWC, directionVector)) > 0.7) {
    // if up and the direction are close to parellel, the dot product will be close to 1
    planeNormal = Cartesian3.cross(
      camera.rightWC,
      directionVector,
      planeNormal,
    );
  } else {
    planeNormal = Cartesian3.cross(camera.upWC, directionVector, planeNormal);
  }
  Cartesian3.normalize(planeNormal, planeNormal);

  const pickingPlane = Plane.fromPointNormal(
    origin,
    planeNormal,
    this._pickingPlane,
  );
  const offsetVector = IntersectionTests.rayPlane(
    camera.getPickRay(position, rayScratch),
    pickingPlane,
    this._offsetVector,
  );
  if (!defined(offsetVector)) {
    return;
  }
  Cartesian3.subtract(offsetVector, origin, offsetVector);
  this._dragging = true;
  this._dragAlongVector = dragAlongVector;
  scene.screenSpaceCameraController.enableInputs = false;
};

TranslationEditor.prototype.handleMouseMove = function (position) {
  if (!this._dragging) {
    return;
  }
  const scene = this._scene;
  const camera = scene.camera;

  const pickedPoint = IntersectionTests.rayPlane(
    camera.getPickRay(position, rayScratch),
    this._pickingPlane,
    pickedPointScratch,
  );
  if (!defined(pickedPoint)) {
    return;
  }

  const dragAlongVector = this._dragAlongVector;
  let origin = Matrix4.getTranslation(this._transform, originScratch);
  const directionVector = Matrix4.multiplyByPointAsVector(
    this._fixedFrame,
    dragAlongVector,
    directionScratch,
  );
  let moveVector = Cartesian3.subtract(pickedPoint, origin, moveScratch);
  moveVector = Cartesian3.projectVector(
    moveVector,
    directionVector,
    moveVector,
  );
  const offset = Cartesian3.projectVector(
    this._offsetVector,
    directionVector,
    offsetProjectedScratch,
  );
  moveVector = Cartesian3.subtract(moveVector, offset, moveVector);

  origin = Cartesian3.add(origin, moveVector, origin);
  this._setPositionCallback(origin);
};

TranslationEditor.prototype.handleLeftUp = function () {
  this._dragging = false;
  this._scene.screenSpaceCameraController.enableInputs = true;
};

TranslationEditor.prototype.isDestroyed = function () {
  return false;
};

TranslationEditor.prototype.destroy = function () {
  this.active = false;
  const scene = this._scene;
  scene.primitives.remove(this._polylineX);
  scene.primitives.remove(this._polylineY);
  scene.primitives.remove(this._polylineZ);
  destroyObject(this);
};
export default TranslationEditor;
