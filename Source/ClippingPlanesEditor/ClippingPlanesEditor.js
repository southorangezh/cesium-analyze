import {
  Cartesian2,
  Cartesian3,
  Check,
  defined,
  destroyObject,
  DeveloperError,
  Frozen,
  IntersectionTests,
  Matrix4,
  Plane,
  Ray,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cesium3DTileset,
  GlobeSurfaceTileProvider,
  Model,
  PrimitiveCollection,
  SceneMode,
} from "@cesium/engine";
import ClippingPlanePrimitive from "./ClippingPlanePrimitive.js";

const planeScratch = new Plane(Cartesian3.UNIT_X, 0);
const scalarScratch = new Cartesian3();
const positionScratch = new Cartesian3();
const normalScratch = new Cartesian3();
const inverseTransformScratch1 = new Matrix4();
const inverseTransformScratch2 = new Matrix4();
const cart3Scratch1 = new Cartesian3();
const cart3Scratch2 = new Cartesian3();
const cart3Scratch3 = new Cartesian3();
const cart3Scratch4 = new Cartesian3();
const cart3Scratch5 = new Cartesian3();
const rayScratch = new Ray();

function computeOrigin(transform, origin, plane, result) {
  let adjustedPlane = Plane.clone(plane, planeScratch);
  adjustedPlane.distance = 0;

  adjustedPlane = Plane.transform(adjustedPlane, transform, adjustedPlane);
  return Cartesian3.subtract(
    origin,
    Cartesian3.multiplyByScalar(
      adjustedPlane.normal,
      Plane.getPointDistance(adjustedPlane, origin),
      scalarScratch,
    ),
    result,
  );
}

function movePlane(transform, origin, plane) {
  let adjustedPlane = Plane.clone(plane, planeScratch);
  adjustedPlane.distance = 0;
  adjustedPlane = Plane.transform(adjustedPlane, transform, adjustedPlane);
  plane.distance = -Plane.getPointDistance(adjustedPlane, origin);
}

/**
 * Creates visual clipping planes and mouse handlers for adjusting the clipping planes added to a {@link Cesium3DTileset}, {@link Model} or {@link Globe}.
 *
 * @alias ClippingPlanesEditor
 * @ionsdk
 * @constructor
 *
 * @param {Object} options An object with the following properties:
 * @param {Scene} options.scene The scene.
 * @param {ClippingPlaneCollection} options.clippingPlanes A clipping plane collection that has been set for a Cesium3DTileset, Model or Globe.
 * @param {Cartesian3} [options.origin] The position the visual clipping planes are relative to.  If not provided, a position will be computed from the modelMatrix or the primitive bounding sphere.
 * @param {Cartesian2} [options.planeSizeInMeters] The width and height of the clipping planes in meters. If not provided, size will be computed based on the primitive bounding sphere radius, or 200.0 for terrain clipping.
 * @param {Boolean} [options.movePlanesToOrigin=true] If true, ClippingPlanesEditor recomputes the plane distance to move the clipping planes to the origin.  Otherwise the original plane distance is unaltered.
 * @param {Cartesian2} [options.pixelSize=Cesium.Cartesian2(100, 100)] The size of the clipping planes in pixels of screen space in each direction. This overrides options.planeSizeInMeters. To disable fixed screen-space size for either the x- or y-direction, set the corresponding component(s) to 0
 * @param {Cartesian2} [options.maximumSizeInMeters=Cesium.Cartesian2(Infinity, Infinity)] The maximum size of the clipping planes in meters when fixed screen-space size is enabled. To disable this size limit for either the x- or y-direction, set the corresponding component(s) to Infinity
 *
 * @demo <a href="/Apps/Sandcastle/index.html?src=Clipping%20Planes%20Editor.html">Cesium Sandcastle Clipping Planes Editor Demo</a>
 * @example
 * // Attach 4 clipping planes to a tileset
 * tileset.clippingPlanes = new IonSdkMeasurements.ClippingPlaneCollection({
 *  planes : [
 *    new IonSdkMeasurements.ClippingPlane(new Cesium.Cartesian3(1.0, 0.0, 0.0), 100),
 *    new IonSdkMeasurements.ClippingPlane(new Cesium.Cartesian3(-1.0, 0.0, 0.0), 100),
 *    new IonSdkMeasurements.ClippingPlane(new Cesium.Cartesian3(0.0, 1.0, 0.0), 100),
 *    new IonSdkMeasurements.ClippingPlane(new Cesium.Cartesian3(0.0, -1.0, 0.0), 100),
 *  ],
 *  unionClippingRegions: true,
 *  edgeWidth : 1.0
 * });
 * // Create and activate the editor to visualize and move the planes.
 * var clippingPlanesEditor = new IonSdkMeasurements.ClippingPlanesEditor({
 *  scene: viewer.scene,
 *  clippingPlanes: tileset.clippingPlanes,
 *  movePlanesToOrigin: false
 * });
 * clippingPlanesEditor.activate();
 */
function ClippingPlanesEditor(options) {
  const scene = options.scene;
  const clippingPlanes = options.clippingPlanes;

  //>>includeStart('debug', pragmas.debug);
  Check.defined("options.scene", scene);
  Check.defined("options.clippingPlanes", clippingPlanes);
  //>>includeEnd('debug');

  const primitives = scene.primitives.add(new PrimitiveCollection());

  const that = this;
  this._removeAddEventListener = clippingPlanes.planeAdded.addEventListener(
    function () {
      that._addPlane();
    },
    this,
  );
  this._removeRemoveEventListener =
    clippingPlanes.planeRemoved.addEventListener(
      ClippingPlanesEditor.prototype._removePlane,
      this,
    );

  this._planeSizeInMeters = options.planeSizeInMeters;
  this._scene = scene;
  this._sseh = new ScreenSpaceEventHandler(scene.canvas);
  this._clippingPlanes = clippingPlanes;
  this._primitives = primitives;
  this._origin = options.origin;
  this._movePlanesToOrigin = options.movePlanesToOrigin ?? true;
  this._primitiveOptions = options.primitiveOptions ?? Frozen.EMPTY_OBJECT;
  this._active = false;
  this._pickedPlane = undefined;
  this._hoverPlane = undefined;
  this._draggingPlane = new Plane(Cartesian3.UNIT_X, 0);
  this._pixelSize = options.pixelSize;
  this._maximumSizeInMeters = options.maximumSizeInMeters;

  this._target = undefined;
  this._transform = Matrix4.clone(Matrix4.IDENTITY);
  this._createPlanes();
}

Object.defineProperties(ClippingPlanesEditor.prototype, {
  /**
   * Gets whether the clipping plane tool is active.
   * @type {Boolean}
   * @memberof ClippingPlanesEditor.prototype
   * @readonly
   */
  active: {
    get: function () {
      return this._active;
    },
  },
  /**
   * Gets the scene.
   * @type {Scene}
   * @memberof ClippingPlanesEditor.prototype
   * @readonly
   */
  scene: {
    get: function () {
      return this._scene;
    },
  },
  /**
   * Gets the clipping plane collection.
   * @type {ClippingPlaneCollection}
   * @memberof ClippingPlanesEditor.prototype
   * @readonly
   */
  clippingPlanes: {
    get: function () {
      return this._clippingPlanes;
    },
  },
});

/**
 * Activates mouse handlers.
 */
ClippingPlanesEditor.prototype.activate = function () {
  this._active = true;

  const primitives = this._primitives;
  for (let i = 0; i < primitives.length; i++) {
    primitives.get(i).show = true;
  }
  const sseh = this._sseh;

  sseh.setInputAction(
    this._handleLeftDown.bind(this),
    ScreenSpaceEventType.LEFT_DOWN,
  );
  sseh.setInputAction(
    this._handleLeftUp.bind(this),
    ScreenSpaceEventType.LEFT_UP,
  );
  sseh.setInputAction(
    this._handleMouseMove.bind(this),
    ScreenSpaceEventType.MOUSE_MOVE,
  );
};

/**
 * Deactivates the mouse handlers.
 */
ClippingPlanesEditor.prototype.deactivate = function () {
  const primitives = this._primitives;
  for (let i = 0; i < primitives.length; i++) {
    primitives.get(i).show = false;
  }

  const sseh = this._sseh;
  sseh.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
  sseh.removeInputAction(ScreenSpaceEventType.LEFT_UP);
  sseh.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);

  this._active = false;
};

/**
 * @private
 */
ClippingPlanesEditor.prototype._createPlanes = function () {
  const clippingPlanes = this._clippingPlanes;

  const target = clippingPlanes.owner;
  if (typeof target === "undefined") {
    const removeListener = this._scene.preRender.addEventListener(() => {
      // if plane is on a model entity, we have to wait for it to be assigned the actual Model
      removeListener();
      if (!this.isDestroyed()) {
        this._createPlanes();
      }
    });
    return;
  }
  this._target = target;

  const origin = this._origin;
  if (target instanceof Cesium3DTileset) {
    this._transform = target.clippingPlanesOriginMatrix;
    if (!defined(origin)) {
      this._origin = Cartesian3.clone(target.boundingSphere.center);
    }

    for (let i = 0; i < clippingPlanes.length; i++) {
      this._addPlane(clippingPlanes.get(i));
    }
  } else if (target instanceof Model) {
    const updateTransformAndCreatePlanes = () => {
      this._transform = target.modelMatrix;
      if (!defined(origin)) {
        this._origin = Cartesian3.clone(target.boundingSphere.center);
      }
      for (let i = 0; i < clippingPlanes.length; i++) {
        this._addPlane(clippingPlanes.get(i));
      }
    };

    if (target.ready) {
      updateTransformAndCreatePlanes();
      return;
    }

    const removeListener = target.readyEvent.addEventListener(() => {
      removeListener();

      if (this.isDestroyed()) {
        return;
      }

      updateTransformAndCreatePlanes();
    });
  } else if (target instanceof GlobeSurfaceTileProvider) {
    this._transform = clippingPlanes.modelMatrix;
    if (!defined(origin)) {
      this._origin = Matrix4.getTranslation(
        clippingPlanes.modelMatrix,
        new Cartesian3(),
      );
    }

    for (let i = 0; i < clippingPlanes.length; i++) {
      this._addPlane(clippingPlanes.get(i));
    }

    return;
  }
  //>>includeStart('debug', pragmas.debug);
  else {
    throw new DeveloperError(
      "ClippingPlanesEditor is incompatible with the object owning options.clippingPlanes",
    );
  }
  //>>includeEnd('debug');
};

/**
 * @private
 */
ClippingPlanesEditor.prototype._addPlane = function (clippingPlane) {
  const that = this;
  const movePlanesToOrigin = this._movePlanesToOrigin;
  const primitives = this._primitives;
  let planePosition;
  let planeSizeInMeters = this._planeSizeInMeters;
  const pixelSize = this._pixelSize;
  const maximumSizeInMeters = this._maximumSizeInMeters;
  const primitiveOptions = this._primitiveOptions;

  const target = that._target;
  const origin = that._origin;
  const transform = that._transform;
  const inverseTransform = Matrix4.inverse(transform, inverseTransformScratch1);
  if (Matrix4.equals(transform, Matrix4.IDENTITY)) {
    planePosition = origin;
    if (movePlanesToOrigin) {
      clippingPlane.distance = 0;
    }
  } else {
    planePosition = computeOrigin(
      transform,
      origin,
      clippingPlane,
      positionScratch,
    );
    if (movePlanesToOrigin) {
      movePlane(transform, origin, clippingPlane);
    }
  }

  if (!defined(planeSizeInMeters)) {
    planeSizeInMeters = that._computePlaneSize(target);
  }

  const localOrigin = Matrix4.multiplyByPoint(
    inverseTransform,
    planePosition,
    cart3Scratch5,
  );
  const localTransform = Matrix4.fromTranslation(localOrigin);

  primitives.add(
    new ClippingPlanePrimitive({
      transform: transform,
      localTransform: localTransform,
      clippingPlane: clippingPlane,
      show: that._active,
      size: planeSizeInMeters,
      disableDepthFail: primitiveOptions.disableDepthFail,
      outlineColor: primitiveOptions.outlineColor,
      frontColor: primitiveOptions.frontColor,
      backColor: primitiveOptions.backColor,
      highlightColor: primitiveOptions.highlightColor,
      pixelSize: pixelSize,
      maximumSizeInMeters: maximumSizeInMeters,
    }),
  );
};

/**
 * @private
 */
ClippingPlanesEditor.prototype._computePlaneSize = function (target) {
  if (target instanceof GlobeSurfaceTileProvider) {
    return new Cartesian2(200, 200);
  }

  const halfRadius = target.boundingSphere.radius * 0.5;
  return new Cartesian2(halfRadius, halfRadius);
};

/**
 * @private
 */
ClippingPlanesEditor.prototype._removePlane = function (plane) {
  const primitives = this._primitives;
  for (let i = 0; i < primitives.length; i++) {
    const planePrimitive = primitives.get(i);
    if (planePrimitive.clippingPlane === plane) {
      primitives.remove(planePrimitive);
      break;
    }
  }
};

/**
 * @private
 */
ClippingPlanesEditor.prototype._handleLeftDown = function (movement) {
  const scene = this._scene;
  if (scene.mode !== SceneMode.SCENE3D) {
    return;
  }
  const pickedObject = scene.pick(movement.position);
  if (
    defined(pickedObject) &&
    defined(pickedObject.id) &&
    pickedObject.id.plane instanceof ClippingPlanePrimitive
  ) {
    const pickedPlane = pickedObject.id.plane;
    pickedPlane.highlight(true);

    const clippingPlaneNormal = pickedPlane._normalWC;
    let planeNormal = Cartesian3.cross(
      clippingPlaneNormal,
      scene.camera.directionWC,
      normalScratch,
    );
    planeNormal = Cartesian3.cross(
      clippingPlaneNormal,
      planeNormal,
      planeNormal,
    );
    planeNormal = Cartesian3.normalize(planeNormal, planeNormal);

    this._draggingPlane = Plane.fromPointNormal(
      pickedPlane.centerPosition,
      planeNormal,
      this._draggingPlane,
    );
    scene.screenSpaceCameraController.enableInputs = false;
    this._pickedPlane = pickedPlane;
    if (scene.requestRenderMode) {
      scene.requestRender();
    }
  }
};

/**
 * @private
 */
ClippingPlanesEditor.prototype._handleLeftUp = function () {
  const scene = this._scene;
  if (scene.mode !== SceneMode.SCENE3D) {
    return;
  }
  const pickedPlane = this._pickedPlane;
  if (defined(pickedPlane)) {
    pickedPlane.highlight(false);
    this._pickedPlane = undefined;
    if (scene.requestRenderMode) {
      scene.requestRender();
    }
  }
  scene.screenSpaceCameraController.enableInputs = true;
};

/**
 * @private
 */
ClippingPlanesEditor.prototype._handleMouseMove = function (movement) {
  const scene = this._scene;
  if (scene.mode !== SceneMode.SCENE3D) {
    return;
  }
  const pickedPlane = this._pickedPlane;
  if (defined(pickedPlane)) {
    const draggingPlane = this._draggingPlane;
    let pickRay = scene.camera.getPickRay(movement.startPosition, rayScratch);
    const startDragPos = IntersectionTests.rayPlane(
      pickRay,
      draggingPlane,
      cart3Scratch1,
    );
    if (!defined(startDragPos)) {
      return;
    }

    pickRay = scene.camera.getPickRay(movement.endPosition, rayScratch);
    const endDragPos = IntersectionTests.rayPlane(
      pickRay,
      draggingPlane,
      cart3Scratch2,
    );
    if (!defined(endDragPos)) {
      return;
    }

    let v1 = Cartesian3.subtract(
      startDragPos,
      pickedPlane.centerPosition,
      cart3Scratch1,
    );
    v1 = Cartesian3.projectVector(v1, pickedPlane._normalWC, v1);

    let v2 = Cartesian3.subtract(
      endDragPos,
      pickedPlane.centerPosition,
      cart3Scratch2,
    );
    v2 = Cartesian3.projectVector(v2, pickedPlane._normalWC, v2);

    const v = Cartesian3.subtract(v2, v1, cart3Scratch3);

    const inverseTransform = Matrix4.inverse(
      pickedPlane.transform,
      inverseTransformScratch2,
    );
    const localV = Matrix4.multiplyByPointAsVector(
      inverseTransform,
      v,
      cart3Scratch4,
    );
    Matrix4.multiplyByTranslation(
      pickedPlane.localTransform,
      localV,
      pickedPlane.localTransform,
    );

    if (scene.requestRenderMode) {
      scene.requestRender();
    }
  } else {
    if (defined(this._hoverPlane)) {
      this._hoverPlane.highlight(false);
    }
    const pickedObject = scene.pick(movement.endPosition);
    if (
      defined(pickedObject) &&
      defined(pickedObject.id) &&
      pickedObject.id.plane instanceof ClippingPlanePrimitive
    ) {
      const hoverPlane = pickedObject.id.plane;
      hoverPlane.highlight(true);
      this._hoverPlane = hoverPlane;
    }
  }
};

/**
 * Resets the clipping planes to their start position.
 */
ClippingPlanesEditor.prototype.reset = function () {
  const primitives = this._primitives;
  for (let i = 0; i < primitives.length; i++) {
    primitives.get(i).reset();
  }
};

/**
 * @returns {Boolean} true if the object has been destroyed, false otherwise.
 */
ClippingPlanesEditor.prototype.isDestroyed = function () {
  return false;
};

/**
 * Destroys the clipping planes tool.
 */
ClippingPlanesEditor.prototype.destroy = function () {
  this.deactivate();
  this._sseh.destroy();
  this._scene.primitives.remove(this._primitives);
  this._removeAddEventListener();
  this._removeRemoveEventListener();

  return destroyObject(this);
};
export default ClippingPlanesEditor;
