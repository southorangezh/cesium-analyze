import { defined, ManagedArray, PrimitiveCollection } from "@cesium/engine";

function VisibilityState() {
  this.states = new ManagedArray();
  this.count = 0;
}

VisibilityState.prototype.hidePrimitiveCollection = function (
  primitiveCollection,
  isPickableCallback,
) {
  const primitivesLength = primitiveCollection.length;
  const isPickableFunction = isPickableCallback ?? defined;
  for (let i = 0; i < primitivesLength; ++i) {
    const primitive = primitiveCollection.get(i);
    if (primitive instanceof PrimitiveCollection) {
      this.hidePrimitiveCollection(primitive, isPickableFunction);
      continue;
    }

    this.states.push(primitive.show);

    if (isPickableFunction(primitive)) {
      continue;
    }
    primitive.show = false;
  }
};

VisibilityState.prototype.restorePrimitiveCollection = function (
  primitiveCollection,
) {
  const primitivesLength = primitiveCollection.length;
  for (let i = 0; i < primitivesLength; ++i) {
    const primitive = primitiveCollection.get(i);
    if (primitive instanceof PrimitiveCollection) {
      this.restorePrimitiveCollection(primitive);
      continue;
    }

    primitive.show = this.states.get(this.count++);
  }
};

/**
 *
 * @param {Scene} scene The scene
 * @param {Function} [isPickableCallback] The callback to decide if object is pickable.
 *
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
 *   return false;
 * }
 *
 * @ionsdk
 */
VisibilityState.prototype.hide = function (scene, isPickableCallback) {
  this.states.length = 0;

  this.hidePrimitiveCollection(scene.primitives, isPickableCallback);
  this.hidePrimitiveCollection(scene.groundPrimitives, isPickableCallback);
};

VisibilityState.prototype.restore = function (scene) {
  this.count = 0;

  this.restorePrimitiveCollection(scene.primitives);
  this.restorePrimitiveCollection(scene.groundPrimitives);
};
export default VisibilityState;
