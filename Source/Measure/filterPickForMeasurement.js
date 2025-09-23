import {
  Cesium3DTileFeature,
  Cesium3DTileset,
  Model,
  ModelFeature,
  defined,
} from "@cesium/engine";

function isPrimitivePickable(primitive) {
  return (
    defined(primitive) &&
    (primitive instanceof Cesium3DTileset || primitive instanceof Model)
  );
}

/**
 * Filters for certain types when taking measurements using mouse picking.
 *
 * @param object Can be a primitive object that gets added to scene such as Cesium3DTileset or Model
 * or it can be the an object that gets returned from scene.pick which will have a primitive member.
 * @return {Boolean} Whether or not the object passes callback's type filtering check.
 */
export function filterPickForMeasurement(object) {
  // Passing a primtive directly
  if (isPrimitivePickable(object)) {
    return true;
  }

  // Passing a pick result
  const objectPickable =
    defined(object) &&
    (object instanceof Cesium3DTileFeature || object instanceof ModelFeature);

  if (objectPickable) {
    return true;
  }

  // Is the pickedObject's primitive pickable
  const primitivePickable =
    defined(object) && isPrimitivePickable(object.primitive);

  return primitivePickable;
}

export default filterPickForMeasurement;
