import {
  Cartesian2,
  Cartesian3,
  defined,
  destroyObject,
  DeveloperError,
  Frozen,
  IntersectionTests,
  Matrix4,
  Plane,
  Ray,
  PointPrimitiveCollection,
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
const offsetScratch = new Cartesian3();
const rayScratch = new Ray();
const noScale = new Cartesian3(1.0, 1.0, 1.0);
let nonUniformScalingScratch = new Cartesian3();
const defaultPixelSize = 100;
const defaultMaximumMeterSize = Infinity;

function getPoint(axis) {
  return {
    position: TransformAxis.getValue(axis),
    show: false,
    color: TransformAxis.getColor(axis),
    pixelSize: 20,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
    id: axis,
  };
}

function getLinePrimitive(axis) {
  return new AxisLinePrimitive({
    positions: [Cartesian3.ZERO, TransformAxis.getValue(axis)],
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
 * @param {Scene} options.scene;
 * @param {Matrix4} options.transform
 * @param {Cartesian3} options.originOffset
 * @param {KnockoutObservable<Boolean>} options.enableNonUniformScaling
 * @param {Function} options.setPosition
 * @param {Function} options.setScale
 * @param {Number} options.radius
 * @param {Number} options.pixelSize
 * @param {Number} options.maximumSizeInMeters
 */
function ScaleEditor(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  const scene = options.scene;
  const transform = options.transform;

  const points = scene.primitives.add(new PointPrimitiveCollection());

  this.originOffset = options.originOffset;

  this._points = points;
  this._pointX = points.add(getPoint(TransformAxis.X));
  this._pointY = points.add(getPoint(TransformAxis.Y));
  this._pointZ = points.add(getPoint(TransformAxis.Z));

  this._polylineX = scene.primitives.add(getLinePrimitive(TransformAxis.X));
  this._polylineY = scene.primitives.add(getLinePrimitive(TransformAxis.Y));
  this._polylineZ = scene.primitives.add(getLinePrimitive(TransformAxis.Z));

  this._scene = scene;
  this._canvas = scene.canvas;
  this._enableNonUniformScaling = options.enableNonUniformScaling;
  this._setPositionCallback = options.setPosition;
  this._setScaleCallback = options.setScale;
  this._modelMatrix = new Matrix4();

  this._pickedAxis = undefined;
  this._dragAlongVector = undefined;
  this._offsetVector = new Cartesian3();
  this._pickingPlane = new Plane(Cartesian3.UNIT_X, 0.0);
  this._dragging = false;
  this._startPosition = new Cartesian3();
  this._startScale = new Cartesian3();
  this._startOffset = new Cartesian3();
  this._startTransform = new Matrix4();
  this._active = false;

  this._transform = transform;
  this._lineLength = options.radius * 1.5;
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

Object.defineProperties(ScaleEditor.prototype, {
  active: {
    get: function () {
      return this._active;
    },
    set: function (active) {
      this._active = active;
      if (active) {
        this._pointX.show = true;
        this._pointY.show = true;
        this._pointZ.show = true;
        this._polylineX.show = true;
        this._polylineY.show = true;
        this._polylineZ.show = true;
      } else {
        this._pointX.show = false;
        this._pointY.show = false;
        this._pointZ.show = false;
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

ScaleEditor.prototype.handleLeftDown = function (position) {
  const scene = this._scene;
  const transform = this._transform;
  const camera = scene.camera;

  const pickedObjects = scene.drillPick(position);
  const origin = Matrix4.getTranslation(transform, originScratch);

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
  const dragAlongVector = TransformAxis.getValue(pickedAxis);
  const directionVector = Matrix4.multiplyByPointAsVector(
    this._modelMatrix,
    dragAlongVector,
    directionScratch,
  );

  let planeNormal = planeNormalScratch;
  if (Math.abs(Cartesian3.dot(camera.upWC, directionVector)) > 0.7) {
    // if up and the direction are close to parallel, the dot product will be close to 1
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
  const startPosition = IntersectionTests.rayPlane(
    camera.getPickRay(position, rayScratch),
    pickingPlane,
    this._startPosition,
  );
  if (!defined(startPosition)) {
    return;
  }
  this._offsetVector = Cartesian3.subtract(
    startPosition,
    origin,
    this._offsetVector,
  );
  this._dragging = true;

  const startScale = Matrix4.getScale(transform, this._startScale);
  let startValue;
  if (pickedAxis === TransformAxis.X) {
    startValue = startScale.x;
  } else if (pickedAxis === TransformAxis.Y) {
    startValue = startScale.y;
  } else {
    startValue = startScale.z;
  }
  this._startValue = startValue;
  this._startOffset = Cartesian3.multiplyComponents(
    this.originOffset,
    startScale,
    this._startOffset,
  );
  this._dragAlongVector = dragAlongVector;
  this._pickedAxis = pickedAxis;
  this._startTransform = Matrix4.setScale(
    transform,
    noScale,
    this._startTransform,
  );
  scene.screenSpaceCameraController.enableInputs = false;
};

ScaleEditor.prototype.handleMouseMove = function (position) {
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
  const directionVector = Matrix4.multiplyByPointAsVector(
    this._modelMatrix,
    dragAlongVector,
    directionScratch,
  );
  let scaleVector = Cartesian3.subtract(
    pickedPoint,
    this._startPosition,
    moveScratch,
  );
  scaleVector = Cartesian3.projectVector(
    scaleVector,
    directionVector,
    scaleVector,
  );
  let scale = Cartesian3.magnitude(scaleVector);
  if (Cartesian3.dot(scaleVector, this._offsetVector) < 0) {
    // mouse drag is backwards, so we want to scale down
    scale = -scale;
  }

  scale /= this._lineLength;

  scale += this._startValue;
  if (scale <= 0) {
    return;
  }

  const pickedAxis = this._pickedAxis;
  const startScale = this._startScale;
  if (!this._enableNonUniformScaling()) {
    startScale.x = scale;
    startScale.y = scale;
    startScale.z = scale;
  } else if (pickedAxis === TransformAxis.X) {
    startScale.x = scale;
  } else if (pickedAxis === TransformAxis.Y) {
    startScale.y = scale;
  } else {
    startScale.z = scale;
  }

  let newOffset = Cartesian3.multiplyComponents(
    this.originOffset,
    startScale,
    offsetScratch,
  );
  newOffset = Cartesian3.subtract(this._startOffset, newOffset, newOffset);
  newOffset = Matrix4.multiplyByPoint(
    this._startTransform,
    newOffset,
    newOffset,
  );

  this._setScaleCallback(startScale);
  this._setPositionCallback(newOffset);
};

ScaleEditor.prototype.handleLeftUp = function () {
  this._dragging = false;
  this._scene.screenSpaceCameraController.enableInputs = true;
};

ScaleEditor.prototype.update = function () {
  const transform = this._transform;
  const widgetOrigin = getWidgetOrigin(
    transform,
    this.originOffset,
    widgetOriginScratch,
  );
  let modelMatrix = this._modelMatrix;
  modelMatrix = Matrix4.multiplyByUniformScale(
    transform,
    this._lineLength,
    modelMatrix,
  );
  modelMatrix = Matrix4.setTranslation(
    this._modelMatrix,
    widgetOrigin,
    modelMatrix,
  );

  const useScreenSpaceScaling = this._pixelSize.x > 0;
  if (useScreenSpaceScaling) {
    modelMatrix = getScreenSpaceScalingMatrix(
      this._pixelSize,
      this._maximumSizeInMeters,
      this._scene.frameState,
      modelMatrix,
      modelMatrix,
    );
  }

  // force synchronized polyline scaling to avoid axes awkwardly
  // changing sizes when using screenSpaceScaling / nonUniformScaling
  if (useScreenSpaceScaling && this._enableNonUniformScaling) {
    nonUniformScalingScratch = Matrix4.getScale(
      modelMatrix,
      nonUniformScalingScratch,
    );
    if (nonUniformScalingScratch.x >= nonUniformScalingScratch.y) {
      nonUniformScalingScratch.y = nonUniformScalingScratch.x;
      nonUniformScalingScratch.z = nonUniformScalingScratch.x;
    } else if (nonUniformScalingScratch.y >= nonUniformScalingScratch.x) {
      nonUniformScalingScratch.x = nonUniformScalingScratch.y;
      nonUniformScalingScratch.z = nonUniformScalingScratch.y;
    }
    modelMatrix = Matrix4.setScale(
      modelMatrix,
      nonUniformScalingScratch,
      modelMatrix,
    );
  }

  this._polylineX.modelMatrix = modelMatrix;
  this._polylineY.modelMatrix = modelMatrix;
  this._polylineZ.modelMatrix = modelMatrix;
  this._points.modelMatrix = modelMatrix;
};

ScaleEditor.prototype.isDestroyed = function () {
  return false;
};

ScaleEditor.prototype.destroy = function () {
  this.active = false;
  const scene = this._scene;
  this._points.removeAll();
  scene.primitives.remove(this._polylineX);
  scene.primitives.remove(this._polylineY);
  scene.primitives.remove(this._polylineZ);
  scene.primitives.remove(this._points);
  destroyObject(this);
};
export default ScaleEditor;
