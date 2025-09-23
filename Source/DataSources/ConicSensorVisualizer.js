import {
  ClassificationType,
  Color,
  Spherical,
  defined,
  Math as CesiumMath,
  Cartesian3,
  DeveloperError,
  AssociativeArray,
  Matrix4,
  Property,
  MaterialProperty,
  Cartesian4,
  destroyObject,
  BoundingSphereState,
  SensorVolumePortionToDisplay,
} from "@cesium/engine";
import ConicSensor from "../Scene/ConicSensor.js";
import CustomPatternSensor from "../Scene/CustomPatternSensor.js";

const defaultShowIntersection = true;
const defaultIntersectionColor = Color.WHITE;
const defaultIntersectionWidth = 1.0;
const defaultShowThroughEllipsoid = false;
const defaultRadius = Number.POSITIVE_INFINITY;
const defaultSensorVolumePortionToDisplay =
  SensorVolumePortionToDisplay.COMPLETE;
const defaultShowDomeSurfaces = true;
const defaultShowEllipsoidHorizonSurfaces = true;
const defaultShowEllipsoidSurfaces = true;
const defaultShowLateralSurfaces = true;
const defaultEnvironmentConstraint = false;
const defaultShowEnvironmentOcclusion = false;
const defaultShowEnvironmentIntersection = false;
const defaultEnvironmentIntersectionColor = Color.WHITE;
const defaultEnvironmentIntersectionWidth = 5.0;
const defaultShowViewshed = false;
const defaultViewshedVisibleColor = Color.LIME.withAlpha(0.5);
const defaultViewshedOccludedColor = Color.RED.withAlpha(0.5);
const defaultViewshedResolution = 2048;
const defaultClassificationType = ClassificationType.BOTH;

//Below two functions only used when falling back to custom sensor.
function assignSpherical(index, array, clock, cone) {
  let spherical = array[index];
  if (!defined(spherical)) {
    array[index] = spherical = new Spherical();
  }
  spherical.clock = clock;
  spherical.cone = cone;
  spherical.magnitude = 1.0;
}

function setDirectionsAndBoundingCone(
  cone,
  minimumClockAngle,
  maximumClockAngle,
  innerHalfAngle,
  outerHalfAngle,
) {
  const sphericalPolygon = cone._sphericalPolygon;
  const vertices = sphericalPolygon.vertices;

  // Update the array of vertices.
  let n = innerHalfAngle === 0.0 ? 180 : 90; // number of divisions of a full circle.
  let angleStep = CesiumMath.TWO_PI / n;
  let angle;
  let i = 0;

  if (minimumClockAngle === 0.0 && maximumClockAngle === CesiumMath.TWO_PI) {
    if (outerHalfAngle === CesiumMath.PI_OVER_TWO) {
      n = 8; // number of divisions of a full circle.
      angleStep = CesiumMath.TWO_PI / n;
    }
    // No clock angle limits, so this is just a circle.
    // There might be a hole but we're ignoring it for now.
    angle = 0.0;
    // Define the convex hull for the custom sensor to improve performance.
    const convexHull = sphericalPolygon._convexHull;
    for (i = 0; i < n; ++i) {
      convexHull.push(i);
      assignSpherical(i, vertices, angle, outerHalfAngle);
      angle += angleStep;
    }
  } else {
    // There are clock angle limits.
    for (
      angle = minimumClockAngle;
      angle < maximumClockAngle;
      angle += angleStep
    ) {
      assignSpherical(i++, vertices, angle, outerHalfAngle);
    }
    assignSpherical(i++, vertices, maximumClockAngle, outerHalfAngle);
    if (innerHalfAngle === 0.0) {
      assignSpherical(i++, vertices, maximumClockAngle, 0.0);
    } else {
      for (
        angle = maximumClockAngle;
        angle > minimumClockAngle;
        angle -= angleStep
      ) {
        assignSpherical(i++, vertices, angle, innerHalfAngle);
      }
      assignSpherical(i++, vertices, minimumClockAngle, innerHalfAngle);
    }
  }
  vertices.length = i;

  // Assign the array so that initialization is performed.
  cone.directions = vertices;

  // Define the bounding cone for the custom sensor directly to improve performance.
  sphericalPolygon._referenceAxis = new Cartesian3();
  sphericalPolygon._referenceAxis = Cartesian3.clone(
    Cartesian3.UNIT_Z,
    sphericalPolygon._referenceAxis,
  );
  sphericalPolygon._referenceDistance = Math.cos(outerHalfAngle);
}

/**
 * A {@link Visualizer} which maps {@link Entity#conicSensor} to a {@link ConicSensor} or {@link CustomPatternSensor}.
 * @alias ConicSensorVisualizer
 * @ionsdk
 * @constructor
 *
 * @param {Scene} scene The scene the primitives will be rendered in.
 * @param {EntityCollection} entityCollection The entityCollection to visualize.
 */
function ConicSensorVisualizer(scene, entityCollection) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(scene)) {
    throw new DeveloperError("scene is required.");
  }
  if (!defined(entityCollection)) {
    throw new DeveloperError("entityCollection is required.");
  }
  //>>includeEnd('debug');

  entityCollection.collectionChanged.addEventListener(
    ConicSensorVisualizer.prototype._onCollectionChanged,
    this,
  );

  this._scene = scene;
  this._hasFragmentDepth = scene._context.fragmentDepth;
  this._primitives = scene.primitives;
  this._entityCollection = entityCollection;
  this._hash = {};
  this._entitiesToVisualize = new AssociativeArray();
  this._modelMatrixScratch = new Matrix4();

  this._onCollectionChanged(entityCollection, entityCollection.values, [], []);
}

/**
 * Updates the primitives created by this visualizer to match their
 * Entity counterpart at the given time.
 *
 * @param {JulianDate} time The time to update to.
 * @returns {Boolean} This function always returns true.
 */
ConicSensorVisualizer.prototype.update = function (time) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(time)) {
    throw new DeveloperError("time is required.");
  }
  //>>includeEnd('debug');

  const entities = this._entitiesToVisualize.values;
  const hash = this._hash;
  const primitives = this._primitives;

  for (let i = 0, len = entities.length; i < len; i++) {
    const entity = entities[i];
    const conicSensorGraphics = entity._conicSensor;

    let data = hash[entity.id];
    let show =
      entity.isShowing &&
      entity.isAvailable(time) &&
      Property.getValueOrDefault(conicSensorGraphics._show, time, true);

    let modelMatrix;
    if (show) {
      modelMatrix = entity.computeModelMatrix(time, this._modelMatrixScratch);
      show = defined(modelMatrix);
    }

    if (!show) {
      //don't bother creating or updating anything else
      if (defined(data)) {
        data.primitive.show = false;
      }
      continue;
    }

    let primitive = defined(data) ? data.primitive : undefined;
    if (!defined(primitive)) {
      primitive = this._hasFragmentDepth
        ? new ConicSensor()
        : new CustomPatternSensor();
      primitive.id = entity;
      primitives.add(primitive);

      data = {
        primitive: primitive,
        minimumClockAngle: undefined,
        maximumClockAngle: undefined,
        innerHalfAngle: undefined,
        outerHalfAngle: undefined,
      };
      hash[entity.id] = data;
    }

    const minimumClockAngle = Property.getValueOrDefault(
      conicSensorGraphics._minimumClockAngle,
      time,
      0,
    );
    const maximumClockAngle = Property.getValueOrDefault(
      conicSensorGraphics._maximumClockAngle,
      time,
      CesiumMath.TWO_PI,
    );
    const innerHalfAngle = Property.getValueOrDefault(
      conicSensorGraphics._innerHalfAngle,
      time,
      0,
    );
    const outerHalfAngle = Property.getValueOrDefault(
      conicSensorGraphics._outerHalfAngle,
      time,
      Math.PI,
    );

    if (this._hasFragmentDepth) {
      primitive.minimumClockAngle = minimumClockAngle;
      primitive.maximumClockAngle = maximumClockAngle;
      primitive.innerHalfAngle = innerHalfAngle;
      primitive.outerHalfAngle = outerHalfAngle;
    } else if (
      data.minimumClockAngle !== minimumClockAngle || //
      data.maximumClockAngle !== maximumClockAngle || //
      data.innerHalfAngle !== innerHalfAngle || //
      data.outerHalfAngle !== outerHalfAngle
    ) {
      setDirectionsAndBoundingCone(
        primitive,
        minimumClockAngle,
        maximumClockAngle,
        innerHalfAngle,
        outerHalfAngle,
      );
      data.minimumClockAngle = minimumClockAngle;
      data.maximumClockAngle = maximumClockAngle;
      data.innerHalfAngle = innerHalfAngle;
      data.outerHalfAngle = outerHalfAngle;
    }

    primitive.show = true;
    primitive.radius = Property.getValueOrDefault(
      conicSensorGraphics._radius,
      time,
      defaultRadius,
    );
    primitive.showLateralSurfaces = Property.getValueOrDefault(
      conicSensorGraphics._showLateralSurfaces,
      time,
      defaultShowLateralSurfaces,
    );
    primitive.lateralSurfaceMaterial = MaterialProperty.getValue(
      time,
      conicSensorGraphics._lateralSurfaceMaterial,
      primitive.lateralSurfaceMaterial,
    );
    primitive.showEllipsoidHorizonSurfaces = Property.getValueOrDefault(
      conicSensorGraphics._showEllipsoidHorizonSurfaces,
      time,
      defaultShowEllipsoidHorizonSurfaces,
    );
    primitive.ellipsoidHorizonSurfaceMaterial = MaterialProperty.getValue(
      time,
      conicSensorGraphics._ellipsoidHorizonSurfaceMaterial,
      primitive.ellipsoidHorizonSurfaceMaterial,
    );
    primitive.showDomeSurfaces = Property.getValueOrDefault(
      conicSensorGraphics._showDomeSurfaces,
      time,
      defaultShowDomeSurfaces,
    );
    primitive.domeSurfaceMaterial = MaterialProperty.getValue(
      time,
      conicSensorGraphics._domeSurfaceMaterial,
      primitive.domeSurfaceMaterial,
    );
    primitive.showEllipsoidSurfaces = Property.getValueOrDefault(
      conicSensorGraphics._showEllipsoidSurfaces,
      time,
      defaultShowEllipsoidSurfaces,
    );
    primitive.ellipsoidSurfaceMaterial = MaterialProperty.getValue(
      time,
      conicSensorGraphics._ellipsoidSurfaceMaterial,
      primitive.ellipsoidSurfaceMaterial,
    );
    primitive.showIntersection = Property.getValueOrDefault(
      conicSensorGraphics._showIntersection,
      time,
      defaultShowIntersection,
    );
    primitive.intersectionColor = Property.getValueOrClonedDefault(
      conicSensorGraphics._intersectionColor,
      time,
      defaultIntersectionColor,
      primitive.intersectionColor,
    );
    primitive.intersectionWidth = Property.getValueOrDefault(
      conicSensorGraphics._intersectionWidth,
      time,
      defaultIntersectionWidth,
    );
    primitive.showThroughEllipsoid = Property.getValueOrDefault(
      conicSensorGraphics._showThroughEllipsoid,
      time,
      defaultShowThroughEllipsoid,
    );
    primitive.portionToDisplay = Property.getValueOrDefault(
      conicSensorGraphics._portionToDisplay,
      time,
      defaultSensorVolumePortionToDisplay,
    );
    primitive.environmentConstraint = Property.getValueOrDefault(
      conicSensorGraphics._environmentConstraint,
      time,
      defaultEnvironmentConstraint,
    );
    primitive.showEnvironmentOcclusion = Property.getValueOrDefault(
      conicSensorGraphics._showEnvironmentOcclusion,
      time,
      defaultShowEnvironmentOcclusion,
    );
    primitive.environmentOcclusionMaterial = MaterialProperty.getValue(
      time,
      conicSensorGraphics._environmentOcclusionMaterial,
      primitive.environmentOcclusionMaterial,
    );
    primitive.showEnvironmentIntersection = Property.getValueOrDefault(
      conicSensorGraphics._showEnvironmentIntersection,
      time,
      defaultShowEnvironmentIntersection,
    );
    primitive.environmentIntersectionColor = Property.getValueOrDefault(
      conicSensorGraphics._environmentIntersectionColor,
      time,
      defaultEnvironmentIntersectionColor,
    );
    primitive.environmentIntersectionWidth = Property.getValueOrDefault(
      conicSensorGraphics._environmentIntersectionWidth,
      time,
      defaultEnvironmentIntersectionWidth,
    );
    primitive.showViewshed = Property.getValueOrDefault(
      conicSensorGraphics._showViewshed,
      time,
      defaultShowViewshed,
    );
    primitive.viewshedVisibleColor = Property.getValueOrDefault(
      conicSensorGraphics._viewshedVisibleColor,
      time,
      defaultViewshedVisibleColor,
    );
    primitive.viewshedOccludedColor = Property.getValueOrDefault(
      conicSensorGraphics._viewshedOccludedColor,
      time,
      defaultViewshedOccludedColor,
    );
    primitive.viewshedResolution = Property.getValueOrDefault(
      conicSensorGraphics._viewshedResolution,
      time,
      defaultViewshedResolution,
    );
    primitive.classificationType = Property.getValueOrDefault(
      conicSensorGraphics._classificationType,
      time,
      defaultClassificationType,
    );
    primitive.modelMatrix = Matrix4.clone(modelMatrix, primitive.modelMatrix);
  }
  return true;
};

/**
 * Returns true if this object was destroyed; otherwise, false.
 *
 * @returns {Boolean} True if this object was destroyed; otherwise, false.
 */
ConicSensorVisualizer.prototype.isDestroyed = function () {
  return false;
};

/**
 * Removes and destroys all primitives created by this instance.
 */
ConicSensorVisualizer.prototype.destroy = function () {
  const entities = this._entitiesToVisualize.values;
  const hash = this._hash;
  const primitives = this._primitives;
  for (let i = entities.length - 1; i > -1; i--) {
    removePrimitive(entities[i], hash, primitives);
  }
  return destroyObject(this);
};

const scratchCartesian4 = new Cartesian4();

/**
 * Computes a bounding sphere which encloses the visualization produced for the specified entity.
 * The bounding sphere is in the fixed frame of the scene's globe.
 *
 * @param {Entity} entity The entity whose bounding sphere to compute.
 * @param {BoundingSphere} result The bounding sphere onto which to store the result.
 * @returns {BoundingSphereState} BoundingSphereState.DONE if the result contains the bounding sphere,
 *                       BoundingSphereState.PENDING if the result is still being computed, or
 *                       BoundingSphereState.FAILED if the entity has no visualization in the current scene.
 * @private
 */
ConicSensorVisualizer.prototype.getBoundingSphere = function (entity, result) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(entity)) {
    throw new DeveloperError("entity is required.");
  }
  if (!defined(result)) {
    throw new DeveloperError("result is required.");
  }
  //>>includeEnd('debug');

  const sensorData = this._hash[entity.id];
  if (!defined(sensorData)) {
    return BoundingSphereState.FAILED;
  }

  const sensor = sensorData.primitive;
  if (!defined(sensor)) {
    return BoundingSphereState.FAILED;
  }

  Matrix4.getColumn(sensor.modelMatrix, 3, scratchCartesian4);
  Cartesian3.fromCartesian4(scratchCartesian4, result.center);

  result.radius = isFinite(sensor.radius) ? sensor.radius : 1000.0;

  return BoundingSphereState.DONE;
};

/**
 * @private
 */
ConicSensorVisualizer.prototype._onCollectionChanged = function (
  entityCollection,
  added,
  removed,
  changed,
) {
  let i;
  let entity;
  const entities = this._entitiesToVisualize;
  const hash = this._hash;
  const primitives = this._primitives;

  for (i = added.length - 1; i > -1; i--) {
    entity = added[i];
    if (defined(entity._conicSensor) && defined(entity._position)) {
      entities.set(entity.id, entity);
    }
  }

  for (i = changed.length - 1; i > -1; i--) {
    entity = changed[i];
    if (defined(entity._conicSensor) && defined(entity._position)) {
      entities.set(entity.id, entity);
    } else {
      removePrimitive(entity, hash, primitives);
      entities.remove(entity.id);
    }
  }

  for (i = removed.length - 1; i > -1; i--) {
    entity = removed[i];
    removePrimitive(entity, hash, primitives);
    entities.remove(entity.id);
  }
};

function removePrimitive(entity, hash, primitives) {
  const id = entity.id;
  const data = hash[id];
  if (defined(data)) {
    primitives.removeAndDestroy(data.primitive);
    delete hash[id];
  }
}
export default ConicSensorVisualizer;
