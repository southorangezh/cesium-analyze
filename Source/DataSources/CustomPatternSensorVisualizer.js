import {
  AssociativeArray,
  Cartesian3,
  Cartesian4,
  ClassificationType,
  Color,
  DeveloperError,
  MaterialProperty,
  Matrix4,
  Property,
  defined,
  destroyObject,
  BoundingSphereState,
  SensorVolumePortionToDisplay,
} from "@cesium/engine";
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

/**
 * A {@link Visualizer} which maps {@link Entity#customPatternSensor} to a {@link CustomPatternSensor}.
 * @alias CustomPatternSensorVisualizer
 * @ionsdk
 * @constructor
 *
 * @param {Scene} scene The scene the primitives will be rendered in.
 * @param {EntityCollection} entityCollection The entityCollection to visualize.
 */
function CustomPatternSensorVisualizer(scene, entityCollection) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(scene)) {
    throw new DeveloperError("scene is required.");
  }
  if (!defined(entityCollection)) {
    throw new DeveloperError("entityCollection is required.");
  }
  //>>includeEnd('debug');

  entityCollection.collectionChanged.addEventListener(
    CustomPatternSensorVisualizer.prototype._onCollectionChanged,
    this,
  );

  this._scene = scene;
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
CustomPatternSensorVisualizer.prototype.update = function (time) {
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
    const customPatternSensorGraphics = entity._customPatternSensor;

    let directions;
    let primitive = hash[entity.id];
    let show =
      entity.isShowing &&
      entity.isAvailable(time) &&
      Property.getValueOrDefault(customPatternSensorGraphics._show, time, true);

    let modelMatrix;
    if (show) {
      modelMatrix = entity.computeModelMatrix(time, this._modelMatrixScratch);
      directions = Property.getValueOrUndefined(
        customPatternSensorGraphics._directions,
        time,
      );
      show = defined(modelMatrix) && defined(directions);
    }

    if (!show) {
      //don't bother creating or updating anything else
      if (defined(primitive)) {
        primitive.show = false;
      }
      continue;
    }

    if (!defined(primitive)) {
      primitive = new CustomPatternSensor();
      primitive.id = entity;
      primitives.add(primitive);
      primitive.directions = directions;
      hash[entity.id] = primitive;
    } else if (!Property.isConstant(customPatternSensorGraphics._directions)) {
      primitive.directions = directions;
    }

    primitive.show = true;
    primitive.radius = Property.getValueOrDefault(
      customPatternSensorGraphics._radius,
      time,
      defaultRadius,
    );
    primitive.showLateralSurfaces = Property.getValueOrDefault(
      customPatternSensorGraphics._showLateralSurfaces,
      time,
      defaultShowLateralSurfaces,
    );
    primitive.lateralSurfaceMaterial = MaterialProperty.getValue(
      time,
      customPatternSensorGraphics._lateralSurfaceMaterial,
      primitive.lateralSurfaceMaterial,
    );
    primitive.showEllipsoidHorizonSurfaces = Property.getValueOrDefault(
      customPatternSensorGraphics._showEllipsoidHorizonSurfaces,
      time,
      defaultShowEllipsoidHorizonSurfaces,
    );
    primitive.ellipsoidHorizonSurfaceMaterial = MaterialProperty.getValue(
      time,
      customPatternSensorGraphics._ellipsoidHorizonSurfaceMaterial,
      primitive.ellipsoidHorizonSurfaceMaterial,
    );
    primitive.showDomeSurfaces = Property.getValueOrDefault(
      customPatternSensorGraphics._showDomeSurfaces,
      time,
      defaultShowDomeSurfaces,
    );
    primitive.domeSurfaceMaterial = MaterialProperty.getValue(
      time,
      customPatternSensorGraphics._domeSurfaceMaterial,
      primitive.domeSurfaceMaterial,
    );
    primitive.showEllipsoidSurfaces = Property.getValueOrDefault(
      customPatternSensorGraphics._showEllipsoidSurfaces,
      time,
      defaultShowEllipsoidSurfaces,
    );
    primitive.ellipsoidSurfaceMaterial = MaterialProperty.getValue(
      time,
      customPatternSensorGraphics._ellipsoidSurfaceMaterial,
      primitive.ellipsoidSurfaceMaterial,
    );
    primitive.showIntersection = Property.getValueOrDefault(
      customPatternSensorGraphics._showIntersection,
      time,
      defaultShowIntersection,
    );
    primitive.intersectionColor = Property.getValueOrClonedDefault(
      customPatternSensorGraphics._intersectionColor,
      time,
      defaultIntersectionColor,
      primitive.intersectionColor,
    );
    primitive.intersectionWidth = Property.getValueOrDefault(
      customPatternSensorGraphics._intersectionWidth,
      time,
      defaultIntersectionWidth,
    );
    primitive.showThroughEllipsoid = Property.getValueOrDefault(
      customPatternSensorGraphics._showThroughEllipsoid,
      time,
      defaultShowThroughEllipsoid,
    );
    primitive.portionToDisplay = Property.getValueOrDefault(
      customPatternSensorGraphics._portionToDisplay,
      time,
      defaultSensorVolumePortionToDisplay,
    );
    primitive.environmentConstraint = Property.getValueOrDefault(
      customPatternSensorGraphics._environmentConstraint,
      time,
      defaultEnvironmentConstraint,
    );
    primitive.showEnvironmentOcclusion = Property.getValueOrDefault(
      customPatternSensorGraphics._showEnvironmentOcclusion,
      time,
      defaultShowEnvironmentOcclusion,
    );
    primitive.environmentOcclusionMaterial = MaterialProperty.getValue(
      time,
      customPatternSensorGraphics._environmentOcclusionMaterial,
      primitive.environmentOcclusionMaterial,
    );
    primitive.showEnvironmentIntersection = Property.getValueOrDefault(
      customPatternSensorGraphics._showEnvironmentIntersection,
      time,
      defaultShowEnvironmentIntersection,
    );
    primitive.environmentIntersectionColor = Property.getValueOrDefault(
      customPatternSensorGraphics._environmentIntersectionColor,
      time,
      defaultEnvironmentIntersectionColor,
    );
    primitive.environmentIntersectionWidth = Property.getValueOrDefault(
      customPatternSensorGraphics._environmentIntersectionWidth,
      time,
      defaultEnvironmentIntersectionWidth,
    );
    primitive.showViewshed = Property.getValueOrDefault(
      customPatternSensorGraphics._showViewshed,
      time,
      defaultShowViewshed,
    );
    primitive.viewshedVisibleColor = Property.getValueOrDefault(
      customPatternSensorGraphics._viewshedVisibleColor,
      time,
      defaultViewshedVisibleColor,
    );
    primitive.viewshedOccludedColor = Property.getValueOrDefault(
      customPatternSensorGraphics._viewshedOccludedColor,
      time,
      defaultViewshedOccludedColor,
    );
    primitive.viewshedResolution = Property.getValueOrDefault(
      customPatternSensorGraphics._viewshedResolution,
      time,
      defaultViewshedResolution,
    );
    primitive.classificationType = Property.getValueOrDefault(
      customPatternSensorGraphics._classificationType,
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
CustomPatternSensorVisualizer.prototype.isDestroyed = function () {
  return false;
};

/**
 * Removes and destroys all primitives created by this instance.
 */
CustomPatternSensorVisualizer.prototype.destroy = function () {
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
CustomPatternSensorVisualizer.prototype.getBoundingSphere = function (
  entity,
  result,
) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(entity)) {
    throw new DeveloperError("entity is required.");
  }
  if (!defined(result)) {
    throw new DeveloperError("result is required.");
  }
  //>>includeEnd('debug');

  const sensor = this._hash[entity.id];
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
CustomPatternSensorVisualizer.prototype._onCollectionChanged = function (
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
    if (
      defined(entity._customPatternSensor) &&
      defined(entity._position) &&
      defined(entity._orientation)
    ) {
      entities.set(entity.id, entity);
    }
  }

  for (i = changed.length - 1; i > -1; i--) {
    entity = changed[i];
    if (
      defined(entity._customPatternSensor) &&
      defined(entity._position) &&
      defined(entity._orientation)
    ) {
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
  const primitive = hash[id];
  if (defined(primitive)) {
    primitives.removeAndDestroy(primitive);
    delete hash[id];
  }
}
export default CustomPatternSensorVisualizer;
