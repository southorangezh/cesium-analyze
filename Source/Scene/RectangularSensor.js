import {
  Matrix4,
  Math as CesiumMath,
  Material,
  defined,
  Color,
  ClassificationType,
  DeveloperError,
  destroyObject,
  clone,
  SensorVolumePortionToDisplay,
  Frozen,
} from "@cesium/engine";
import CustomPatternSensor from "./CustomPatternSensor.js";

/**
 * Visualizes a rectangular pyramid sensor volume taking into account occlusion of an ellipsoid, i.e., the globe.  A
 * rectangular sensor may represent what is visible to a camera attached to a satellite or aircraft.  The sensor's
 * shape is defined by two half angles ({@link RectangularSensor#xHalfAngle} and
 * {@link RectangularSensor#yHalfAngle}) and a radius ({@link RectangularSensor#radius}).
 * The shape also depends on if the sensor intersects the ellipsoid, as shown in examples 2 and 3 below, and what
 * surfaces are shown using properties such as {@link RectangularSensor#showDomeSurfaces}.
 *
 * <div align='center'>
 * <table border='0' cellpadding='5'><tr>
 * <td align='center'>Code Example 1 below<br/><img src='Images/RectangularSensor.example1.png' width='250' height='188' /></td>
 * <td align='center'>Code Example 2 below<br/><img src='Images/RectangularSensor.example2.png' width='250' height='188' /></td>
 * <td align='center'>Code Example 3 below<br/><img src='Images/RectangularSensor.example3.png' width='250' height='188' /></td>
 * </tr></table>
 * </div>
 *
 * <p>
 * A sensor points along the local positive z-axis and is positioned and oriented using
 * {@link RectangularSensor#modelMatrix}.
 * </p>
 * <p>
 * <div align='center'>
 * <img src='Images/RectangularSensor.modelMatrix.png' /><br />
 * </div>
 * </p>
 *
 * @alias RectangularSensor
 * @ionsdk
 * @constructor
 *
 * @param {Object} [options] Object with the following properties:
 * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid that the sensor potentially intersects.
 * @param {Boolean} [options.show=true] Determines if the sensor will be shown.
 * @param {SensorVolumePortionToDisplay} [options.portionToDisplay=SensorVolumePortionToDisplay.COMPLETE] Indicates what portion of the sensor is shown.
 * @param {Matrix4} [options.modelMatrix=Matrix4.IDENTITY] The 4x4 transformation matrix that transforms the sensor from model to world coordinates.
 * @param {Number} [options.radius=Number.POSITIVE_INFINITY] The distance from the sensor origin to any point on the sensor dome.
 * @param {Number} [options.xHalfAngle=CesiumMath.PI_OVER_TWO] The half-angle, in radians, of the sensor measured from the positive z-axis (principal direction) along the x-axis.
 * @param {Number} [options.yHalfAngle=CesiumMath.PI_OVER_TWO] The half-angle, in radians, of the sensor measured from the positive z-axis (principal direction) along the y-axis.
 * @param {Material} [options.lateralSurfaceMaterial=Material.ColorType] The surface appearance of the sensor lateral surface, i.e., the outer sides of the sensor.
 * @param {Boolean} [options.showLateralSurfaces=true] Determines if the lateral surfaces, i.e., the outer sides of the sensor, are shown.
 * @param {Material} [options.ellipsoidHorizonSurfaceMaterial=Material.ColorType] The surface appearance of the ellipsoid horizon surfaces, i.e., the sides formed from occlusion due to the ellipsoid horizon.
 * @param {Boolean} [options.showEllipsoidHorizonSurfaces=true] Determines if the ellipsoid horizon surfaces, i.e., the sides formed from occlusion due to the ellipsoid horizon, are shown.
 * @param {Material} [options.ellipsoidSurfaceMaterial=Material.ColorType] The appearance of the ellipsoid surface where the sensor intersects.
 * @param {Boolean} [options.showEllipsoidSurfaces=true] Determines if the ellipsoid/sensor intersection surfaces are shown.
 * @param {Material} [options.domeSurfaceMaterial=Material.ColorType] The appearance of the sensor dome surfaces.
 * @param {Boolean} [options.showDomeSurfaces=true] Determines if the sensor dome surfaces are shown.
 * @param {Boolean} [options.showIntersection=true] Determines if a polyline is shown where the sensor intersects the ellipsoid.
 * @param {Color} [options.intersectionColor=Color.WHITE] The color of the polyline where the sensor intersects the ellipsoid.
 * @param {Number} [options.intersectionWidth=5.0] The approximate pixel width of the polyline where the sensor intersects the ellipsoid.
 * @param {Boolean} [options.showThroughEllipsoid=false] Determines if a sensor intersecting the ellipsoid is drawn through the ellipsoid and potentially out to the other side.
 * @param {Boolean} [options.environmentConstraint=false] Determines if the sensor will be occluded by objects in the current view of the environment, e.g. visible terrain or models.
 * @param {Boolean} [options.showEnvironmentOcclusion=false] Determines if the portion of the sensor occluded by the environment is shown.
 * @param {Material} [options.environmentOcclusionMaterial=Material.ColorType] The appearance of the surface that is occluded by the environment.
 * @param {Boolean} [options.showEnvironmentIntersection=false] Determines if the line intersecting the sensor and the environment is shown.
 * @param {Color} [options.environmentIntersectionColor=Color.WHITE] The color of the line intersecting the sensor and the environment.
 * @param {Number} [options.environmentIntersectionWidth=5.0] The width of the line intersecting the sensor and the environment in meters.
 * @param {Boolean} [options.showViewshed=false] Determine if a viewshed is shown. The viewshed is only shown in 3D (see {@link Scene#mode}) and only accounts for visible objects in the current camera view.
 * @param {Material} [options.viewshedVisibleColor=Color.LIME] The color of the scene geometry that is visible to the sensor.
 * @param {Material} [options.viewshedOccludedColor=Color.RED] The color of the scene geometry that is not visible to the sensor.
 * @param {Number} [options.viewshedResolution=2048] The resolution in pixels of the viewshed.
 * @param {ClassificationType} [options.classificationType=ClassificationType.BOTH] Determines whether terrain, 3D Tiles or both will be classified.
 * @param {Object} [options.id] User-defined object returned when the sensors is picked.
 * @param {Boolean} [options.debugShowCrossingPoints=false] For debugging only.  Determines if the points where the sensor boundary crosses off of and onto the ellipsoid are shown.
 * @param {Boolean} [options.debugShowProxyGeometry=false] For debugging only.  Determines if the proxy geometry used for shading the dome and ellipsoid horizon surfaces of the sensor boundary are shown.
 * @param {Boolean} [options.debugShowBoundingVolume=false] For debugging only. Determines if this primitive's commands' bounding spheres are shown.
 * @param {Boolean} [options.debugShowShadowMap=false] For debugging only. Determines if this primitive's shadow map's bounding volume and contents are shown.
 *
 * @see ConicSensor
 * @see CustomPatternSensor
 *
 * @example
 * // Example 1. Sensor on the ground pointing straight up
 * var sensor = scene.primitives.add(new IonSdkSensors.RectangularSensor({
 *   modelMatrix : Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706)),
 *   radius : 1000000.0,
 *   xHalfAngle : Cesium.Math.toRadians(25.0),
 *   yHalfAngle : Cesium.Math.toRadians(40.0)
 * }));
 *
 * @example
 * // Example 2. Sensor pointing straight down with its dome intersecting the ellipsoid
 * var sensor = scene.primitives.add(new IonSdkSensors.RectangularSensor({
 *   modelMatrix : Cesium.Transforms.northEastDownToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 900000.0)),
 *   radius : 1000000.0,
 *   xHalfAngle : Cesium.Math.toRadians(25.0),
 *   yHalfAngle : Cesium.Math.toRadians(40.0),
 *   lateralSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.StripeType),
 *   intersectionColor :  Cesium.Color.YELLOW
 * }));
 *
 * @example
 * // Example 3. Sensor with custom materials for each surface.  Switch to 2D to see the ellipsoid surface material.
 * var sensor = scene.primitives.add(new IonSdkSensors.RectangularSensor({
 *   modelMatrix : Cesium.Transforms.northEastDownToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 9000000.0)),
 *   radius : 20000000.0,
 *   xHalfAngle : Cesium.Math.toRadians(25.0),
 *   yHalfAngle : Cesium.Math.toRadians(40.0),
 *   lateralSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(1.0, 0.0, 0.0, 0.5) }),
 *   ellipsoidHorizonSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(0.0, 1.0, 0.0, 0.5) }),
 *   ellipsoidSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(0.0, 0.0, 1.0, 0.5) }),
 *   domeSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(1.0, 1.0, 1.0, 0.5) })
 * }));
 */
function RectangularSensor(options) {
  options = options ?? Frozen.EMPTY_OBJECT;

  /**
   * When <code>true</code>, the sensor is shown.
   *
   * @type {Boolean}
   * @default true
   */
  this.show = options.show ?? true;

  /**
   * Indicates what portion of the sensor is shown.
   * <div align='center'>
   * <table border='0' cellpadding='5'><tr>
   * <td align='center'><code>COMPLETE</code><br/><img src='Images/SensorVolumePortionToDisplay.COMPLETE.png' width='250' height='188' /></td>
   * <td align='center'><code>BELOW_ELLIPSOID_HORIZON</code><br/><img src='Images/SensorVolumePortionToDisplay.BELOW_ELLIPSOID_HORIZON.png' width='250' height='188' /></td>
   * <td align='center'><code>ABOVE_ELLIPSOID_HORIZON</code><br/><img src='Images/SensorVolumePortionToDisplay.ABOVE_ELLIPSOID_HORIZON.png' width='250' height='188' /></td>
   * </tr></table>
   * </div>
   *
   * @type {SensorVolumePortionToDisplay}
   * @default {@link SensorVolumePortionToDisplay.COMPLETE}
   */
  this.portionToDisplay =
    options.portionToDisplay ?? SensorVolumePortionToDisplay.COMPLETE;

  /**
   * The 4x4 transformation matrix that transforms the sensor from model to world coordinates.  In its model
   * coordinates, the sensor's principal direction is along the positive z-axis.  Half angles measured from the
   * principal direction in the direction of the x-axis and y-axis define the rectangle of the rectangular
   * cross section.
   * <p>
   * <div align='center'>
   * <img src='Images/RectangularSensor.modelMatrix.png' /><br />
   * </div>
   * </p>
   *
   * @type {Matrix4}
   * @default {@link Matrix4.IDENTITY}
   *
   * @example
   * // The sensor's origin is located on the surface at -75.59777 degrees longitude and 40.03883 degrees latitude.
   * // The sensor opens upward, along the surface normal.
   * var center = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
   * sensor.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
   */
  this.modelMatrix = Matrix4.clone(options.modelMatrix ?? Matrix4.IDENTITY);

  /**
   * The distance from the sensor origin to any point on the sensor dome.  Informally, this is the length of the sensor.
   *
   * @type {Number}
   * @default {@link Number.POSITIVE_INFINITY}
   */
  this.radius = options.radius ?? Number.POSITIVE_INFINITY;

  /**
   * The half-angle, in radians, of the sensor measured from the positive z-axis (principal direction) along the x-axis.
   *
   * @type {Number}
   * @default {@link CesiumMath.PI_OVER_TWO}
   */
  this.xHalfAngle = options.xHalfAngle ?? CesiumMath.PI_OVER_TWO;
  this._xHalfAngle = undefined;

  /**
   * The half-angle, in radians, of the sensor measured from the positive z-axis (principal direction) along the y-axis.
   *
   * @type {Number}
   * @default {@link CesiumMath.PI_OVER_TWO}
   */
  this.yHalfAngle = options.yHalfAngle ?? CesiumMath.PI_OVER_TWO;
  this._yHalfAngle = undefined;

  /**
   * The surface appearance of the lateral surfaces, i.e., the outer sides of the sensor.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
   * {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}.
   *
   * @type {Material}
   * @default {@link Material.ColorType}
   *
   * @see {@link RectangularSensor#showLateralSurfaces}
   *
   * @example
   * // Change the color of the default material to yellow
   * sensor.lateralSurfaceMaterial.uniforms.color = Cesium.Color.YELLOW;
   *
   * @example
   * // Change material to horizontal stripes
   * sensor.lateralSurfaceMaterial = Cesium.Material.fromType(Cesium.Material.StripeType);
   */
  this.lateralSurfaceMaterial = defined(options.lateralSurfaceMaterial)
    ? options.lateralSurfaceMaterial
    : Material.fromType(Material.ColorType);

  /**
   * When <code>true</code>, the sensor's lateral surfaces, i.e., the outer sides of the sensor, are shown.
   * <p>
   * These surfaces are only shown in 3D (see {@link Scene#mode}).
   * </p>
   * </p>
   * <div align='center'>
   * <table border='0' cellpadding='5'><tr>
   * <td align='center'>Full sensor<br/><img src='Images/RectangularSensor.showLateralSurfaces.png' width='250' height='188' /></td>
   * <td align='center'>Lateral surfaces only<br/><img src='Images/RectangularSensor.showLateralSurfaces.only.png' width='250' height='188' /></td>
   * </tr></table>
   * </div>
   *
   * @type {Boolean}
   * @default true
   *
   * @see {@link RectangularSensor#lateralSurfaceMaterial}
   */
  this.showLateralSurfaces = options.showLateralSurfaces ?? true;

  /**
   * The surface appearance of the ellipsoid horizon surfaces, i.e., the sides formed from occlusion due to the ellipsoid hoirzon.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
   * {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}.
   * <p>
   * When <code>undefined</code>, {@link RectangularSensor#lateralSurfaceMaterial} is used.
   * </p>
   *
   * @type {Material}
   * @default undefined
   *
   * @see {@link RectangularSensor#showEllipsoidHorizonSurfaces}
   *
   * @example
   * // Change the color of the ellipsoid horizon surface material to yellow
   * sensor.ellipsoidHorizonSurfaceMaterial.uniforms.color = Cesium.Color.YELLOW;
   *
   * @example
   * // Change material to horizontal stripes
   * sensor.ellipsoidHorizonSurfaceMaterial = Cesium.Material.fromType(Cesium.Material.StripeType);
   */
  this.ellipsoidHorizonSurfaceMaterial = defined(
    options.ellipsoidHorizonSurfaceMaterial,
  )
    ? options.ellipsoidHorizonSurfaceMaterial
    : undefined;

  /**
   * When <code>true</code>, the ellipsoid horizon surfaces, i.e., the sides formed from occlusion due to the ellipsoid hoirzon, are shown.
   * <p>
   * These surfaces are only shown in 3D (see {@link Scene#mode}).
   * </p>
   * <div align='center'>
   * <table border='0' cellpadding='5'><tr>
   * <td align='center'>Full sensor<br/><img src='Images/RectangularSensor.showEllipsoidHorizonSurfaces.png' width='250' height='188' /></td>
   * <td align='center'>Ellipsoid horizon surfaces only<br/><img src='Images/RectangularSensor.showEllipsoidHorizonSurfaces.only.png' width='250' height='188' /></td>
   * </tr></table>
   * </div>
   *
   * @type {Boolean}
   * @default true
   *
   * @see {@link RectangularSensor#ellipsoidHorizonSurfaceMaterial}
   */
  this.showEllipsoidHorizonSurfaces =
    options.showEllipsoidHorizonSurfaces ?? true;

  /**
   * The appearance of the ellipsoid surface where the sensor intersects.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
   * <a href='https://github.com/CesiumGS/cesium/wiki/Fabric'>Fabric</a>.
   * <p>
   * When <code>undefined</code>, {@link RectangularSensor#lateralSurfaceMaterial} is used.
   * </p>
   *
   * @type {Material}
   * @default undefined
   *
   * @see {@link RectangularSensor#showEllipsoidSurfaces}
   *
   * @example
   * // Change the color of the ellipsoid surface material to yellow
   * sensor.ellipsoidSurfaceMaterial.uniforms.color = new Cesium.Color.YELLOW;
   *
   * @example
   * // Change material to horizontal stripes
   * sensor.ellipsoidSurfaceMaterial = Material.fromType(Material.StripeType);
   */
  this.ellipsoidSurfaceMaterial = defined(options.ellipsoidSurfaceMaterial)
    ? options.ellipsoidSurfaceMaterial
    : undefined;
  this._ellipsoidSurfaceMaterial = undefined;
  this._ellipsoidSurfaceIsTranslucent = undefined;

  /**
   * When <code>true</code>, the ellipsoid/sensor intersection surfaces are shown.
   * <p>
   * These surfaces are only shown in 2D and Columbus View (see {@link Scene#mode}).
   * </p>
   *
   * @type {Boolean}
   * @default true
   *
   * @see {@link RectangularSensor#ellipsoidSurfaceMaterial}
   */
  this.showEllipsoidSurfaces = options.showEllipsoidSurfaces ?? true;

  /**
   * The surface appearance of the sensor dome.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
   * {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}.
   * <p>
   * When <code>undefined</code>, {@link RectangularSensor#lateralSurfaceMaterial} is used.
   * </p>
   *
   * @type {Material}
   * @default undefined
   *
   * @see {@link RectangularSensor#showDomeSurfaces}
   *
   * @example
   * // Change the color of the dome surface material to yellow
   * sensor.domeSurfaceMaterial.uniforms.color = Cesium.Color.YELLOW;
   *
   * @example
   * // Change material to horizontal stripes
   * sensor.domeSurfaceMaterial = Material.fromType(Material.StripeType);
   */
  this.domeSurfaceMaterial = defined(options.domeSurfaceMaterial)
    ? options.domeSurfaceMaterial
    : undefined;

  /**
   * When <code>true</code>, the sensor dome surfaces are shown.
   * <p>
   * These surfaces are only shown in 3D (see {@link Scene#mode}).
   * </p>
   * <div align='center'>
   * <table border='0' cellpadding='5'><tr>
   * <td align='center'>Full sensor<br/><img src='Images/RectangularSensor.showDomeSurfaces.png' width='250' height='188' /></td>
   * <td align='center'>Dome only<br/><img src='Images/RectangularSensor.showDomeSurfaces.only.png' width='250' height='188' /></td>
   * </tr></table>
   * </div>
   *
   * @type {Boolean}
   * @default true
   *
   * @see {@link RectangularSensor#domeSurfaceMaterial}
   */
  this.showDomeSurfaces = options.showDomeSurfaces ?? true;

  /**
   * When <code>true</code>, a polyline is shown where the sensor intersections the ellipsoid.
   * <div align='center'>
   * <table border='0' cellpadding='5'><tr>
   * <td align='center'><code>showIntersection : false</code><br/><img src='Images/RectangularSensor.showIntersection.false.png' width='250' height='188' /></td>
   * <td align='center'><code>showIntersection : true</code><br/><img src='Images/RectangularSensor.showIntersection.true.png' width='250' height='188' /></td>
   * </tr></table>
   * </div>
   *
   * @type {Boolean}
   *
   * @default true
   *
   * @see RectangularSensor#intersectionColor
   * @see RectangularSensor#intersectionWidth
   */
  this.showIntersection = options.showIntersection ?? true;

  /**
   * The color of the polyline where the sensor intersects the ellipsoid.
   *
   * @type {Color}
   * @default {@link Color.WHITE}
   *
   * @see RectangularSensor#showIntersection
   */
  this.intersectionColor = Color.clone(
    options.intersectionColor ?? Color.WHITE,
  );

  /**
   * The approximate pixel width of the polyline where the sensor intersects the ellipsoid.
   *
   * @type {Number}
   * @default 5.0
   *
   * @see RectangularSensor#showIntersection
   */
  this.intersectionWidth = options.intersectionWidth ?? 5.0;

  /**
   * <p>
   * When <code>true</code>, a sensor intersecting the ellipsoid is drawn through the ellipsoid and potentially out
   * to the other side.
   * </p>
   * <div align='center'>
   * <table border='0' cellpadding='5'><tr>
   * <td align='center'><code>showThroughEllipsoid : false</code><br/><img src='Images/RectangularSensor.showThroughEllipsoid.false.png' width='250' height='188' /></td>
   * <td align='center'><code>showThroughEllipsoid : true</code><br/><img src='Images/RectangularSensor.showThroughEllipsoid.true.png' width='250' height='188' /></td>
   * </tr></table>
   * </div>
   *
   * @type {Boolean}
   * @default false
   */
  this.showThroughEllipsoid = options.showThroughEllipsoid ?? false;

  /**
   * When <code>true</code>, a sensor intersecting the environment, e.g. terrain or models, will discard the portion of the sensor that is occluded.
   *
   * @type {Boolean}
   * @default false
   */
  this.environmentConstraint = options.environmentConstraint ?? false;

  /**
   * When <code>true</code>, the portion of the sensor occluded by the environment will be drawn with {@link RectangularSensor#environmentOcclusionMaterial}.
   * {@link RectangularSensor#environmentConstraint} must also be <code>true</code>.
   *
   * @type {Boolean}
   * @default false
   */
  this.showEnvironmentOcclusion = options.showEnvironmentOcclusion ?? false;

  /**
   * The surface appearance of the portion of the sensor occluded by the environment.
   *
   * @type {Material}
   * @default {@link Material.ColorType}
   */
  this.environmentOcclusionMaterial = defined(
    options.environmentOcclusionMaterial,
  )
    ? options.environmentOcclusionMaterial
    : Material.fromType(Material.ColorType);

  /**
   * When <code>true</code>, a line is shown where the sensor intersections the environment, e.g. terrain or models.
   *
   * @type {Boolean}
   * @default false
   */
  this.showEnvironmentIntersection =
    options.showEnvironmentIntersection ?? false;

  /**
   * The color of the line intersecting the environment.
   *
   * @type {Color}
   * @default {@link Color.WHITE}
   */
  this.environmentIntersectionColor = Color.clone(
    options.environmentIntersectionColor ?? Color.WHITE,
  );

  /**
   * The approximate width in meters of the line intersecting the environment.
   *
   * @type {Number}
   * @default 5.0
   */
  this.environmentIntersectionWidth =
    options.environmentIntersectionWidth ?? 5.0;

  /**
   * Determine if a viewshed is shown. Viewsheds only take into account objects
   * in the scene that are currently visible and are only show in 3D
   * (see {@link Scene#mode}.)
   *
   * @type {Boolean}
   * @default false
   *
   * @experimental This feature is not final and is subect to change without Cesium's standard deprecation policy.
   *
   * @see RectangularSensor#viewshedVisibleColor
   * @see RectangularSensor#viewshedOccludedColor
   * @see RectangularSensor#viewshedResolution
   */
  this.showViewshed = options.showViewshed ?? false;

  /**
   * The color of the scene geometry that is visible to the sensor.
   *
   * @type {Color}
   * @default {@link Color.LIME}
   *
   * @experimental This feature is not final and is subect to change without Cesium's standard deprecation policy.
   */
  this.viewshedVisibleColor = defined(options.viewshedVisibleColor)
    ? Color.clone(options.viewshedVisibleColor)
    : Color.LIME.withAlpha(0.5);

  /**
   * The color of the scene geometry that is not visible to the sensor.
   *
   * @type {Color}
   * @default {@link Color.RED}
   *
   * @experimental This feature is not final and is subect to change without Cesium's standard deprecation policy.
   */
  this.viewshedOccludedColor = defined(options.viewshedOccludedColor)
    ? Color.clone(options.viewshedOccludedColor)
    : Color.RED.withAlpha(0.5);

  /**
   * The resolution in pixels of the viewshed.
   *
   * @experimental This feature is not final and is subect to change without Cesium's standard deprecation policy.
   *
   * @type {Number}
   * @default 2048
   */
  this.viewshedResolution = options.viewshedResolution ?? 2048;

  /**
   * Determines whether terrain, 3D Tiles or both will be classified.
   *
   * @type {ClassificationType}
   *
   * @default ClassificationType.BOTH
   */
  this.classificationType =
    options.classificationType ?? ClassificationType.BOTH;

  /**
   * User-defined object returned when the sensors is picked.
   *
   * @type Object
   *
   * @default undefined
   *
   * @see Scene#pick
   */
  this.id = options.id;

  /**
   * This property is for debugging only; it is not for production use nor is it optimized.
   * <p>
   * When <code>true</code>, draws the points where the sensor boundary crosses off of and onto the ellipsoid.
   * </p>
   *
   * @type {Boolean}
   *
   * @default false
   */
  this.debugShowCrossingPoints = options.debugShowCrossingPoints ?? false;

  /**
   * This property is for debugging only; it is not for production use nor is it optimized.
   * <p>
   * When <code>true</code>, draws the proxy geometry used for shading the dome and ellipsoid horizon surfaces of the sensor boundary.
   * </p>
   *
   * @type {Boolean}
   *
   * @default false
   */
  this.debugShowProxyGeometry = options.debugShowProxyGeometry ?? false;

  /**
   * This property is for debugging only; it is not for production use nor is it optimized.
   * <p>
   * When <code>true</code>, draws the bounding sphere for each {@link DrawCommand} in the sensor.
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
   * When <code>true</code>, draws a bounding volume around the light source for the shadow map used for environment intersections.
   * Also, the contents of the shadow map are drawn to a viewport quad.
   * </p>
   *
   * @type {Boolean}
   * @default false
   */
  this.debugShowShadowMap = options.debugShowShadowMap ?? false;

  const customSensorOptions = clone(options);
  customSensorOptions._pickPrimitive = options._pickPrimitive ?? this;
  this._customSensor = new CustomPatternSensor(customSensorOptions);
}

Object.defineProperties(RectangularSensor.prototype, {
  /**
   * Gets the ellipsoid that the sensor potentially intersects.
   * @memberof RectangularSensor.prototype
   *
   * @type {Ellipsoid}
   * @readonly
   *
   * @default Ellipsoid.WGS84
   */
  ellipsoid: {
    get: function () {
      return this._customSensor.ellipsoid;
    },
  },
});

/**
 * Called when {@link Viewer} or {@link CesiumWidget} render the scene to
 * get the draw commands needed to render this primitive.
 * <p>
 * Do not call this function directly.  This is documented just to
 * list the exceptions that may be propagated when the scene is rendered:
 * </p>
 *
 * @exception {DeveloperError} this.xHalfAngle and this.yHalfAngle must each be less than 90 degrees.
 * @exception {DeveloperError} this.radius must be greater than or equal to zero.
 * @exception {DeveloperError} this.lateralSurfaceMaterial must be defined.
 */
RectangularSensor.prototype.update = function (frameState) {
  //>>includeStart('debug', pragmas.debug)
  if (
    this.xHalfAngle > CesiumMath.PI_OVER_TWO ||
    this.yHalfAngle > CesiumMath.PI_OVER_TWO
  ) {
    throw new DeveloperError(
      "this.xHalfAngle and this.yHalfAngle must each be less than or equal to 90 degrees.",
    );
  }
  //>>includeEnd('debug');

  const s = this._customSensor;

  s.show = this.show;
  s.showIntersection = this.showIntersection;
  s.showThroughEllipsoid = this.showThroughEllipsoid;
  s.portionToDisplay = this.portionToDisplay;
  s.modelMatrix = this.modelMatrix;
  s.radius = this.radius;
  s.lateralSurfaceMaterial = this.lateralSurfaceMaterial;
  s.showLateralSurfaces = this.showLateralSurfaces;
  s.ellipsoidHorizonSurfaceMaterial = this.ellipsoidHorizonSurfaceMaterial;
  s.showEllipsoidHorizonSurfaces = this.showEllipsoidHorizonSurfaces;
  s.ellipsoidSurfaceMaterial = this.ellipsoidSurfaceMaterial;
  s.showEllipsoidSurfaces = this.showEllipsoidSurfaces;
  s.domeSurfaceMaterial = this.domeSurfaceMaterial;
  s.showDomeSurfaces = this.showDomeSurfaces;
  s.intersectionColor = this.intersectionColor;
  s.intersectionWidth = this.intersectionWidth;
  s.environmentConstraint = this.environmentConstraint;
  s.environmentOcclusionMaterial = this.environmentOcclusionMaterial;
  s.showEnvironmentOcclusion = this.showEnvironmentOcclusion;
  s.showEnvironmentIntersection = this.showEnvironmentIntersection;
  s.environmentIntersectionColor = this.environmentIntersectionColor;
  s.environmentIntersectionWidth = this.environmentIntersectionWidth;
  s.showViewshed = this.showViewshed;
  s.viewshedVisibleColor = this.viewshedVisibleColor;
  s.viewshedOccludedColor = this.viewshedOccludedColor;
  s.viewshedResolution = this.viewshedResolution;
  s.classificationType = this.classificationType;
  s.id = this.id;
  s.debugShowCrossingPoints = this.debugShowCrossingPoints;
  s.debugShowProxyGeometry = this.debugShowProxyGeometry;
  s.debugShowBoundingVolume = this.debugShowBoundingVolume;
  s.debugShowShadowMap = this.debugShowShadowMap;
  s._useUniformsForNormals = true; // Since the half angles may be dynamic, we'll use uniforms for the lateral facet normals.

  if (
    this._xHalfAngle !== this.xHalfAngle ||
    this._yHalfAngle !== this.yHalfAngle
  ) {
    this._xHalfAngle = this.xHalfAngle;
    this._yHalfAngle = this.yHalfAngle;

    // At 90 degrees the sensor is completely open, and tan() goes to infinity.
    const tanX = Math.tan(
      Math.min(this.xHalfAngle, CesiumMath.toRadians(89.0)),
    );
    const tanY = Math.tan(
      Math.min(this.yHalfAngle, CesiumMath.toRadians(89.0)),
    );
    const theta = Math.atan(tanY / tanX);
    const cone = Math.atan(Math.sqrt(tanX * tanX + tanY * tanY));

    s.directions = [
      {
        clock: theta,
        cone: cone,
      },
      {
        clock: CesiumMath.toRadians(180.0) - theta,
        cone: cone,
      },
      {
        clock: CesiumMath.toRadians(180.0) + theta,
        cone: cone,
      },
      {
        clock: -theta,
        cone: cone,
      },
    ];
  }

  s.update(frameState);
};

/**
 * Determines if ellipsoid surface shading is supported in 3D mode.
 *
 * @param {Scene} scene The scene.
 * @returns {Boolean} <code>true</code> if ellipsoid surface shading is supported in 3D mode; otherwise, returns <code>false</code>
 */
RectangularSensor.ellipsoidSurfaceIn3DSupported =
  CustomPatternSensor.ellipsoidSurfaceIn3DSupported;

/**
 * Determines if viewshed shading is supported.
 *
 * @param {Scene} scene The scene.
 * @returns {Boolean} <code>true</code> if viewshed shading is supported; otherwise, returns <code>false</code>
 */
RectangularSensor.viewshedSupported =
  CustomPatternSensor.ellipsoidSurfaceIn3DSupported;

/**
 * Returns true if this object was destroyed; otherwise, false.
 * <br /><br />
 * If this object was destroyed, it should not be used; calling any function other than
 * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
 *
 * @returns {Boolean} <code>true</code> if this object was destroyed; otherwise, <code>false</code>.
 */
RectangularSensor.prototype.isDestroyed = function () {
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
 * sensor = sensor && sensor.destroy();
 */
RectangularSensor.prototype.destroy = function () {
  this._customSensor = this._customSensor && this._customSensor.destroy();
  return destroyObject(this);
};
export default RectangularSensor;
