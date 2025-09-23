import {
  AssociativeArray,
  Cartesian3,
  Color,
  DeveloperError,
  Property,
  defined,
  destroyObject,
  BoundingSphereState,
} from "@cesium/engine";
import Vector from "../Scene/Vector.js";

const defaultColor = Color.WHITE;
const defaultLength = 1.0;
const defaultMinimumLengthInPixels = 0.0;

let position = new Cartesian3();

/**
 * A {@link Visualizer} which maps {@link Entity#vector} to a {@link Vector}.
 * @alias VectorVisualizer
 * @ionsdk
 * @constructor
 *
 * @param {Scene} scene The scene the primitives will be rendered in.
 * @param {EntityCollection} entityCollection The entityCollection to visualize.
 */
function VectorVisualizer(scene, entityCollection) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(scene)) {
    throw new DeveloperError("scene is required.");
  }
  if (!defined(entityCollection)) {
    throw new DeveloperError("entityCollection is required.");
  }
  //>>includeEnd('debug');

  entityCollection.collectionChanged.addEventListener(
    VectorVisualizer.prototype._onCollectionChanged,
    this,
  );

  this._scene = scene;
  this._primitives = scene.primitives;
  this._entityCollection = entityCollection;
  this._hash = {};
  this._entitiesToVisualize = new AssociativeArray();

  this._onCollectionChanged(entityCollection, entityCollection.values, [], []);
}

/**
 * Updates vectors to match their Entity counterpart at the given time.
 *
 * @param {JulianDate} time The time to update to.
 * @returns {Boolean} This function always returns true.
 */
VectorVisualizer.prototype.update = function (time) {
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
    const vectorGraphics = entity._vector;

    let direction;
    let primitive = hash[entity.id];
    let show =
      entity.isShowing &&
      entity.isAvailable(time) &&
      Property.getValueOrDefault(vectorGraphics._show, time, true);

    if (show) {
      position = Property.getValueOrUndefined(entity._position, time, position);
      direction = Property.getValueOrUndefined(
        vectorGraphics._direction,
        time,
        direction,
      );
      show = defined(position) && defined(direction);
    }

    if (!show) {
      if (defined(primitive)) {
        primitive.show = false;
      }
      continue;
    }

    if (!defined(primitive)) {
      primitive = new Vector({
        color: Color.WHITE,
        id: entity,
      });

      primitive.id = entity;
      primitives.add(primitive);

      hash[entity.id] = primitive;
    }

    primitive.show = true;
    primitive.position = position;
    primitive.direction = Cartesian3.normalize(direction, direction);
    primitive.length = Property.getValueOrDefault(
      vectorGraphics._length,
      time,
      defaultLength,
    );
    primitive.minimumLengthInPixels = Property.getValueOrDefault(
      vectorGraphics._minimumLengthInPixels,
      time,
      defaultMinimumLengthInPixels,
    );
    primitive.color = Property.getValueOrDefault(
      vectorGraphics._color,
      time,
      defaultColor,
    );
  }
  return true;
};

/**
 * Returns true if this object was destroyed; otherwise, false.
 *
 * @returns {Boolean} True if this object was destroyed; otherwise, false.
 */
VectorVisualizer.prototype.isDestroyed = function () {
  return false;
};

/**
 * Removes and destroys all primitives created by this instance.
 */
VectorVisualizer.prototype.destroy = function () {
  this._entityCollection.collectionChanged.removeEventListener(
    VectorVisualizer.prototype._onCollectionChanged,
    this,
  );
  const entities = this._entitiesToVisualize.values;
  const hash = this._hash;
  const primitives = this._primitives;
  for (let i = entities.length - 1; i > -1; i--) {
    removePrimitive(this, entities[i], hash, primitives);
  }
  return destroyObject(this);
};

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
VectorVisualizer.prototype.getBoundingSphere = function (entity, result) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(entity)) {
    throw new DeveloperError("entity is required.");
  }
  if (!defined(result)) {
    throw new DeveloperError("result is required.");
  }
  //>>includeEnd('debug');

  const primitive = this._hash[entity.id];
  if (!defined(primitive)) {
    return BoundingSphereState.FAILED;
  }

  result.center = Cartesian3.clone(primitive.position, result.center);
  result.radius = primitive.length;
  return BoundingSphereState.DONE;
};

/**
 * @private
 */
VectorVisualizer.prototype._onCollectionChanged = function (
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
    if (defined(entity._vector) && defined(entity._position)) {
      entities.set(entity.id, entity);
    }
  }

  for (i = changed.length - 1; i > -1; i--) {
    entity = changed[i];
    if (defined(entity._vector) && defined(entity._position)) {
      entities.set(entity.id, entity);
    } else {
      removePrimitive(this, entity, hash, primitives);
      entities.remove(entity.id);
    }
  }

  for (i = removed.length - 1; i > -1; i--) {
    entity = removed[i];
    removePrimitive(this, entity, hash, primitives);
    entities.remove(entity.id);
  }
};

function removePrimitive(visualizer, entity, hash, primitives) {
  const primitive = hash[entity.id];
  if (defined(primitive)) {
    primitives.remove(primitive);
    if (!primitive.isDestroyed()) {
      primitive.destroy();
    }
    delete hash[entity.id];
  }
}
export default VectorVisualizer;
