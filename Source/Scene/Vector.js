import {
  Cartesian3,
  Color,
  DeveloperError,
  buildModuleUrl,
  defined,
  destroyObject,
  Math as CesiumMath,
  Model,
  Frozen,
} from "@cesium/engine";

/**
 * A primitive for visualizing 3D vectors.
 *
 * @alias Vector
 * @ionsdk
 * @constructor
 *
 * @param {Object} [options] An object with the following properties:
 * @param {Boolean} [options.show=true] Determines if the vector will be shown.
 * @param {Cartesian3} [options.position=Cartesian3.ZERO] The position of the origin of the vector in WGS84 coordinates.
 * @param {Cartesian3} [options.direction=Cartesian3.UNIT_Y] The direction of the vector in WGS84 coordinates.  This is assumed to be normalized.
 * @param {Number} [options.length=1.0] The length of the vector in meters.
 * @param {Number} [options.minimumLengthInPixels=0.0] The minimum length of the vector in pixels.
 * @param {Color} [options.color=Color.WHITE] The color of the vector.  The alpha value is ignored; the vector is always opaque.
 * @param {Object} [options.id=undefined] A user-defined object to return when the vector is picked with {@link Scene#pick}.
 * @param {Boolean} [options.allowPicking=true] When <code>true</code>, the vector is pickable with {@link Scene#pick}.
 * @param {Boolean} [options.debugShowBoundingVolume=false] For debugging only. Draws the bounding sphere for each {@link DrawCommand} in the vector.
 * @param {Boolean} [options.debugWireframe=false] For debugging only. Draws the vector in wireframe.
 */
function Vector(options) {
  options = options ?? Frozen.EMPTY_OBJECT;

  /**
   * Determines if the vector will be shown.
   *
   * @type {Boolean}
   * @default true
   */
  this.show = options.show ?? true;

  /**
   * The length of the vector in meters.
   *
   * @type {Number}
   *
   * @default 1.0
   */
  this.length = options.length ?? 1.0;

  /**
   * The minimum length of the vector in pixels.  This can be used so the vector
   * is still visible when the user is zoomed out.
   *
   * @type {Number}
   *
   * @default 0.0
   */
  this.minimumLengthInPixels = options.minimumLengthInPixels ?? 0.0;

  /**
   * The color of the vector.  The alpha value is ignored; the vector is always opaque.
   *
   * @type {Color}
   *
   * @default Color.WHITE
   */
  this.color = Color.clone(options.color ?? Color.WHITE);

  /**
   * User-defined object returned when the vector is picked.
   *
   * @type {Object}
   *
   * @default undefined
   *
   * @see Scene#pick
   */
  this.id = options.id;

  this._allowPicking = options.allowPicking ?? true;

  /**
   * This property is for debugging only; it is not for production use nor is it optimized.
   * <p>
   * Draws the bounding sphere for each {@link DrawCommand} in the primitive.
   * </p>
   *
   * @type {Boolean}
   *
   * @default false
   */
  this.debugShowBoundingVolume = options.debugShowBoundingVolume ?? false;

  /**
   * This property is for debugging only; it is not for production use nor is it optimized.
   * <p>
   * Draws the vector in wireframe.
   * </p>
   *
   * @type {Boolean}
   *
   * @default false
   */
  this.debugWireframe = options.debugWireframe ?? false;

  this._position = Cartesian3.clone(options.position ?? Cartesian3.ZERO);
  this._direction = Cartesian3.clone(options.direction ?? Cartesian3.UNIT_Y);
  this._modelMatrixDirty = true;
  this._model = undefined;

  const pickObject = {
    primitive: this,
  };

  Model.fromGltfAsync({
    url: buildModuleUrl("IonSdkGeometry/Assets/Models/Vector/Vector.glb"),
    enableDebugWireframe: true,
    asynchronous: false,
    pickObject: pickObject,
    allowPicking: this.allowPicking,
  })
    .then((model) => (this._model = model))
    .catch((error) => {
      if (this.isDestroyed()) {
        return;
      }

      console.log(`Error creating vector: ${error}`);
    });
}

Object.defineProperties(Vector.prototype, {
  /**
   * The position of the origin of the vector in WGS84 coordinates.
   *
   * @memberof Vector.prototype
   *
   * @type {Cartesian3}
   *
   * @default Cartesian3.ZERO
   *
   * @exception {DeveloperError} position is required.
   */
  position: {
    get: function () {
      return this._position;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      if (!defined(value)) {
        throw new DeveloperError("position is required.");
      }
      //>>includeEnd('debug');

      Cartesian3.clone(value, this._position);
      this._modelMatrixDirty = true;
    },
  },

  /**
   * The direction of the vector in WGS84 coordinates.  This is assumed to be normalized.
   *
   * @memberof Vector.prototype
   *
   * @type {Cartesian3}
   *
   * @default Cartesian3.UNIT_Y
   *
   * @exception {DeveloperError} direction is required.
   */
  direction: {
    get: function () {
      return this._direction;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      if (!defined(value)) {
        throw new DeveloperError("direction is required.");
      }
      //>>includeEnd('debug');

      Cartesian3.clone(value, this._direction);
      this._modelMatrixDirty = true;
    },
  },

  /**
   * When <code>true</code>, the vector is pickable with {@link Scene#pick}.  When <code>false</code>, GPU memory is saved.
   *
   * @memberof Vector.prototype
   *
   * @type {Boolean}
   * @readonly
   *
   * @default true
   */
  allowPicking: {
    get: function () {
      return this._allowPicking;
    },
  },
});

const scratchX = new Cartesian3();
const scratchY = new Cartesian3();

/**
 * @exception {RuntimeError} Failed to load external reference.
 *
 * @private
 */
Vector.prototype.update = function (frameState) {
  const model = this._model;
  if (!defined(model)) {
    return;
  }

  model.show = this.show;
  model.id = this.id;
  model.scale = this.length;
  model.minimumPixelSize = this.minimumLengthInPixels;
  model.debugShowBoundingVolume = this.debugShowBoundingVolume;
  model.debugWireframe = this.debugWireframe;
  model.color = this.color;

  if (this._modelMatrixDirty) {
    this._modelMatrixDirty = false;

    // Vector model points along Z axis.  Find two other axes to form
    // a local coordinate system.
    const d = this.direction;
    let x;
    let y;

    if (
      CesiumMath.equalsEpsilon(d.x, 0.0, CesiumMath.EPSILON14) &&
      CesiumMath.equalsEpsilon(d.y, 0.0, CesiumMath.EPSILON14)
    ) {
      // Special case when direction is along Z or -Z
      x = Cartesian3.cross(d, Cartesian3.UNIT_Y, scratchX);
      y = Cartesian3.cross(x, d, scratchY);
    } else {
      x = Cartesian3.cross(d, Cartesian3.UNIT_Z, scratchX);
      y = Cartesian3.cross(x, d, scratchY);
    }

    const m = model.modelMatrix;
    m[0] = x.x;
    m[1] = x.y;
    m[2] = x.z;
    m[3] = 0.0;

    m[4] = -y.x;
    m[5] = -y.y;
    m[6] = -y.z;
    m[7] = 0.0;

    m[8] = d.x;
    m[9] = d.y;
    m[10] = d.z;
    m[11] = 0.0;

    const origin = this.position;
    m[12] = origin.x;
    m[13] = origin.y;
    m[14] = origin.z;
    m[15] = 1.0;
  }

  return model.update(frameState);
};

/**
 * Returns true if this object was destroyed; otherwise, false.
 * <br /><br />
 * If this object was destroyed, it should not be used; calling any function other than
 * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
 *
 * @returns {Boolean} <code>true</code> if this object was destroyed; otherwise, <code>false</code>.
 *
 * @see Vector#destroy
 */
Vector.prototype.isDestroyed = function () {
  return false;
};

/**
 * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
 * release of WebGL resources, instead of relying on the garbage collector to destroy this object.
 * <br /><br />
 * Once an object is destroyed, it should not be used; calling any function other than
 * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
 * assign the return value (<code>undefined</code>) to the object as done in the example.
 *
 * @returns {undefined}
 *
 * @exception {DeveloperError} This object was destroyed, i.e., destroy() was called.
 *
 * @example
 * p = p && p.destroy();
 *
 * @see Vector#isDestroyed
 */
Vector.prototype.destroy = function () {
  this._model = this._model && this._model.destroy();
  return destroyObject(this);
};
export default Vector;
