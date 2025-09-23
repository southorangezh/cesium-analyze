import {
  Event,
  createPropertyDescriptor,
  defined,
  DeveloperError,
  Frozen,
} from "@cesium/engine";

/**
 * @typedef {Object} VectorGraphics.ConstructorOptions
 *
 * Initialization options for the VectorGraphics constructor
 *
 * @property {Property|Boolean} [show=true] Determines if the vector will be shown.
 * @property {Property|Cartesian3} [position=Cartesian3.ZERO] The position of the origin of the vector in WGS84 coordinates.
 * @property {Property|Cartesian3} [direction=Cartesian3.UNIT_Y] The direction of the vector in WGS84 coordinates.  This is assumed to be normalized.
 * @property {Property|Number} [length=1.0] The length of the vector in meters.
 * @property {Property|Number} [minimumLengthInPixels=0.0] The minimum length of the vector in pixels.
 * @property {Property|Color} [color=Color.WHITE] The color of the vector.  The alpha value is ignored; the vector is always opaque.
 */

/**
 * An optionally time-dynamic vector.
 * @alias VectorGraphics
 * @ionsdk
 * @constructor
 *
 * @param {VectorGraphics.ConstructorOptions} [options] Object describing initialization options
 *
 */
function VectorGraphics(options) {
  this._color = undefined;
  this._colorSubscription = undefined;
  this._show = undefined;
  this._showSubscription = undefined;
  this._direction = undefined;
  this._directionSubscription = undefined;
  this._length = undefined;
  this._lengthSubscription = undefined;
  this._minimumLengthInPixels = undefined;
  this._minimumLengthInPixelsSubscription = undefined;
  this._definitionChanged = new Event();

  this.merge(options ?? Frozen.EMPTY_OBJECT);
}

Object.defineProperties(VectorGraphics.prototype, {
  /**
   * Gets the event that is raised whenever a new property is assigned.
   * @memberof VectorGraphics.prototype
   *
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },

  /**
   * Gets or sets the {@link Color} {@link Property} specifying the the vector's color.
   * @memberof VectorGraphics.prototype
   * @type {Property|undefined}
   */
  color: createPropertyDescriptor("color"),

  /**
   * Gets or sets the boolean {@link Property} specifying the vector's visibility.
   * @memberof VectorGraphics.prototype
   * @type {Property|undefined}
   */
  show: createPropertyDescriptor("show"),

  /**
   * Gets or sets the {@link Cartesian3} {@link Property} specifying the the vector's direction.
   * @memberof VectorGraphics.prototype
   * @type {Property|undefined}
   */
  direction: createPropertyDescriptor("direction"),

  /**
   * Gets or sets the numeric {@link Property} specifying the the vector's graphical length in meters.
   * @memberof VectorGraphics.prototype
   * @type {Property|undefined}
   */
  length: createPropertyDescriptor("length"),

  /**
   * Gets or sets the numeric {@link Property} specifying the the vector's minimum length in pixel.
   * @memberof VectorGraphics.prototype
   * @type {Property|undefined}
   */
  minimumLengthInPixels: createPropertyDescriptor("minimumLengthInPixels"),
});

/**
 * Duplicates a VectorGraphics instance.
 *
 * @param {VectorGraphics} [result] The object onto which to store the result.
 * @returns {VectorGraphics} The modified result parameter or a new instance if one was not provided.
 */
VectorGraphics.prototype.clone = function (result) {
  if (!defined(result)) {
    result = new VectorGraphics();
  }
  result.color = this.color;
  result.direction = this.direction;
  result.length = this.length;
  result.minimumLengthInPixels = this.minimumLengthInPixels;
  result.show = this.show;
  return result;
};

/**
 * Assigns each unassigned property on this object to the value
 * of the same property on the provided source object.
 *
 * @param {VectorGraphics} source The object to be merged into this object.
 */
VectorGraphics.prototype.merge = function (source) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(source)) {
    throw new DeveloperError("source is required.");
  }
  //>>includeEnd('debug');

  this.color = this.color ?? source.color;
  this.direction = this.direction ?? source.direction;
  this.length = this.length ?? source.length;
  this.minimumLengthInPixels =
    this.minimumLengthInPixels ?? source.minimumLengthInPixels;
  this.show = this.show ?? source.show;
};
export default VectorGraphics;
