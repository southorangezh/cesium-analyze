import {
  DeveloperError,
  Event,
  defined,
  createMaterialPropertyDescriptor,
  createPropertyDescriptor,
  Frozen,
} from "@cesium/engine";

/**
 * @typedef {Object} RectangularSensorGraphics.ConstructorOptions
 *
 * Initialization options for the RectangularSensorGraphics constructor
 *
 * @property {Property|Boolean} [show=true] Determines if the sensor will be shown.
 * @property {Property|SensorVolumePortionToDisplay} [portionToDisplay=SensorVolumePortionToDisplay.COMPLETE] Indicates what portion of the sensor is shown.
 * @property {Property|Number} [radius=Number.POSITIVE_INFINITY] The distance from the sensor origin to any point on the sensor dome.
 * @property {Property|Number} [xHalfAngle=CesiumMath.PI_OVER_TWO] The half-angle, in radians, of the sensor measured from the positive z-axis (principal direction) along the x-axis.
 * @property {Property|Number} [yHalfAngle=CesiumMath.PI_OVER_TWO] The half-angle, in radians, of the sensor measured from the positive z-axis (principal direction) along the y-axis.
 * @property {MaterialProperty|Color} [lateralSurfaceMaterial=Color.WHITE] The surface appearance of the sensor lateral surface, i.e., the outer sides of the sensor.
 * @property {Property|Boolean} [showLateralSurfaces=true] Determines if the lateral surfaces, i.e., the outer sides of the sensor, are shown.
 * @property {MaterialProperty|Color} [ellipsoidHorizonSurfaceMaterial=Color.WHITE] The surface appearance of the ellipsoid horizon surfaces, i.e., the sides formed from occlusion due to the ellipsoid hoirzon.
 * @property {Property|Boolean} [showEllipsoidHorizonSurfaces=true] Determines if the ellipsoid horizon surfaces, i.e., the sides formed from occlusion due to the ellipsoid hoirzon, are shown.
 * @property {MaterialProperty|Color} [ellipsoidSurfaceMaterial=Color.WHITE] The appearance of the ellipsoid surface where the sensor intersects.
 * @property {Property|Boolean} [showEllipsoidSurfaces=true] Determines if the ellipsoid/sensor intersection surfaces are shown.
 * @property {MaterialProperty|Color} [domeSurfaceMaterial=Color.WHITE] The appearance of the sensor dome surfaces.
 * @property {Property|Boolean} [showDomeSurfaces=true] Determines if the sensor dome surfaces are shown.
 * @property {Property|Boolean} [showIntersection=true] Determines if a polyline is shown where the sensor intersections the ellipsoid.
 * @property {Property|Color} [intersectionColor=Color.WHITE] The color of the polyline where the sensor intersects the ellipsoid.
 * @property {Property|Number} [intersectionWidth=5.0] The approximate pixel width of the polyline where the sensor intersects the ellipsoid.
 * @property {Property|Boolean} [showThroughEllipsoid=false] Determines if a sensor intersecting the ellipsoid is drawn through the ellipsoid and potentially out to the other side.
 * @property {Property|Boolean} [environmentConstraint=false] Determines if the sensor will be occluded by the environment, e.g. terrain or models.
 * @property {Property|Boolean} [showEnvironmentOcclusion=false] Determines if the portion of the sensor occluded by the environment is shown.
 * @property {MaterialProperty|Color} [environmentOcclusionMaterial=Color.WHITE] The appearance of the surface that is occluded by the environment.
 * @property {Property|Boolean} [showEnvironmentIntersection=false] Determines if the line intersecting the sensor and the environment is shown.
 * @property {Property|Color} [environmentIntersectionColor=Color.WHITE] The color of the line intersecting the sensor and the environment.
 * @property {Property|Number} [environmentIntersectionWidth=5.0] The width of the line intersecting the sensor and the environment in meters.
 * @property {Property|Boolean} [showViewshed=false] The visibility of the viewshed.
 * @property {Property|Color} [viewshedVisibleColor=Color.LIME] The color of the scene geometry that is visible to the sensor.
 * @property {Property|Color} [viewshedOccludedColor=Color.RED] The color of the scene geometry that is not visible to the sensor.
 * @property {Property|Number} [viewshedResolution=2048] The resolution in pixels of the viewshed.
 * @property {Property|ClassificationType} [classificationType=ClassificationType.BOTH] Whether this sensor will classify terrain, 3D Tiles, or both.
 */

/**
 * An optionally time-dynamic pyramid.
 *
 * @alias RectangularSensorGraphics
 * @ionsdk
 * @constructor
 *
 * @param {RectangularSensorGraphics.ConstructorOptions} [options] Object describing initialization options
 *
 */
function RectangularSensorGraphics(options) {
  this._xHalfAngle = undefined;
  this._xHalfAngleSubscription = undefined;
  this._yHalfAngle = undefined;
  this._yHalfAngleSubscription = undefined;

  this._lateralSurfaceMaterial = undefined;
  this._lateralSurfaceMaterialSubscription = undefined;
  this._showLateralSurfaces = undefined;
  this._showLateralSurfacesSubscription = undefined;
  this._ellipsoidHorizonSurfaceMaterial = undefined;
  this._ellipsoidHorizonSurfaceMaterialSubscription = undefined;
  this._showEllipsoidHorizonSurfaces = undefined;
  this._showEllipsoidHorizonSurfacesSubscription = undefined;
  this._domeSurfaceMaterial = undefined;
  this._domeSurfaceMaterialSubscription = undefined;
  this._showDomeSurfaces = undefined;
  this._showDomeSurfacesSubscription = undefined;
  this._ellipsoidSurfaceMaterial = undefined;
  this._ellipsoidSurfaceMaterialSubscription = undefined;
  this._showEllipsoidSurfaces = undefined;
  this._showEllipsoidSurfacesSubscription = undefined;

  this._portionToDisplay = undefined;
  this._portionToDisplaySubscription = undefined;
  this._intersectionColor = undefined;
  this._intersectionColorSubscription = undefined;
  this._intersectionWidth = undefined;
  this._intersectionWidthSubscription = undefined;
  this._showIntersection = undefined;
  this._showIntersectionSubscription = undefined;
  this._showThroughEllipsoid = undefined;
  this._showThroughEllipsoidSubscription = undefined;
  this._radius = undefined;
  this._radiusSubscription = undefined;
  this._show = undefined;
  this._showSubscription = undefined;

  this._environmentConstraint = undefined;
  this._environmentConstraintSubscription = undefined;
  this._showEnvironmentOcclusion = undefined;
  this._showEnvironmentOcclusionSubscription = undefined;
  this._environmentOcclusionMaterial = undefined;
  this._environmentOcclusionMaterialSubscription = undefined;
  this._showEnvironmentIntersection = undefined;
  this._showEnvironmentIntersectionSubscription = undefined;
  this._environmentIntersectionColor = undefined;
  this._environmentIntersectionColorSubscription = undefined;
  this._environmentIntersectionWidth = undefined;
  this._environmentIntersectionWidthSubscription = undefined;

  this._showViewshed = undefined;
  this._showViewshedSubscription = undefined;
  this._viewshedVisibleColor = undefined;
  this._viewshedVisibleColorSubscription = undefined;
  this._viewshedOccludedColor = undefined;
  this._viewshedOccludedColorSubscription = undefined;
  this._viewshedResolution = undefined;
  this._viewshedResolutionSubscription = undefined;
  this._classificationType = undefined;
  this._classificationTypeSubscription = undefined;

  this._definitionChanged = new Event();

  this.merge(options ?? Frozen.EMPTY_OBJECT);
}

Object.defineProperties(RectangularSensorGraphics.prototype, {
  /**
   * Gets the event that is raised whenever a new property is assigned.
   * @memberof RectangularSensorGraphics.prototype
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
   * A {@link Property} which returns an array of {@link Spherical} instances representing the pyramid's projection.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  xHalfAngle: createPropertyDescriptor("xHalfAngle"),

  /**
   * A {@link Property} which returns an array of {@link Spherical} instances representing the pyramid's projection.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  yHalfAngle: createPropertyDescriptor("yHalfAngle"),

  /**
   * Gets or sets the {@link MaterialProperty} specifying the the pyramid's appearance.
   * @memberof RectangularSensorGraphics.prototype
   * @type {MaterialProperty}
   */
  lateralSurfaceMaterial: createMaterialPropertyDescriptor(
    "lateralSurfaceMaterial",
  ),

  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the lateral surfaces defining the sensor volume.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  showLateralSurfaces: createPropertyDescriptor("showLateralSurfaces"),

  /**
   * Gets or sets the {@link MaterialProperty} specifying the the sensor's ellipsoid horizon surface appearance.
   * @memberof RectangularSensorGraphics.prototype
   * @type {MaterialProperty}
   */
  ellipsoidHorizonSurfaceMaterial: createMaterialPropertyDescriptor(
    "ellipsoidHorizonSurfaceMaterial",
  ),

  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the ellipsoid horizon surfaces defining the sensor volume.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  showEllipsoidHorizonSurfaces: createPropertyDescriptor(
    "showEllipsoidHorizonSurfaces",
  ),

  /**
   * Gets or sets the {@link MaterialProperty} specifying the the surface appearance of the sensor's dome.
   * @memberof RectangularSensorGraphics.prototype
   * @type {MaterialProperty}
   */
  domeSurfaceMaterial: createMaterialPropertyDescriptor("domeSurfaceMaterial"),

  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the dome surfaces defining the sensor volume.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  showDomeSurfaces: createPropertyDescriptor("showDomeSurfaces"),

  /**
   * Gets or sets the {@link MaterialProperty} specifying the the sensor's ellipsoid surface appearance.
   * @memberof RectangularSensorGraphics.prototype
   * @type {MaterialProperty}
   */
  ellipsoidSurfaceMaterial: createMaterialPropertyDescriptor(
    "ellipsoidSurfaceMaterial",
  ),

  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the ellipsoid surfaces defining the sensor volume.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  showEllipsoidSurfaces: createPropertyDescriptor("showEllipsoidSurfaces"),

  /**
   * Gets or sets the {@link SensorVolumePortionToDisplay} specifying the portion of the sensor to display.
   * @memberof RectangularSensorGraphics.prototype
   * @type {SensorVolumePortionToDisplay}
   */
  portionToDisplay: createPropertyDescriptor("portionToDisplay"),

  /**
   * Gets or sets the {@link Color} {@link Property} specifying the color of the line formed by the intersection of the pyramid and other central bodies.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  intersectionColor: createPropertyDescriptor("intersectionColor"),

  /**
   * Gets or sets the numeric {@link Property} specifying the width of the line formed by the intersection of the pyramid and other central bodies.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  intersectionWidth: createPropertyDescriptor("intersectionWidth"),

  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the line formed by the intersection of the pyramid and other central bodies.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  showIntersection: createPropertyDescriptor("showIntersection"),

  /**
   * Gets or sets the boolean {@link Property} specifying whether a sensor intersecting the ellipsoid is drawn through the ellipsoid and potentially out to the other side.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  showThroughEllipsoid: createPropertyDescriptor("showThroughEllipsoid"),

  /**
   * Gets or sets the numeric {@link Property} specifying the radius of the pyramid's projection.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  radius: createPropertyDescriptor("radius"),

  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the pyramid.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  show: createPropertyDescriptor("show"),

  /**
   * Gets or sets the boolean {@link Property} determining if a sensor will intersect the environment, e.g. terrain or models,
   * and discard the portion of the sensor that is occluded.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  environmentConstraint: createPropertyDescriptor("environmentConstraint"),

  /**
   * Gets or sets the boolean {@link Property} determining if the portion of the sensor occluded by the environment will be
   * drawn with {@link RectangularSensorGraphics#environmentOcclusionMaterial}.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  showEnvironmentOcclusion: createPropertyDescriptor(
    "showEnvironmentOcclusion",
  ),

  /**
   * Gets or sets the {@link MaterialProperty} specifying the surface appearance of the portion of the sensor occluded by the environment.
   * @memberof RectangularSensorGraphics.prototype
   * @type {MaterialProperty}
   */
  environmentOcclusionMaterial: createMaterialPropertyDescriptor(
    "environmentOcclusionMaterial",
  ),

  /**
   * Gets or sets the boolean {@link Property} that determines if a line is shown where the sensor intersects the environment, e.g. terrain or models.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  showEnvironmentIntersection: createPropertyDescriptor(
    "showEnvironmentIntersection",
  ),

  /**
   * Gets or sets the {@link Color} {@link Property} of the line intersecting the environment.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  environmentIntersectionColor: createPropertyDescriptor(
    "environmentIntersectionColor",
  ),

  /**
   * Gets or sets the {@link Property} that approximate width in meters of the line intersecting the environment.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  environmentIntersectionWidth: createPropertyDescriptor(
    "environmentIntersectionWidth",
  ),

  /**
   * Gets or sets the boolean {@link Property} specifying the visibility of the viewshed.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  showViewshed: createPropertyDescriptor("showViewshed"),

  /**
   * Gets or sets the {@link Color} {@link Property} of the scene geometry that is visible to the sensor.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  viewshedVisibleColor: createPropertyDescriptor("viewshedVisibleColor"),

  /**
   * Gets or sets the {@link Color} {@link Property} of the scene geometry that is not visible to the sensor.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  viewshedOccludedColor: createPropertyDescriptor("viewshedOccludedColor"),

  /**
   * Gets or sets the {@link Property} that controls the resolution in pixels of the viewshed.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  viewshedResolution: createPropertyDescriptor("viewshedResolution"),

  /**
   * Gets or sets the {@link ClassificationType} Property specifying whether this sensor will classify terrain, 3D Tiles, or both.
   * @memberof RectangularSensorGraphics.prototype
   * @type {Property|undefined}
   */
  classificationType: createPropertyDescriptor("classificationType"),
});

/**
 * Duplicates a RectangularSensorGraphics instance.
 *
 * @param {RectangularSensorGraphics} [result] The object onto which to store the result.
 * @returns {RectangularSensorGraphics} The modified result parameter or a new instance if one was not provided.
 */
RectangularSensorGraphics.prototype.clone = function (result) {
  if (!defined(result)) {
    result = new RectangularSensorGraphics();
  }
  result.xHalfAngle = this.xHalfAngle;
  result.yHalfAngle = this.yHalfAngle;
  result.radius = this.radius;
  result.show = this.show;
  result.showIntersection = this.showIntersection;
  result.intersectionColor = this.intersectionColor;
  result.intersectionWidth = this.intersectionWidth;
  result.showThroughEllipsoid = this.showThroughEllipsoid;
  result.lateralSurfaceMaterial = this.lateralSurfaceMaterial;
  result.showLateralSurfaces = this.showLateralSurfaces;
  result.ellipsoidHorizonSurfaceMaterial = this.ellipsoidHorizonSurfaceMaterial;
  result.showEllipsoidHorizonSurfaces = this.showEllipsoidHorizonSurfaces;
  result.domeSurfaceMaterial = this.domeSurfaceMaterial;
  result.showDomeSurfaces = this.showDomeSurfaces;
  result.ellipsoidSurfaceMaterial = this.ellipsoidSurfaceMaterial;
  result.showEllipsoidSurfaces = this.showEllipsoidSurfaces;
  result.portionToDisplay = this.portionToDisplay;
  result.environmentConstraint = this.environmentConstraint;
  result.showEnvironmentOcclusion = this.showEnvironmentOcclusion;
  result.environmentOcclusionMaterial = this.environmentOcclusionMaterial;
  result.showEnvironmentIntersection = this.showEnvironmentIntersection;
  result.environmentIntersectionColor = this.environmentIntersectionColor;
  result.environmentIntersectionWidth = this.environmentIntersectionWidth;
  result.showViewshed = this.showViewshed;
  result.viewshedVisibleColor = this.viewshedVisibleColor;
  result.viewshedOccludedColor = this.viewshedOccludedColor;
  result.viewshedResolution = this.viewshedResolution;
  result.classificationType = this.classificationType;
  return result;
};

/**
 * Assigns each unassigned property on this object to the value
 * of the same property on the provided source object.
 *
 * @param {RectangularSensorGraphics} source The object to be merged into this object.
 */
RectangularSensorGraphics.prototype.merge = function (source) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(source)) {
    throw new DeveloperError("source is required.");
  }
  //>>includeEnd('debug');

  this.xHalfAngle = this.xHalfAngle ?? source.xHalfAngle;
  this.yHalfAngle = this.yHalfAngle ?? source.yHalfAngle;
  this.radius = this.radius ?? source.radius;
  this.show = this.show ?? source.show;
  this.showIntersection = this.showIntersection ?? source.showIntersection;
  this.intersectionColor = this.intersectionColor ?? source.intersectionColor;
  this.intersectionWidth = this.intersectionWidth ?? source.intersectionWidth;
  this.showThroughEllipsoid =
    this.showThroughEllipsoid ?? source.showThroughEllipsoid;
  this.lateralSurfaceMaterial =
    this.lateralSurfaceMaterial ?? source.lateralSurfaceMaterial;
  this.showLateralSurfaces =
    this.showLateralSurfaces ?? source.showLateralSurfaces;
  this.ellipsoidHorizonSurfaceMaterial =
    this.ellipsoidHorizonSurfaceMaterial ??
    source.ellipsoidHorizonSurfaceMaterial;
  this.showEllipsoidHorizonSurfaces =
    this.showEllipsoidHorizonSurfaces ?? source.showEllipsoidHorizonSurfaces;
  this.domeSurfaceMaterial =
    this.domeSurfaceMaterial ?? source.domeSurfaceMaterial;
  this.showDomeSurfaces = this.showDomeSurfaces ?? source.showDomeSurfaces;
  this.ellipsoidSurfaceMaterial =
    this.ellipsoidSurfaceMaterial ?? source.ellipsoidSurfaceMaterial;
  this.showEllipsoidSurfaces =
    this.showEllipsoidSurfaces ?? source.showEllipsoidSurfaces;
  this.portionToDisplay = this.portionToDisplay ?? source.portionToDisplay;
  this.environmentConstraint =
    this.environmentConstraint ?? source.environmentConstraint;
  this.showEnvironmentOcclusion =
    this.showEnvironmentOcclusion ?? source.showEnvironmentOcclusion;
  this.environmentOcclusionMaterial =
    this.environmentOcclusionMaterial ?? source.environmentOcclusionMaterial;
  this.showEnvironmentIntersection =
    this.showEnvironmentIntersection ?? source.showEnvironmentIntersection;
  this.environmentIntersectionColor =
    this.environmentIntersectionColor ?? source.environmentIntersectionColor;
  this.environmentIntersectionWidth =
    this.environmentIntersectionWidth ?? source.environmentIntersectionWidth;
  this.showViewshed = this.showViewshed ?? source.showViewshed;
  this.viewshedVisibleColor =
    this.viewshedVisibleColor ?? source.viewshedVisibleColor;
  this.viewshedOccludedColor =
    this.viewshedOccludedColor ?? source.viewshedOccludedColor;
  this.viewshedResolution =
    this.viewshedResolution ?? source.viewshedResolution;
  this.classificationType =
    this.classificationType ?? source.classificationType;
};
export default RectangularSensorGraphics;
