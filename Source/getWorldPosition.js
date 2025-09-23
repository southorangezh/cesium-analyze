import { defined, Cartesian3, Check, Ray } from "@cesium/engine";

import VisibilityState from "./VisibilityState.js";

const cartesianScratch = new Cartesian3();
const rayScratch = new Ray();
const visibilityState = new VisibilityState();
/**
 * @callback isPickableCallback
 * @param object Can be a primitive object that gets added to scene such as Cesium3DTileset or Model
 * or it can be the an object that gets returned from scene.pick which will have a primitive member.
 * @return {Boolean} Whether or not the object passes callback's type filtering check.
 */

/**
 * Computes the world position on either the terrain or tileset from a mouse position.
 *
 * @param {Scene} scene The scene
 * @param {Cartesian2} mousePosition The mouse position
 * @param {Function} [isPickableCallback=defined] The callback to decide if object is pickable.
 * @example
 * function isPickableCallback(object) {
 *   if (!defined(object)) {
 *     return false;
 *   }
 *
 *   // object is a primtive
 *   if (object instanceof Cesium3DTileset) {
 *     return true;
 *   }
 *
 *   // object is a picked object
 *   if (defined(object.primitive) &&
 *       object.primitive && instanceof Cesium3DTileFeature) {
 *     return true;
 *   }
 *
 * @param {Cartesian3} [result] The result position
 * @returns {Cartesian3} The position in world space
 * @ionsdk
 * @private
 */
function getWorldPosition(scene, mousePosition, isPickableCallback, result) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("scene", scene);
  Check.defined("mousePosition", mousePosition);
  //>>includeEnd('debug');

  result = defined(result) ? result : new Cartesian3();

  let position;
  if (scene.pickPositionSupported) {
    const isPickableFunction = isPickableCallback ?? defined;

    // Hide every primitive that isn't a tileset
    visibilityState.hide(scene, isPickableFunction);

    // Don't pick default 3x3, or scene.pick may allow a mousePosition that isn't on the tileset to pickPosition.
    const pickedObject = scene.pick(mousePosition, 1, 1);

    visibilityState.restore(scene);

    if (isPickableFunction(pickedObject)) {
      // check to let us know if we should pick against the globe instead
      position = scene.pickPosition(mousePosition, cartesianScratch);

      if (defined(position)) {
        return Cartesian3.clone(position, result);
      }
    }
  }

  if (!defined(scene.globe)) {
    return;
  }

  const ray = scene.camera.getPickRay(mousePosition, rayScratch);
  position = scene.globe.pick(ray, scene, cartesianScratch);

  if (defined(position)) {
    return Cartesian3.clone(position, result);
  }
}

export default getWorldPosition;
