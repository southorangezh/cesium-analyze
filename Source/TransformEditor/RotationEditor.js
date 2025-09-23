import {
  Cartesian2,
  Cartesian3,
  Color,
  defined,
  destroyObject,
  DeveloperError,
  Frozen,
  HeadingPitchRoll,
  IntersectionTests,
  Math as CesiumMath,
  Matrix3,
  Matrix4,
  Plane,
  Quaternion,
  Ray,
  Transforms,
} from "@cesium/engine";

import AxisLinePrimitive from "./AxisLinePrimitive.js";
import getWidgetOrigin from "./getWidgetOrigin.js";
import TransformAxis from "./TransformAxis.js";
import getScreenSpaceScalingMatrix from "../getScreenSpaceScalingMatrix.js";

const noScale = new Cartesian3(1.0, 1.0, 1.0);
const offsetScratch = new Cartesian3();
const widgetOriginScratch = new Cartesian3();
const rotationWorldScratch = new Cartesian3();
const rotatedTransformScratch = new Matrix4();
const inverseTransformScratch = new Matrix4();
const localStartScratch = new Cartesian3();
const localEndScratch = new Cartesian3();
const vector1Scratch = new Cartesian2();
const vector2Scratch = new Cartesian2();
const hprScratch = new HeadingPitchRoll();
const rayScratch = new Ray();
const intersectionScratch = new Cartesian3();
const quaternionScratch = new Quaternion();
const matrix3Scratch = new Matrix3();
const defaultPixelSize = 100;
const defaultMaximumMeterSize = Infinity;

function getUnitCirclePositions() {
  const xAxis = [];
  const yAxis = [];
  const zAxis = [];

  for (let i = 0; i < 360; i++) {
    const rad = CesiumMath.toRadians(i);
    const x = Math.cos(rad);
    const y = Math.sin(rad);

    xAxis.push(new Cartesian3(0.0, x, y));
    yAxis.push(new Cartesian3(y, 0.0, x));
    zAxis.push(new Cartesian3(x, y, 0.0));
  }
  return {
    x: xAxis,
    y: yAxis,
    z: zAxis,
  };
}

function getRotationAngle(transform, originOffset, axis, start, end) {
  const inverseTransform = Matrix4.inverse(transform, inverseTransformScratch);
  let localStart = Matrix4.multiplyByPoint(
    inverseTransform,
    start,
    localStartScratch,
  ); //project points to local coordinates so we can project to 2D
  let localEnd = Matrix4.multiplyByPoint(
    inverseTransform,
    end,
    localEndScratch,
  );

  localStart = Cartesian3.subtract(localStart, originOffset, localStart);
  localEnd = Cartesian3.subtract(localEnd, originOffset, localEnd);

  const v1 = vector1Scratch;
  const v2 = vector2Scratch;
  if (axis.x) {
    v1.x = localStart.y;
    v1.y = localStart.z;
    v2.x = localEnd.y;
    v2.y = localEnd.z;
  } else if (axis.y) {
    v1.x = -localStart.x;
    v1.y = localStart.z;
    v2.x = -localEnd.x;
    v2.y = localEnd.z;
  } else {
    v1.x = localStart.x;
    v1.y = localStart.y;
    v2.x = localEnd.x;
    v2.y = localEnd.y;
  }
  const ccw = v1.x * v2.y - v1.y * v2.x >= 0.0; //true when minimal angle between start and end is a counter clockwise rotation
  let angle = Cartesian2.angleBetween(v1, v2);
  if (!ccw) {
    angle = -angle;
  }
  return angle;
}

function getLinePrimitive(positions, axis) {
  return new AxisLinePrimitive({
    positions: positions,
    color: TransformAxis.getColor(axis),
    loop: true,
    show: false,
    id: axis,
  });
}

/**
 * @private
 * @ionsdk
 *
 * @param {Object} options
 * @param {Scene} options.scene
 * @param {Cartesian3} options.originOffset
 * @param {Function} options.setHeadingPitchRoll
 * @param {Function} options.setPosition
 * @param {Matrix4} options.transform
 * @param {Number} options.radius
 * @param {Number} options.pixelSize
 * @param {Number} options.maximumSizeInMeters
 */
function RotationEditor(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  const scene = options.scene;

  this._vectorLine1 = scene.primitives.add(
    new AxisLinePrimitive({
      width: 5,
      positions: [new Cartesian3(), new Cartesian3()],
      color: Color.YELLOW,
      show: false,
    }),
  );
  this._vectorLine2 = scene.primitives.add(
    new AxisLinePrimitive({
      width: 5,
      positions: [new Cartesian3(), new Cartesian3()],
      color: Color.YELLOW,
      show: false,
    }),
  );

  const circles = getUnitCirclePositions();

  this._polylineX = scene.primitives.add(
    getLinePrimitive(circles.x, TransformAxis.X),
  );
  this._polylineY = scene.primitives.add(
    getLinePrimitive(circles.y, TransformAxis.Y),
  );
  this._polylineZ = scene.primitives.add(
    getLinePrimitive(circles.z, TransformAxis.Z),
  );
  this._modelMatrix = Matrix4.clone(Matrix4.IDENTITY);

  this.originOffset = options.originOffset;
  this._scene = scene;
  this._setHPRCallback = options.setHeadingPitchRoll;
  this._setPositionCallback = options.setPosition;
  this._transform = options.transform;
  this._radius = options.radius;

  this._active = false;
  this._dragging = false;
  this._startTransform = new Matrix4();
  this._startRotation = new Matrix3();
  this._widgetOrigin = new Cartesian3();
  this._modelOrigin = new Cartesian3();
  this._rotationAxis = undefined;
  this._rotationPlane = new Plane(Cartesian3.UNIT_X, 0.0);
  this._rotationStartPoint = new Cartesian3();
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

Object.defineProperties(RotationEditor.prototype, {
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

RotationEditor.prototype.update = function () {
  const transform = this._transform;
  let modelMatrix = this._modelMatrix;
  modelMatrix = Matrix4.setScale(transform, noScale, modelMatrix);

  const widgetOrigin = getWidgetOrigin(
    transform,
    this.originOffset,
    widgetOriginScratch,
  );
  modelMatrix = Matrix4.setTranslation(modelMatrix, widgetOrigin, modelMatrix);

  const radius = this._radius * Matrix4.getMaximumScale(this._transform) * 1.25;
  modelMatrix = Matrix4.multiplyByUniformScale(
    modelMatrix,
    radius,
    modelMatrix,
  );

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

RotationEditor.prototype.handleLeftDown = function (position) {
  const scene = this._scene;
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

  const rotationAxis = TransformAxis.getValue(pickedAxis);
  const startTransform = Matrix4.setScale(
    this._transform,
    noScale,
    this._startTransform,
  );
  this._startRotation = Matrix4.getMatrix3(startTransform, this._startRotation);
  const modelOrigin = Matrix4.getTranslation(startTransform, this._modelOrigin);

  const widgetOrigin = getWidgetOrigin(
    this._transform,
    this.originOffset,
    this._widgetOrigin,
  );

  const rotationAxisEndWorld = Matrix4.multiplyByPoint(
    startTransform,
    rotationAxis,
    rotationWorldScratch,
  );
  let rotationAxisVectorWorld = Cartesian3.subtract(
    rotationAxisEndWorld,
    modelOrigin,
    rotationAxisEndWorld,
  );
  rotationAxisVectorWorld = Cartesian3.normalize(
    rotationAxisVectorWorld,
    rotationAxisVectorWorld,
  );

  const rotationPlane = Plane.fromPointNormal(
    widgetOrigin,
    rotationAxisVectorWorld,
    this._rotationPlane,
  );
  const rotationStartPoint = IntersectionTests.rayPlane(
    scene.camera.getPickRay(position, rayScratch),
    rotationPlane,
    this._rotationStartPoint,
  );
  this._dragging = defined(rotationStartPoint);
  this._rotationAxis = rotationAxis;
  scene.screenSpaceCameraController.enableInputs = false;
};

RotationEditor.prototype.handleMouseMove = function (position) {
  if (!this._dragging) {
    return;
  }
  const scene = this._scene;
  const ray = scene.camera.getPickRay(position, rayScratch);
  let intersection = IntersectionTests.rayPlane(
    ray,
    this._rotationPlane,
    intersectionScratch,
  );

  if (!defined(intersection)) {
    return;
  }

  const widgetOrigin = this._widgetOrigin;
  let modelOrigin = this._modelOrigin;
  const rotationStartPoint = this._rotationStartPoint;
  const vector1 = this._vectorLine1;
  const v1Pos = vector1.positions;
  const vector2 = this._vectorLine2;
  const v2Pos = vector2.positions;

  const v1 = Cartesian3.subtract(
    rotationStartPoint,
    widgetOrigin,
    vector1Scratch,
  );
  let v2 = Cartesian3.subtract(intersection, widgetOrigin, vector2Scratch);
  v2 = Cartesian3.normalize(v2, v2);
  v2 = Cartesian3.multiplyByScalar(v2, Cartesian3.magnitude(v1), v2);
  intersection = Cartesian3.add(widgetOrigin, v2, intersection);

  v1Pos[0] = widgetOrigin;
  v1Pos[1] = rotationStartPoint;
  v2Pos[0] = widgetOrigin;
  v2Pos[1] = intersection;
  vector1.positions = v1Pos;
  vector2.positions = v2Pos;
  vector1.show = true;
  vector2.show = true;

  const offset = Cartesian3.multiplyComponents(
    this.originOffset,
    Matrix4.getScale(this._transform, offsetScratch),
    offsetScratch,
  );
  const rotationAxis = this._rotationAxis;
  const angle = getRotationAngle(
    this._startTransform,
    offset,
    rotationAxis,
    rotationStartPoint,
    intersection,
  );
  let rotation = Matrix3.fromQuaternion(
    Quaternion.fromAxisAngle(rotationAxis, angle, quaternionScratch),
    matrix3Scratch,
  );

  rotation = Matrix3.multiply(this._startRotation, rotation, rotation);
  const rotationTransform = Matrix4.fromRotationTranslation(
    rotation,
    modelOrigin,
    rotatedTransformScratch,
  );
  this._setHPRCallback(
    Transforms.fixedFrameToHeadingPitchRoll(
      rotationTransform,
      scene.mapProjection.ellipsoid,
      undefined,
      hprScratch,
    ),
  );

  let newOffset = Cartesian3.negate(offset, vector1Scratch);
  newOffset = Matrix3.multiplyByVector(rotation, newOffset, newOffset);

  modelOrigin = Cartesian3.add(newOffset, widgetOrigin, modelOrigin);
  this._setPositionCallback(modelOrigin);
};

RotationEditor.prototype.handleLeftUp = function () {
  this._dragging = false;
  this._vectorLine1.show = false;
  this._vectorLine2.show = false;
  this._scene.screenSpaceCameraController.enableInputs = true;
};

RotationEditor.prototype.isDestroyed = function () {
  return false;
};

RotationEditor.prototype.destroy = function () {
  this.active = false;
  const scene = this._scene;

  scene.primitives.remove(this._vectorLine1);
  scene.primitives.remove(this._vectorLine2);
  scene.primitives.remove(this._polylineX);
  scene.primitives.remove(this._polylineY);
  scene.primitives.remove(this._polylineZ);

  destroyObject(this);
};

// exposed for testing
RotationEditor._getRotationAngle = getRotationAngle;
export default RotationEditor;
