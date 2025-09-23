import {
  createPropertyDescriptor,
  createMaterialPropertyDescriptor,
  defined,
  DeveloperError,
  Event,
  Frozen,
} from "@cesium/engine";

/**
 * @typedef {Object} FanGraphics.ConstructorOptions
 *
 * Initialization options for the FanGraphics constructor
 *
 * @property {Property | boolean} [show=true] A boolean Property specifying the visibility of the box.
 * @property {Property | Spherical[]} [directions] The directions, pointing outward from the origin, that defined the fan.
 * @property {Property | Number} [radius] The radius at which to draw the fan.
 * @property {Property | Boolean} [perDirectionRadius=false] When set to true, the magnitude of each direction is used in place of a constant radius.
 * @property {Property | Boolean} [fill=true] A boolean Property specifying whether the cylinder is filled with the provided material.
 * @property {MaterialProperty | Color} [material=Color.WHITE] A Property specifying the material used to fill the cylinder.
 * @property {Property | Boolean} [outline=false] A boolean Property specifying whether the cylinder is outlined.
 * @property {Property | Color} [outlineColor=Color.BLACK] A Property specifying the {@link Color} of the outline.
 * @property {Property | Number} [outlineWidth=1.0] A numeric Property specifying the width of the outline.
 * @property {Property | Number} [numberOfRings] Gets or sets the numberic Property specifying the number of outline rings to draw for the outline, starting from the outer edge and equidistantly spaced towards the center.
 * @property {Property|ShadowMode} [shadows=ShadowMode.DISABLED] Get or sets the enum Property specifying whether the fan casts or receives shadows from each light source.
 * @property {Property|DistanceDisplayCondition} [distanceDisplayCondition] Gets or sets the {@link DistanceDisplayCondition} Property specifying at what distance from the camera that this plane will be displayed.
 */

/**
 * An optionally time-dynamic fan.
 *
 * @alias FanGraphics
 * @ionsdk
 * @constructor
 *
 * @param {FanGraphics.ConstructorOptions} [options] Object describing initialization options
 *
 */
function FanGraphics(options) {
  this._show = undefined;
  this._showSubscription = undefined;
  this._radius = undefined;
  this._radiusSubscription = undefined;
  this._perDirectionRadius = undefined;
  this._perDirectionRadiusSubscription = undefined;
  this._directions = undefined;
  this._directionsSubscription = undefined;
  this._material = undefined;
  this._materialSubscription = undefined;
  this._fill = undefined;
  this._fillSubscription = undefined;
  this._outline = undefined;
  this._outlineSubscription = undefined;
  this._outlineColor = undefined;
  this._outlineColorSubscription = undefined;
  this._outlineWidth = undefined;
  this._outlineWidthSubscription = undefined;
  this._numberOfRings = undefined;
  this._numberOfRingsSubscription = undefined;
  this._shadows = undefined;
  this._shadowsSubscription = undefined;
  this._distanceDisplayCondition = undefined;
  this._distanceDisplayConditionSubscription = undefined;
  this._definitionChanged = new Event();

  this.merge(options ?? Frozen.EMPTY_OBJECT);
}

Object.defineProperties(FanGraphics.prototype, {
  /**
   * Gets the event that is raised whenever a new property is assigned.
   * @memberof FanGraphics.prototype
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
   * Gets or sets the boolean Property specifying the fan's visibility.
   * @memberof FanGraphics.prototype
   * @type {Property|undefined}
   */
  show: createPropertyDescriptor("show"),

  /**
   * Gets or sets the numeric Property specifying the radius of the fan.
   * @memberof FanGraphics.prototype
   * @type {Property|undefined}
   */
  radius: createPropertyDescriptor("radius"),

  /**
   * Gets or sets the boolean Property specifying whether or not to use the magnitude of each direction instead of a constant radius.
   * @memberof FanGraphics.prototype
   * @type {Property|undefined}
   */
  perDirectionRadius: createPropertyDescriptor("perDirectionRadius"),

  /**
   * Gets or sets the {@link Spherical} Property specifying the directions that define the fan.
   * @memberof FanGraphics.prototype
   * @type {Property|undefined}
   */
  directions: createPropertyDescriptor("directions"),

  /**
   * Gets or sets the {@link MaterialProperty} specifying the appearance of the fan.
   * @memberof FanGraphics.prototype
   * @type {MaterialProperty|undefined}
   */
  material: createMaterialPropertyDescriptor("material"),

  /**
   * Gets or sets the Boolean Property specifying whether the fan should be filled.
   * @memberof FanGraphics.prototype
   * @type {Property|undefined}
   */
  fill: createPropertyDescriptor("fill"),

  /**
   * Gets or sets the Boolean Property specifying whether the fan should be outlined.
   * @memberof FanGraphics.prototype
   * @type {Property|undefined}
   */
  outline: createPropertyDescriptor("outline"),

  /**
   * Gets or sets the Color Property specifying whether the color of the outline.
   * @memberof FanGraphics.prototype
   * @type {Property|undefined}
   */
  outlineColor: createPropertyDescriptor("outlineColor"),

  /**
   * Gets or sets the Number Property specifying the width of the outline.
   * @memberof FanGraphics.prototype
   * @type {Property|undefined}
   */
  outlineWidth: createPropertyDescriptor("outlineWidth"),

  /**
   * Gets or sets the numberic Property specifying the number of outline rings to draw for the outline, starting from the outer edge and equidistantly spaced towards the center.
   * @memberof FanGraphics.prototype
   * @type {Property|undefined}
   */
  numberOfRings: createPropertyDescriptor("numberOfRings"),

  /**
   * Get or sets the enum Property specifying whether the fan casts or receives shadows from each light source.
   * @memberof FanGraphics.prototype
   * @type {Property|undefined}
   * @default ShadowMode.DISABLED
   */
  shadows: createPropertyDescriptor("shadows"),

  /**
   * Gets or sets the {@link DistanceDisplayCondition} Property specifying at what distance from the camera that this plane will be displayed.
   * @memberof FanGraphics.prototype
   * @type {Property|undefined}
   */
  distanceDisplayCondition: createPropertyDescriptor(
    "distanceDisplayCondition",
  ),
});

/**
 * Duplicates a FanGraphics instance.
 *
 * @param {FanGraphics} [result] The object onto which to store the result.
 * @returns {FanGraphics} The modified result parameter or a new instance if one was not provided.
 */
FanGraphics.prototype.clone = function (result) {
  if (!defined(result)) {
    result = new FanGraphics();
  }
  result.show = this.show;
  result.radius = this.radius;
  result.perDirectionRadius = this.perDirectionRadius;
  result.directions = this.directions;
  result.material = this.material;
  result.fill = this.fill;
  result.outline = this.outline;
  result.outlineColor = this.outlineColor;
  result.outlineWidth = this.outlineWidth;
  result.numberOfRings = this.numberOfRings;
  result.shadows = this.shadows;
  result.distanceDisplayCondition = this.distanceDisplayCondition;
  return result;
};

/**
 * Assigns each unassigned property on this object to the value
 * of the same property on the provided source object.
 *
 * @param {FanGraphics} source The object to be merged into this object.
 */
FanGraphics.prototype.merge = function (source) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(source)) {
    throw new DeveloperError("source is required.");
  }
  //>>includeEnd('debug');

  this.show = this.show ?? source.show;
  this.radius = this.radius ?? source.radius;
  this.perDirectionRadius =
    this.perDirectionRadius ?? source.perDirectionRadius;
  this.directions = this.directions ?? source.directions;
  this.material = this.material ?? source.material;
  this.fill = this.fill ?? source.fill;
  this.outline = this.outline ?? source.outline;
  this.outlineColor = this.outlineColor ?? source.outlineColor;
  this.outlineWidth = this.outlineWidth ?? source.outlineWidth;
  this.numberOfRings = this.numberOfRings ?? source.numberOfRings;
  this.shadows = this.shadows ?? source.shadows;
  this.distanceDisplayCondition =
    this.distanceDisplayCondition ?? source.distanceDisplayCondition;
};
export default FanGraphics;
