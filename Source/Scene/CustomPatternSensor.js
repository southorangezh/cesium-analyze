import {
  BoundingSphere,
  Cartesian2,
  Cartesian3,
  Cartesian4,
  Cartographic,
  Color,
  CullFace,
  DeveloperError,
  Ellipsoid,
  LabelCollection,
  Material,
  Matrix3,
  Matrix4,
  PerspectiveFrustum,
  PrimitiveType,
  SceneMode,
  combine,
  defined,
  destroyObject,
  Frozen,
  Math as CesiumMath,
  ClassificationType,
  BufferUsage,
  DrawCommand,
  Pass,
  ShaderProgram,
  arrayRemoveDuplicates,
  Buffer,
  ShaderSource,
  ShadowMap,
  SensorVolumePortionToDisplay,
} from "@cesium/engine";
import SphericalPolygon from "../Core/SphericalPolygon.js";
import EllipsoidHorizonFacetFS from "../Shaders/EllipsoidHorizonFacetFS.js";
import EllipsoidHorizonFacetInsideFS from "../Shaders/EllipsoidHorizonFacetInsideFS.js";
import EllipsoidHorizonFacetOutsideFS from "../Shaders/EllipsoidHorizonFacetOutsideFS.js";
import InfiniteCone from "../Shaders/InfiniteCone.js";
import PlanarSensorVolumeFS from "../Shaders/PlanarSensorVolumeFS.js";
import PlanarSensorVolumeVS from "../Shaders/PlanarSensorVolumeVS.js";
import SensorDomeFS from "../Shaders/SensorDomeFS.js";
import SensorDomeInsideFS from "../Shaders/SensorDomeInsideFS.js";
import SensorDomeOutsideFS from "../Shaders/SensorDomeOutsideFS.js";
import ShadersSensorVolume from "../Shaders/SensorVolume.js";
import SensorVolume2DFS from "../Shaders/SensorVolume2DFS.js";
import SensorVolume2DVS from "../Shaders/SensorVolume2DVS.js";
import SensorVolume3DVS from "../Shaders/SensorVolume3DVS.js";
import SensorVolumeDepth from "../Shaders/SensorVolumeDepth.js";
import SensorVolume from "./SensorVolume.js";
import SphericalPolygonShaderSupport from "./SphericalPolygonShaderSupport.js";
import isZeroMatrix from "../Shaders/isZeroMatrix.js";

function Crossing() {
  this.index = undefined;
  this.v = new Cartesian3();
  this.r = new Cartesian3();
  this.cosine = undefined;
  this.sine = undefined;
  this.kind = undefined;
}

/**
 * Visualizes a custom sensor volume taking into account occlusion of an ellipsoid, i.e., the globe, or the environment, i.e., terrain and models.  The sensor's
 * shape is defined by {@link CustomPatternSensor#directions}, which is an array of clock and cone angles, and a radius
 * ({@link CustomPatternSensor#radius}).  The sensor's principal direction is along the positive z-axis.  Clock
 * angles are angles around the z-axis, rotating x into y.  Cone angles are angles from the z-axis towards the xy plane.
 * <p>
 * Directions must conform to the following restrictions:
 * <ul>
 *    <li>Duplicate vertices are not allowed.</li>
 *    <li>Consecutive vertices should be less than 180 degrees apart.</li>
 * </ul>
 * </p>
 * The shape also depends on if the sensor intersects the ellipsoid, as shown in examples 3 and 4 below, and what
 * surfaces are shown using properties such as {@link CustomPatternSensor#showDomeSurfaces}.
 *
 * <div align='center'>
 * <table border='0' cellpadding='5'>
 * <tr>
 * <td align='center'>Code Example 1 below<br/><img src='Images/CustomPatternSensor.example1.png' width='250' height='188' /></td>
 * <td align='center'>Code Example 2 below<br/><img src='Images/CustomPatternSensor.example2.png' width='250' height='188' /></td>
 * </tr>
 * <tr>
 * <td align='center'>Code Example 3 below<br/><img src='Images/CustomPatternSensor.example3.png' width='250' height='188' /></td>
 * <td align='center'>Code Example 4 below<br/><img src='Images/CustomPatternSensor.example4.png' width='250' height='188' /></td>
 * </tr>
 * </table>
 * </div>
 *
 * <p>
 * A sensor points along the local positive z-axis and is positioned and oriented using
 * {@link CustomPatternSensor#modelMatrix}.
 * </p>
 * <p>
 * <div align='center'>
 * <img src='Images/CustomPatternSensor.modelMatrix.png' /><br />
 * </div>
 * </p>
 *
 * @alias CustomPatternSensor
 * @ionsdk
 * @constructor
 *
 * @param {Object} [options] Object with the following properties:
 * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid that the sensor potentially intersects.
 * @param {Boolean} [options.show=true] Determines if the sensor will be shown.
 * @param {SensorVolumePortionToDisplay} [options.portionToDisplay=SensorVolumePortionToDisplay.COMPLETE] Indicates what portion of the sensor is shown.
 * @param {Matrix4} [options.modelMatrix=Matrix4.IDENTITY] The 4x4 transformation matrix that transforms the sensor from model to world coordinates.
 * @param {Number} [options.radius=Number.POSITIVE_INFINITY] The distance from the sensor origin to any point on the sensor dome.
 * @param {Number} [options.directions=undefined] An array of objects with clock and cone angles, in radians, defining the sensor volume.
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
 * @see RectangularSensor
 *
 * @example
 * // Example 1. Sensor on the ground pointing straight up
 * var sensor = scene.primitives.add(new IonSdkSensors.CustomPatternSensor({
 *   modelMatrix : Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706)),
 *   radius : 1000000.0,
 *   directions : [{
 *     clock : Cesium.Math.toRadians(0.0),
 *     cone : Cesium.Math.toRadians(30.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(90.0),
 *     cone : Cesium.Math.toRadians(30.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(180.0),
 *     cone : Cesium.Math.toRadians(30.0)
 *   }]
 * }));
 *
 * @example
 * // Example 2. Star-pattern sensor pointing straight down with its lateral surface intersecting the ellipsoid.
 * var sensor = scene.primitives.add(new IonSdkSensors.CustomPatternSensor({
 *   modelMatrix : Cesium.Transforms.northEastDownToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 700000.0)),
 *   radius : 1000000.0,
 *   directions : [{
 *     clock : Cesium.Math.toRadians(0.0),
 *     cone : Cesium.Math.toRadians(40.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(45.0),
 *     cone : Cesium.Math.toRadians(20.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(90.0),
 *     cone : Cesium.Math.toRadians(40.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(135.0),
 *     cone : Cesium.Math.toRadians(20.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(180.0),
 *     cone : Cesium.Math.toRadians(40.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(225.0),
 *     cone : Cesium.Math.toRadians(20.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(270.0),
 *     cone : Cesium.Math.toRadians(40.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(315.0),
 *     cone : Cesium.Math.toRadians(20.0)
 *   }],
 * }));
 *
 * @example
 * // Example 3. Sensor pointing straight down with its dome intersecting the ellipsoid
 * var sensor = scene.primitives.add(new IonSdkSensors.CustomPatternSensor({
 *   modelMatrix : Cesium.Transforms.northEastDownToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 900000.0)),
 *   radius : 1000000.0,
 *   directions : [{
 *     clock : Cesium.Math.toRadians(270.0),
 *     cone : Cesium.Math.toRadians(30.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(0.0),
 *     cone : Cesium.Math.toRadians(30.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(90.0),
 *     cone : Cesium.Math.toRadians(30.0)
 *   }],
 *   lateralSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.StripeType),
 *   intersectionColor :  Cesium.Color.YELLOW
 * }));
 *
 * @example
 * // Example 4. Sensor with custom materials for each surface.  Switch to 2D to see the ellipsoid surface material.
 * var sensor = scene.primitives.add(new IonSdkSensors.CustomPatternSensor({
 *   modelMatrix : Cesium.Transforms.northEastDownToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 9000000.0)),
 *   radius : 20000000.0,
 *   directions : [{
 *     clock : Cesium.Math.toRadians(270.0),
 *     cone : Cesium.Math.toRadians(30.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(0.0),
 *     cone : Cesium.Math.toRadians(30.0)
 *   }, {
 *     clock : Cesium.Math.toRadians(90.0),
 *     cone : Cesium.Math.toRadians(30.0)
 *   }],
 *   lateralSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(1.0, 0.0, 0.0, 0.5) }),
 *   ellipsoidHorizonSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(0.0, 1.0, 0.0, 0.5) }),
 *   ellipsoidSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(0.0, 0.0, 1.0, 0.5) }),
 *   domeSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(1.0, 1.0, 1.0, 0.5) })
 * }));
 */
function CustomPatternSensor(options) {
  options = options ?? Frozen.EMPTY_OBJECT;

  this._pickId = undefined;
  this._pickPrimitive = options._pickPrimitive ?? this;

  this._vertices2D = undefined;
  this._command1Vertices2D = undefined;
  this._command2Vertices2D = undefined;
  this._vertexArray2D = undefined;
  this._vertexBuffer2D = undefined;
  this._drawCommands2D = undefined;
  this._drawCommandsShaderProgram2D = undefined;
  this._pickCommands2D = undefined;
  this._pickCommandsShaderProgram2D = undefined;
  this._numberOfCommands2D = 0;

  this._ellipsoidHorizonSurfaceCommandsVertices = undefined;
  this._ellipsoidHorizonSurfaceCommandsVertexArray = undefined;
  this._ellipsoidHorizonSurfaceCommandsBuffer = undefined;
  this._ellipsoidHorizonSurfaceColorCommandList = [];

  this._domeCommandsVertices = undefined;
  this._domeCommandsVertexArray = undefined;
  this._domeCommandsBuffer = undefined;
  this._domeColorCommandToAdd = undefined;
  this._completeDomeBoundingVolumeMC = new BoundingSphere();

  this._surfaceCommandVertexArray = undefined;
  this._surfaceCommandShaderProgram = undefined;
  this._surfaceCommandPickShaderProgram = undefined;
  this._surfaceCommandViewshedShaderProgram = undefined;
  this._surfaceCommand = new DrawCommand();
  this._surfaceBoundingVolumeMC = new BoundingSphere();

  this._lateralPlanarCommandsVertexArray = undefined;
  this._lateralPlanarBoundingSphere = new BoundingSphere();
  this._lateralPlanarBoundingSphereWC = new BoundingSphere();

  this._frontFaceColorCommand = new DrawCommand({
    boundingVolume: this._lateralPlanarBoundingSphereWC,
    owner: this,
  });
  this._backFaceColorCommand = new DrawCommand({
    boundingVolume: this._lateralPlanarBoundingSphereWC,
    owner: this,
  });
  this._pickCommand = new DrawCommand({
    boundingVolume: this._lateralPlanarBoundingSphereWC,
    owner: this,
    pickOnly: true,
  });

  this._ellipsoidHorizonSurfaceColorCommands = [];
  this._ellipsoidHorizonSurfaceColorCommandsSource = [];
  this._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram = [];
  this._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram = [];

  this._domeColorCommand = new DrawCommand({
    owner: this,
  });
  this._domeColorCommandSource = undefined;
  this._domeColorCommandInsideShaderProgram = undefined;
  this._domeColorCommandOutsideShaderProgram = undefined;

  this._ellipsoid = options.ellipsoid ?? Ellipsoid.WGS84;

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
  this._portionToDisplay = this.portionToDisplay;

  /**
   * The 4x4 transformation matrix that transforms the sensor from model to world coordinates.  In its model
   * coordinates, the sensor's principal direction is along the positive z-axis.  Clock angles are angles around
   * the z-axis, rotating x into y.  Cone angles are angles from the z-axis towards the xy plane.
   * <p>
   * <div align='center'>
   * <img src='Images/CustomPatternSensor.modelMatrix.png' /><br />
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
  this._modelMatrix = undefined;

  /**
   * The surface appearance of the lateral surfaces, i.e., the outer sides of the sensor.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
   * {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}.
   *
   * @type {Material}
   * @default {@link Material.ColorType}
   *
   * @see {@link CustomPatternSensor#showLateralSurfaces}
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
  this._lateralSurfaceMaterial = undefined;
  this._lateralSurfaceIsTranslucent = undefined;

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
   * @see {@link CustomPatternSensor#lateralSurfaceMaterial}
   */
  this.showLateralSurfaces = options.showLateralSurfaces ?? true;

  /**
   * The surface appearance of the ellipsoid horizon surfaces, i.e., the sides formed from occlusion due to the ellipsoid hoirzon.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
   * {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}.
   * <p>
   * When <code>undefined</code>, {@link CustomPatternSensor#lateralSurfaceMaterial} is used.
   * </p>
   *
   * @type {Material}
   * @default undefined
   *
   * @see {@link CustomPatternSensor#showEllipsoidHorizonSurfaces}
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
  this._ellipsoidHorizonSurfaceMaterial = undefined;
  this._ellipsoidHorizonSurfaceIsTranslucent = undefined;

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
   * @see {@link CustomPatternSensor#ellipsoidHorizonSurfaceMaterial}
   */
  this.showEllipsoidHorizonSurfaces =
    options.showEllipsoidHorizonSurfaces ?? true;

  /**
   * The appearance of the ellipsoid surface where the sensor intersects.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
   * <a href='https://github.com/CesiumGS/cesium/wiki/Fabric'>Fabric</a>.
   * <p>
   * When <code>undefined</code>, {@link CustomPatternSensor#lateralSurfaceMaterial} is used.
   * </p>
   *
   * @type {Material}
   * @default undefined
   *
   * @see {@link CustomPatternSensor#showEllipsoidSurfaces}
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
   * @see {@link CustomPatternSensor#ellipsoidSurfaceMaterial}
   */
  this.showEllipsoidSurfaces = options.showEllipsoidSurfaces ?? true;
  this._showEllipsoidSurfaces = this.showEllipsoidSurfaces;

  /**
   * The surface appearance of the sensor dome.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
   * {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}.
   * <p>
   * When <code>undefined</code>, {@link CustomPatternSensor#lateralSurfaceMaterial} is used.
   * </p>
   *
   * @type {Material}
   * @default undefined
   *
   * @see {@link CustomPatternSensor#showDomeSurfaces}
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
  this._domeSurfaceMaterial = undefined;
  this._domeSurfaceIsTranslucent = undefined;

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
   * @see {@link CustomPatternSensor#domeSurfaceMaterial}
   */
  this.showDomeSurfaces = options.showDomeSurfaces ?? true;

  /**
   * When <code>true</code>, a polyline is shown where the sensor intersects the ellipsoid.
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
   * @see CustomPatternSensor#intersectionColor
   * @see CustomPatternSensor#intersectionWidth
   */
  this.showIntersection = options.showIntersection ?? true;
  this._showIntersection = this.showIntersection;

  /**
   * The color of the polyline where the sensor intersects the ellipsoid.
   *
   * @type {Color}
   * @default {@link Color.WHITE}
   *
   * @see CustomPatternSensor#showIntersection
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
   * @see CustomPatternSensor#showIntersection
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
  this._showThroughEllipsoid = this.showThroughEllipsoid;

  /**
   * When <code>true</code>, a sensor intersecting the environment, e.g. terrain or models, will discard the portion of the sensor that is occluded.
   *
   * @type {Boolean}
   * @default false
   */
  this.environmentConstraint = options.environmentConstraint ?? false;
  this._environmentConstraint = this.environmentConstraint;

  /**
   * When <code>true</code>, the portion of the sensor occluded by the environment will be drawn with {@link CustomPatternSensor#environmentOcclusionMaterial}.
   * {@link CustomPatternSensor#environmentConstraint} must also be <code>true</code>.
   *
   * @type {Boolean}
   * @default false
   */
  this.showEnvironmentOcclusion = options.showEnvironmentOcclusion ?? false;
  this._showEnvironmentOcclusion = this.showEnvironmentOcclusion;

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
  this._environmentOcclusionMaterial = undefined;
  this._environmentOcclusionLateralMaterial = undefined;
  this._environmentOcclusionDomeMaterial = undefined;

  /**
   * When <code>true</code>, a line is shown where the sensor intersects the environment, e.g. terrain or models.
   *
   * @type {Boolean}
   * @default false
   */
  this.showEnvironmentIntersection =
    options.showEnvironmentIntersection ?? false;
  this._showEnvironmentIntersection = this.showEnvironmentIntersection;

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
   * @see CustomPatternSensor#viewshedVisibleColor
   * @see CustomPatternSensor#viewshedOccludedColor
   * @see CustomPatternSensor#viewshedResolution
   */
  this.showViewshed = options.showViewshed ?? false;
  this._showViewshed = this.showViewshed;

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
   * @type {Number}
   * @default 2048
   *
   * @experimental This feature is not final and is subect to change without Cesium's standard deprecation policy.
   */
  this.viewshedResolution = options.viewshedResolution ?? 2048;
  this._viewshedResolution = this.viewshedResolution;

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
  this._id = undefined;

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
  this._debugLabelCollection = undefined;

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

  this._sphericalPolygon = new SphericalPolygon();
  this._definitionChanged = false;
  this._useUniformsForNormals = false;

  this._radius = options.radius ?? Number.POSITIVE_INFINITY;

  this.directions = options.directions;

  const that = this;
  this._uniforms = {
    u_radii: function () {
      return that._ellipsoid.radii;
    },
    u_inverseRadii: function () {
      return that._ellipsoid.oneOverRadii;
    },
    u_sensorRadius: function () {
      return isFinite(that._radius) ? that._radius : SensorVolume.maximumRadius;
    },
    u_q: function () {
      return that._q;
    },
    u_intersectionColor: function () {
      return that.intersectionColor;
    },
    u_intersectionWidth: function () {
      return that.intersectionWidth;
    },
    u_normalDirection: function () {
      return 1.0;
    },
  };

  this._pickUniforms = {
    czm_pickColor: function () {
      return that._pickId.color;
    },
  };

  this._viewshedUniforms = {
    u_viewshedVisibleColor: function () {
      return that.viewshedVisibleColor;
    },
    u_viewshedOccludedColor: function () {
      return that.viewshedOccludedColor;
    },
  };

  this._ellipsoidHorizonSurfaceUniforms = {
    u_inverseUnitQ: function () {
      return that._inverseUnitQ;
    },
    u_cosineAndSineOfHalfAperture: function () {
      return that._cosineAndSineOfHalfAperture;
    },
  };

  this._inverseModelRotation = new Matrix3();

  this._uniforms2D = {
    u_p: function () {
      return that._p;
    },
    u_inverseModel: function () {
      return that._inverseModelRotation;
    },
  };

  this._mode = SceneMode.SCENE3D;

  this._sensorGlsl = undefined;
  this._sensorUniforms = undefined;
  this._shadowMapUniforms = undefined;

  this._shadowMap = undefined;

  this._fronts = [];
  this._backs = [];
  this._directions = [];
  this._crossings = [];

  // These elements are for the scaled ellipsoid horizon cone.
  this._p = new Cartesian3();
  this._q = new Cartesian3();
  this._unitQ = new Cartesian3();
  this._inverseUnitQ = new Cartesian3();
  this._qMagnitudeSquared = undefined;
  this._qMagnitudeSquaredMinusOne = undefined;
  this._cosineAndSineOfHalfAperture = new Cartesian2();
}

Object.defineProperties(CustomPatternSensor.prototype, {
  /**
   * The distance from the sensor origin to any point on the sensor dome.  Informally, this is the length of the sensor.
   * @memberof CustomPatternSensor.prototype
   *
   * @type {Number}
   *
   * @default {@link Number.POSITIVE_INFINITY}
   */
  radius: {
    get: function () {
      return this._radius;
    },
    set: function (value) {
      if (this._radius !== value) {
        this._radius = value;
        this._definitionChanged = true;
      }
    },
  },

  /**
   * Gets the ellipsoid that the sensor potentially intersects.
   * @memberof CustomPatternSensor.prototype
   *
   * @type {Ellipsoid}
   * @readonly
   *
   * @default Ellipsoid.WGS84
   */
  ellipsoid: {
    get: function () {
      return this._ellipsoid;
    },
  },

  /**
   * Gets or sets the directions which define the sensor volume.  As shown in the example, each
   * direction is defined by a clock and cone angle in radians.  The resulting volume may be convex or concave.
   * <p>
   * The sensor's principal direction is along the positive z-axis.  Clock angles are angles around
   * the z-axis, rotating x into y.  Cone angles are angles from the z-axis towards the xy plane.
   * </p>
   * <p>
   * Directions must conform to the following restrictions:
   * <ul>
   *    <li>Duplicate vertices are not allowed.</li>
   *    <li>Consecutive vertices should be less than 180 degrees apart.</li>
   * </ul>
   * </p>
   * @memberof CustomPatternSensor.prototype
   *
   * @type {Object}
   *
   * @example
   * // Create a triangular sensor projection
   * sensor.directions = [{
   *     clock : Cesium.Math.toRadians(0.0),
   *     cone : Cesium.Math.toRadians(30.0)
   *   }, {
   *     clock : Cesium.Math.toRadians(90.0),
   *     cone : Cesium.Math.toRadians(30.0)
   *   }, {
   *     clock : Cesium.Math.toRadians(180.0),
   *     cone : Cesium.Math.toRadians(30.0)
   * }]
   */
  directions: {
    get: function () {
      return this._sphericalPolygon.vertices;
    },
    set: function (sphericals) {
      // Users aren't supposed to have duplicate points in the array, but explicitly closing the shape
      // by specifying the first and last points to be the same is such a common paradigm that we're going
      // to check for duplicates anyway.
      this._sphericalPolygon.vertices = arrayRemoveDuplicates(
        sphericals,
        equalsEpsilon,
        true,
      );
      this._definitionChanged = true;
    },
  },
});

function equalsEpsilon(direction1, direction2, epsilon) {
  epsilon = epsilon ?? 0.0;
  return (
    direction1 === direction2 ||
    (defined(direction1) &&
      defined(direction2) &&
      Math.abs(direction1.clock - direction2.clock) <= epsilon &&
      Math.abs(direction1.cone - direction2.cone) <= epsilon)
  );
}

let vertex0 = new Cartesian3();
let vertex1 = new Cartesian3();
let normal = new Cartesian3();
const temp = new Cartesian3();

function updateDefinitionDependentData(sensor, context) {
  const radius = isFinite(sensor.radius)
    ? sensor.radius
    : SensorVolume.maximumRadius;
  const directions = sensor._sphericalPolygon._directions;

  const length = directions.length;

  // Allocate scratch arrays as necessary.
  let needed = Math.max(length, SensorVolume.numberOfSidesForCompleteCircle);
  let have = sensor._fronts.length;
  if (have > needed) {
    sensor._directions.length = needed;
    sensor._fronts.length = needed;
    sensor._backs.length = needed;
  } else if (have < needed) {
    for (let iii = have; iii < needed; ++iii) {
      sensor._directions[iii] = new Cartesian3();
      sensor._fronts[iii] = new Cartesian3();
      sensor._backs[iii] = new Cartesian3();
    }
  }

  const primitiveType = sensor.debugShowProxyGeometry
    ? PrimitiveType.LINES
    : sensor._frontFaceColorCommand.primitiveType;

  const maximumNumberOfEllipsoidHorizonSurfaces = length;

  needed = 2 * maximumNumberOfEllipsoidHorizonSurfaces;
  have = sensor._crossings.length;
  if (have > needed) {
    sensor._crossings.length = needed;
  } else if (have < needed) {
    for (let iiii = have; iiii < needed; ++iiii) {
      sensor._crossings[iiii] = new Crossing();
    }
  }

  SensorVolume.initializeEllipsoidHorizonSurfaceCommands(
    sensor,
    context,
    maximumNumberOfEllipsoidHorizonSurfaces,
    primitiveType,
  );

  SensorVolume.initializeDomeCommand(
    sensor,
    sensor._sphericalPolygon.referenceAxis,
    directions,
    sensor._sphericalPolygon.convexHull,
    context,
    length,
    primitiveType,
    radius,
    sensor._sensorUniforms,
  );

  SensorVolume.initializeSurfaceCommand(
    sensor,
    sensor._sphericalPolygon.referenceAxis,
    directions,
    sensor._sphericalPolygon.convexHull,
    context,
    primitiveType,
    radius,
    sensor._sensorUniforms,
  );

  const size = length * 3;
  const positions = new Float32Array(size + 3); // 3 additional floats for sensor vertex at (0, 0, 0) which is needed to define the bounding volume.

  for (
    let i = length - 2, j = length - 1, k = 0;
    k < length;
    i = j++, j = k++
  ) {
    const previous = directions[i];
    const current = directions[j];
    const next = directions[k];

    // Extend position so the volume encompasses the sensor's radius.  Use the shorter bisector in the scaling.
    const distance =
      (2.0 * radius) /
      Math.min(
        Cartesian3.magnitude(Cartesian3.add(previous, current, temp)),
        Cartesian3.magnitude(Cartesian3.add(current, next, temp)),
      );
    positions[j * 3] = distance * current.x;
    positions[j * 3 + 1] = distance * current.y;
    positions[j * 3 + 2] = distance * current.z;
  }
  // The sensor vertex is at (0, 0, 0).
  positions[size] = 0.0;
  positions[size + 1] = 0.0;
  positions[size + 2] = 0.0;

  BoundingSphere.fromVertices(
    positions,
    undefined,
    3,
    sensor._lateralPlanarBoundingSphere,
  );

  const vertices = new Float32Array(
    length * 3 * SensorVolume.numberOfFloatsPerVertex3D,
  );

  let kk = 0;
  for (let ii = length - 1, jj = 0; jj < length; ii = jj++) {
    vertex0 = Cartesian3.unpack(positions, ii * 3, vertex0);
    vertex1 = Cartesian3.unpack(positions, jj * 3, vertex1);
    normal = Cartesian3.normalize(
      Cartesian3.cross(vertex1, vertex0, normal),
      normal,
    ); // Per-face normals

    vertices[kk++] = 0.0; // Sensor vertex
    vertices[kk++] = 0.0;
    vertices[kk++] = 0.0;
    vertices[kk++] = normal.x;
    vertices[kk++] = normal.y;
    vertices[kk++] = normal.z;

    vertices[kk++] = vertex1.x;
    vertices[kk++] = vertex1.y;
    vertices[kk++] = vertex1.z;
    vertices[kk++] = normal.x;
    vertices[kk++] = normal.y;
    vertices[kk++] = normal.z;

    vertices[kk++] = vertex0.x;
    vertices[kk++] = vertex0.y;
    vertices[kk++] = vertex0.z;
    vertices[kk++] = normal.x;
    vertices[kk++] = normal.y;
    vertices[kk++] = normal.z;
  }
  const vertexBuffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: vertices,
    usage: BufferUsage.STATIC_DRAW,
  });
  const array = SensorVolume.makeVertexArray3D(sensor, context, vertexBuffer);
  sensor._lateralPlanarCommandsVertexArray = array;
  sensor._frontFaceColorCommand.vertexArray = array;
  sensor._backFaceColorCommand.vertexArray = array;
  sensor._pickCommand.vertexArray = array;
}

function initialize3D(sensor, context) {
  sensor._lateralPlanarCommandsVertexArray =
    sensor._lateralPlanarCommandsVertexArray &&
    sensor._lateralPlanarCommandsVertexArray.destroy();

  updateDefinitionDependentData(sensor, context);
}

function setLateralSurfacesRenderStates3D(sensor, context, isTranslucent) {
  const rs = SensorVolume.getRenderState3D(
    sensor,
    context,
    isTranslucent,
    CullFace.BACK,
  );
  const pass = isTranslucent ? Pass.TRANSLUCENT : Pass.OPAQUE;

  sensor._frontFaceColorCommand.renderState = rs;
  sensor._frontFaceColorCommand.pass = pass;

  sensor._pickCommand.renderState = rs;
  sensor._pickCommand.pass = pass;

  sensor._backFaceColorCommand.renderState = SensorVolume.getRenderState3D(
    sensor,
    context,
    true,
    CullFace.FRONT,
  );
  sensor._backFaceColorCommand.pass = pass;
}

// Scratch variables...
let modelToWorld = new Matrix3();
let worldToModel = new Matrix3();
let p = new Cartesian3();
let q = new Cartesian3();
let qUnit = new Cartesian3();
let bisector = new Cartesian3();
const firstOnCrossing = new Cartesian3();
let earthCenter = new Cartesian3();
const onCrossing = new Cartesian3();
const offCrossing = new Cartesian3();
let mostOrthogonalAxis = new Cartesian3();
let xAxis = new Cartesian3();
let yAxis = new Cartesian3();
const scaledQ = new Cartesian3();

function computeCrossings(sensor, context) {
  modelToWorld = Matrix4.getMatrix3(sensor.modelMatrix, modelToWorld);
  worldToModel = Matrix3.transpose(modelToWorld, worldToModel);
  p = Matrix4.getTranslation(sensor.modelMatrix, p);
  q = sensor._ellipsoid.transformPositionToScaledSpace(p, q);
  const qMagnitudeSquared = Cartesian3.magnitudeSquared(q);
  const radius = isFinite(sensor.radius)
    ? sensor.radius
    : SensorVolume.maximumRadius;

  const oneOverQ = 1.0 / Math.sqrt(qMagnitudeSquared);
  if (oneOverQ < 1.0) {
    const qMagnitudeSquaredMinusOne = qMagnitudeSquared - 1.0;
    const radiusSquared = radius * radius;
    const qScaledMagnitudeSquared = Cartesian3.magnitudeSquared(
      sensor._ellipsoid.transformPositionToScaledSpace(q, scaledQ),
    );

    if (
      isFinite(sensor.radius) &&
      sensor.portionToDisplay === SensorVolumePortionToDisplay.COMPLETE &&
      qMagnitudeSquaredMinusOne * qMagnitudeSquaredMinusOne >
        radiusSquared * qScaledMagnitudeSquared
    ) {
      SensorVolume.renderCompleteDome(sensor);
    } else {
      qUnit = Cartesian3.normalize(q, qUnit);

      earthCenter = Cartesian3.negate(
        Matrix3.multiplyByVector(worldToModel, p, earthCenter),
        earthCenter,
      );

      let earthCenterIsInsideSensor = true;
      let noLateralFacetsIntersectEllipsoidHorizonSurface = true;

      mostOrthogonalAxis = Cartesian3.mostOrthogonalAxis(
        qUnit,
        mostOrthogonalAxis,
      );
      yAxis = Cartesian3.normalize(
        Cartesian3.cross(mostOrthogonalAxis, qUnit, yAxis),
        yAxis,
      );
      xAxis = Cartesian3.normalize(
        Cartesian3.cross(qUnit, yAxis, xAxis),
        xAxis,
      );

      const info = {
        crossings: sensor._crossings,
        count: 0,
      };

      const length = sensor._sphericalPolygon.vertices.length;
      for (let index = 0; index < length; ++index) {
        const offset = index * 7;
        normal = Cartesian3.fromArray(
          sensor._sphericalPolygon._normalsAndBisectorsWithMagnitudeSquared,
          offset,
          normal,
        );
        bisector = Cartesian3.fromArray(
          sensor._sphericalPolygon._normalsAndBisectorsWithMagnitudeSquared,
          offset + 3,
          bisector,
        );
        const bisectorMagnitudeSquared =
          sensor._sphericalPolygon._normalsAndBisectorsWithMagnitudeSquared[
            offset + 6
          ];

        earthCenterIsInsideSensor =
          Cartesian3.dot(earthCenter, normal) < 0.0
            ? earthCenterIsInsideSensor
            : false;

        noLateralFacetsIntersectEllipsoidHorizonSurface &=
          SensorVolume.checkPlanarCrossings(
            sensor._ellipsoid,
            p,
            q,
            qUnit,
            oneOverQ,
            radiusSquared,
            modelToWorld,
            worldToModel,
            xAxis,
            yAxis,
            true,
            normal,
            bisector,
            bisectorMagnitudeSquared,
            sensor._portionToDisplay,
            index,
            info,
          );
      }

      const crossingCount = info.count;
      let crossings = info.crossings;

      if (crossingCount > 0 && qMagnitudeSquared > 1.0) {
        if (!sensor._sphericalPolygon.isConvex) {
          crossings = crossings.slice(0, crossingCount);
          crossings.sort(SensorVolume.angularSortUsingSineAndCosine);
        }

        const labelCollection = sensor._debugLabelCollection;
        if (defined(labelCollection)) {
          labelCollection.removeAll();
        }

        let foundOnCrossing = false;
        let foundOffCrossing = false;
        let foundOnCrossingFirst = false;
        let count = 0;
        for (let j = 0; j < crossingCount; ++j) {
          const c = crossings[j];

          if (sensor.debugShowCrossingPoints) {
            labelCollection.add({
              position: c.v,
              text: (c.kind === 1 ? "+" : "-") + c.index.toString(),
            });
          }

          if (c.kind === 1) {
            if (!foundOffCrossing) {
              Cartesian3.clone(c.r, firstOnCrossing);
              foundOnCrossingFirst = true;
            } else {
              Cartesian3.clone(c.r, onCrossing);
              foundOnCrossing = true;
            }
          }
          if (foundOnCrossing && foundOffCrossing) {
            const command =
              sensor._ellipsoidHorizonSurfaceColorCommands[count + 1];
            SensorVolume.updateHorizonCommand(
              count,
              command,
              sensor,
              context,
              offCrossing,
              onCrossing,
              worldToModel,
              p,
              q,
              qMagnitudeSquared,
              radius,
            );
            sensor._ellipsoidHorizonSurfaceColorCommandList.push(command);
            foundOnCrossing = false;
            foundOffCrossing = false;

            ++count;
          }
          if (c.kind === -1) {
            Cartesian3.clone(c.r, offCrossing);
            foundOffCrossing = true;
          }
        }
        if (foundOnCrossingFirst && foundOffCrossing) {
          const hc = sensor._ellipsoidHorizonSurfaceColorCommands[count + 1];
          SensorVolume.updateHorizonCommand(
            count,
            hc,
            sensor,
            context,
            offCrossing,
            firstOnCrossing,
            worldToModel,
            p,
            q,
            qMagnitudeSquared,
            radius,
          );
          sensor._ellipsoidHorizonSurfaceColorCommandList.push(hc);

          ++count;
        }
      }

      // PERFORMANCE_IDEA:  Tighten the proxy geometry for the BELOW_ELLIPSOID_HORIZON case.
      // Draw the complete dome if no portions are to be drawn.
      if (isFinite(sensor.radius)) {
        SensorVolume.renderCompleteDome(sensor);
      }

      // If appropriate, draw the complete ellipsoid horizon surface.
      if (
        noLateralFacetsIntersectEllipsoidHorizonSurface &&
        earthCenterIsInsideSensor
      ) {
        SensorVolume.renderCompleteEllipsoidHorizonSurface(
          sensor,
          context,
          radius,
          p,
          q,
          qMagnitudeSquared,
          oneOverQ,
          qUnit,
          modelToWorld,
          worldToModel,
        );
      }
    }
  } else if (
    isFinite(sensor.radius) &&
    sensor.portionToDisplay !==
      SensorVolumePortionToDisplay.BELOW_ELLIPSOID_HORIZON
  ) {
    SensorVolume.renderCompleteDome(sensor);
  }
}

let unitNorth = new Cartesian3();
let unitEast = new Cartesian3();
let center = new Cartesian3();
let northOffset = new Cartesian3();
let eastOffset = new Cartesian3();
let tempNorth = new Cartesian3();
let tempEast = new Cartesian3();
let north = new Cartesian3();
let south = new Cartesian3();
let right = new Cartesian3();
let left = new Cartesian3();
const cartographic = new Cartographic();
const corners = [
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3(),
];
let northEast = corners[0];
let southEast = corners[1];
let southWest = corners[2];
let northWest = corners[3];

function update2D(
  sensor,
  frameState,
  definitionChanged,
  modelMatrixChanged,
  modeChanged,
  showIntersectionChanged,
  ellipsoidSurfaceMaterialChanged,
) {
  if (sensor._qMagnitudeSquared <= 1.0) {
    return;
  }

  // Determine if geometry needs to be reevaluated.
  if (modelMatrixChanged || modeChanged) {
    if (Math.abs(sensor._unitQ.z) === 1.0) {
      unitEast = Cartesian3.clone(Cartesian3.UNIT_Y, unitEast);
    } else {
      unitEast = Cartesian3.normalize(
        Cartesian3.cross(Cartesian3.UNIT_Z, sensor._unitQ, unitEast),
        unitEast,
      );
    }
    unitNorth = Cartesian3.normalize(
      Cartesian3.cross(sensor._unitQ, unitEast, unitNorth),
      unitNorth,
    );
    center = Cartesian3.multiplyByScalar(
      sensor._q,
      1.0 / sensor._qMagnitudeSquared,
      center,
    );
    const factor = Math.sqrt(
      sensor._qMagnitudeSquaredMinusOne / sensor._qMagnitudeSquared,
    );
    eastOffset = Cartesian3.multiplyByScalar(unitEast, factor, eastOffset);
    northOffset = Cartesian3.multiplyByScalar(unitNorth, factor, northOffset);
    north = Cartesian3.add(center, northOffset, north);
    south = Cartesian3.subtract(center, northOffset, south);

    let maxLatitude = sensor._ellipsoid.cartesianToCartographic(
      north,
      cartographic,
    ).latitude;
    let minLatitude = sensor._ellipsoid.cartesianToCartographic(
      south,
      cartographic,
    ).latitude;

    const sine =
      (Math.sqrt(sensor._qMagnitudeSquaredMinusOne) * sensor._unitQ.z) /
      Math.sqrt(
        sensor._unitQ.x * sensor._unitQ.x + sensor._unitQ.y * sensor._unitQ.y,
      );

    let maxLongitude;
    let minLongitude;
    if (Math.abs(sine) < 1.0) {
      const cosine = Math.sqrt(1.0 - sine * sine);

      tempNorth = Cartesian3.multiplyByScalar(unitNorth, sine, tempNorth);
      tempEast = Cartesian3.multiplyByScalar(unitEast, cosine, tempEast);

      right = Cartesian3.add(
        center,
        Cartesian3.multiplyByScalar(
          Cartesian3.add(tempNorth, tempEast, right),
          factor,
          right,
        ),
        right,
      );
      left = Cartesian3.add(
        center,
        Cartesian3.multiplyByScalar(
          Cartesian3.subtract(tempNorth, tempEast, left),
          factor,
          left,
        ),
        left,
      );

      maxLongitude = sensor._ellipsoid.cartesianToCartographic(
        right,
        cartographic,
      ).longitude;
      minLongitude = sensor._ellipsoid.cartesianToCartographic(
        left,
        cartographic,
      ).longitude;
    } else {
      maxLongitude = CesiumMath.PI;
      minLongitude = -CesiumMath.PI;
      if (sine > 0.0) {
        maxLatitude = CesiumMath.PI_OVER_TWO;
      } else {
        minLatitude = -CesiumMath.PI_OVER_TWO;
      }
    }

    sensor._numberOfCommands2D = 0;
    if (maxLongitude < minLongitude) {
      northEast = frameState.mapProjection.project(
        Cartographic.fromRadians(maxLongitude, maxLatitude, 0.0, cartographic),
        northEast,
      );
      southEast = frameState.mapProjection.project(
        Cartographic.fromRadians(maxLongitude, minLatitude, 0.0, cartographic),
        southEast,
      );
      southWest = frameState.mapProjection.project(
        Cartographic.fromRadians(
          -CesiumMath.PI,
          minLatitude,
          0.0,
          cartographic,
        ),
        southWest,
      );
      northWest = frameState.mapProjection.project(
        Cartographic.fromRadians(
          -CesiumMath.PI,
          maxLatitude,
          0.0,
          cartographic,
        ),
        northWest,
      );

      SensorVolume.setVertices2D(
        sensor._command1Vertices2D,
        northEast,
        southEast,
        southWest,
        northWest,
        -CesiumMath.PI,
        maxLongitude,
        minLatitude,
        maxLatitude,
      );
      sensor._drawCommands2D[0].boundingVolume =
        SensorVolume.setBoundingSphere2D(
          corners,
          sensor._drawCommands2D[0].boundingVolume,
        );

      northEast = frameState.mapProjection.project(
        Cartographic.fromRadians(CesiumMath.PI, maxLatitude, 0.0, cartographic),
        northEast,
      );
      southEast = frameState.mapProjection.project(
        Cartographic.fromRadians(CesiumMath.PI, minLatitude, 0.0, cartographic),
        southEast,
      );
      southWest = frameState.mapProjection.project(
        Cartographic.fromRadians(minLongitude, minLatitude, 0.0, cartographic),
        southWest,
      );
      northWest = frameState.mapProjection.project(
        Cartographic.fromRadians(minLongitude, maxLatitude, 0.0, cartographic),
        northWest,
      );

      SensorVolume.setVertices2D(
        sensor._command2Vertices2D,
        northEast,
        southEast,
        southWest,
        northWest,
        minLongitude,
        CesiumMath.PI,
        minLatitude,
        maxLatitude,
      );
      sensor._drawCommands2D[1].boundingVolume =
        SensorVolume.setBoundingSphere2D(
          corners,
          sensor._drawCommands2D[1].boundingVolume,
        );

      sensor._vertexBuffer2D.copyFromArrayView(sensor._vertices2D.buffer);

      sensor._numberOfCommands2D = 2;
    } else {
      northEast = frameState.mapProjection.project(
        Cartographic.fromRadians(maxLongitude, maxLatitude, 0.0, cartographic),
        northEast,
      );
      southEast = frameState.mapProjection.project(
        Cartographic.fromRadians(maxLongitude, minLatitude, 0.0, cartographic),
        southEast,
      );
      southWest = frameState.mapProjection.project(
        Cartographic.fromRadians(minLongitude, minLatitude, 0.0, cartographic),
        southWest,
      );
      northWest = frameState.mapProjection.project(
        Cartographic.fromRadians(minLongitude, maxLatitude, 0.0, cartographic),
        northWest,
      );

      SensorVolume.setVertices2D(
        sensor._command1Vertices2D,
        northEast,
        southEast,
        southWest,
        northWest,
        minLongitude,
        maxLongitude,
        minLatitude,
        maxLatitude,
      );
      sensor._drawCommands2D[0].boundingVolume =
        SensorVolume.setBoundingSphere2D(
          corners,
          sensor._drawCommands2D[0].boundingVolume,
        );

      sensor._vertexBuffer2D.copyFromArrayView(sensor._command1Vertices2D, 0);

      sensor._numberOfCommands2D = 1;
    }
  }

  const context = frameState.context;

  // Manage render states.
  const ellipsoidSurfaceIsTranslucent =
    sensor._ellipsoidSurfaceMaterial.isTranslucent();
  if (sensor._ellipsoidSurfaceIsTranslucent !== ellipsoidSurfaceIsTranslucent) {
    sensor._ellipsoidSurfaceIsTranslucent = ellipsoidSurfaceIsTranslucent;
    SensorVolume.setRenderStates2D(
      sensor,
      context,
      ellipsoidSurfaceIsTranslucent,
    );
  }

  // Manage shader programs.
  if (
    definitionChanged ||
    ellipsoidSurfaceMaterialChanged ||
    showIntersectionChanged ||
    !defined(sensor._drawCommandsShaderProgram2D) ||
    !defined(sensor._pickCommandsShaderProgram2D)
  ) {
    SensorVolume.setShaderPrograms2D(
      sensor,
      context,
      SensorVolume2DVS,
      SensorVolume2DFS,
    );
  }

  const debugShowBoundingVolume = sensor.debugShowBoundingVolume;

  // Update command list.
  const commandList = frameState.commandList;
  const pass = frameState.passes;
  const length = sensor._numberOfCommands2D;
  if (pass.render && sensor.showEllipsoidSurfaces) {
    for (let i = 0; i < length; ++i) {
      const command = sensor._drawCommands2D[i];
      command.debugShowBoundingVolume = debugShowBoundingVolume;
      commandList.push(command);
    }
  }

  if (pass.pick && sensor.showEllipsoidSurfaces) {
    for (let j = 0; j < length; ++j) {
      commandList.push(sensor._pickCommands2D[j]);
    }
  }
}

let camera = new Cartesian3();
const scratchSensorPositionCartesian4 = new Cartesian4();

function update3D(
  sensor,
  frameState,
  definitionChanged,
  modelMatrixChanged,
  modeChanged,
  showIntersectionChanged,
  lateralSurfaceMaterialChanged,
  ellipsoidHorizonSurfaceMaterialChanged,
  domeSurfaceMaterialChanged,
  environmentOcclusionMaterialChanged,
  ellipsoidSurfaceMaterialChanged,
) {
  //>>includeStart('debug', pragmas.debug);
  if (!SensorVolumePortionToDisplay.validate(sensor.portionToDisplay)) {
    throw new DeveloperError(
      "sensor.portionToDisplay is required and must be valid.",
    );
  }
  //>>includeEnd('debug');

  let labelCollection = sensor._debugLabelCollection;
  if (sensor.debugShowCrossingPoints && !defined(labelCollection)) {
    labelCollection = new LabelCollection();
    sensor._debugLabelCollection = labelCollection;
  } else if (!sensor.debugShowCrossingPoints && defined(labelCollection)) {
    labelCollection.destroy();
    sensor._debugLabelCollection = undefined;
  }

  const context = frameState.context;

  // Handle property changes.
  const showThroughEllipsoidChanged =
    sensor._showThroughEllipsoid !== sensor.showThroughEllipsoid;
  sensor._showThroughEllipsoid = sensor.showThroughEllipsoid;

  const showEllipsoidSurfacesChanged =
    sensor._showEllipsoidSurfaces !== sensor.showEllipsoidSurfaces;
  sensor._showEllipsoidSurfaces = sensor.showEllipsoidSurfaces;

  const portionToDisplayChanged =
    sensor._portionToDisplay !== sensor.portionToDisplay;
  sensor._portionToDisplay = sensor.portionToDisplay;

  const environmentConstraintChanged =
    sensor._environmentConstraint !== sensor.environmentConstraint;
  sensor._environmentConstraint = sensor.environmentConstraint;

  const showEnvironmentOcclusionChanged =
    sensor._showEnvironmentOcclusion !== sensor.showEnvironmentOcclusion;
  sensor._showEnvironmentOcclusion = sensor.showEnvironmentOcclusion;

  const showEnvironmentIntersectionChanged =
    sensor._showEnvironmentIntersection !== sensor.showEnvironmentIntersection;
  sensor._showEnvironmentIntersection = sensor.showEnvironmentIntersection;

  const showViewshedChanged = sensor._showViewshed !== sensor.showViewshed;
  sensor._showViewshed = sensor.showViewshed;

  const viewshedResolutionChanged =
    sensor._viewshedResolution !== sensor.viewshedResolution;
  sensor._viewshedResolution = sensor.viewshedResolution;

  if (
    environmentConstraintChanged ||
    showViewshedChanged ||
    viewshedResolutionChanged ||
    ((sensor.environmentConstraint ||
      sensor.showEnvironmentIntersection ||
      sensor.showViewshed) &&
      !defined(sensor._shadowMap))
  ) {
    if (defined(sensor._shadowMap)) {
      sensor._shadowMap.destroy();
      sensor._shadowMap = undefined;
    }

    if (
      sensor.environmentConstraint ||
      sensor.showEnvironmentIntersection ||
      sensor.showViewshed
    ) {
      sensor._shadowMap = new ShadowMap({
        context: context,
        lightCamera: {
          frustum: new PerspectiveFrustum(),
          directionWC: Cartesian3.clone(Cartesian3.UNIT_X),
          positionWC: new Cartesian3(),
        },
        isPointLight: true,
        fromLightSource: false,
        size: sensor.viewshedResolution,
      });
      sensor._shadowMapUniforms = {
        u_shadowMapLightPositionEC: function () {
          return sensor._shadowMap._lightPositionEC;
        },
        u_shadowCubeMap: function () {
          return sensor._shadowMap._shadowMapTexture;
        },
      };
    }
  }

  if (defined(sensor._shadowMap)) {
    if (
      modelMatrixChanged ||
      environmentConstraintChanged ||
      showViewshedChanged ||
      viewshedResolutionChanged
    ) {
      const center = Matrix4.getColumn(
        sensor.modelMatrix,
        3,
        scratchSensorPositionCartesian4,
      );
      Cartesian3.fromCartesian4(
        center,
        sensor._shadowMap._lightCamera.positionWC,
      );
    }
    sensor._shadowMap._pointLightRadius = sensor._radius;
    sensor._shadowMap.debugShow = sensor.debugShowShadowMap;

    if (sensor.showEnvironmentIntersection) {
      // How much does the radius have to increased to prevent edges of the planar/conic surfaces
      // from showing intersection with the dome surface.
      sensor._shadowMap._pointLightRadius *= 1.01;
    }

    frameState.shadowMaps.push(sensor._shadowMap);
  }

  // Determine if geometry needs to be reevaluated.
  if (
    modelMatrixChanged ||
    modeChanged ||
    portionToDisplayChanged ||
    definitionChanged
  ) {
    // Update bounding spheres.
    BoundingSphere.transform(
      sensor._lateralPlanarBoundingSphere,
      sensor.modelMatrix,
      sensor._lateralPlanarBoundingSphereWC,
    );
    sensor._frontFaceColorCommand.modelMatrix = sensor.modelMatrix;
    sensor._backFaceColorCommand.modelMatrix = sensor.modelMatrix;
    sensor._pickCommand.modelMatrix = sensor.modelMatrix;

    // Update horizon crossings.
    sensor._ellipsoidHorizonSurfaceColorCommandList.length = 0;
    sensor._domeColorCommandToAdd = undefined;
    computeCrossings(sensor, context);
  }

  // Manage render states.
  const lateralSurfaceIsTranslucent =
    sensor.lateralSurfaceMaterial.isTranslucent();
  if (
    showThroughEllipsoidChanged ||
    sensor._lateralSurfaceIsTranslucent !== lateralSurfaceIsTranslucent ||
    !defined(sensor._frontFaceColorCommand.renderState)
  ) {
    sensor._lateralSurfaceIsTranslucent = lateralSurfaceIsTranslucent;
    setLateralSurfacesRenderStates3D(
      sensor,
      context,
      lateralSurfaceIsTranslucent,
    );
  }

  const ellipsoidHorizonSurfaceIsTranslucent =
    sensor._ellipsoidHorizonSurfaceMaterial.isTranslucent();
  if (
    (definitionChanged ||
      showThroughEllipsoidChanged ||
      sensor._ellipsoidHorizonSurfaceIsTranslucent !==
        ellipsoidHorizonSurfaceIsTranslucent ||
      environmentConstraintChanged) &&
    !sensor.environmentConstraint
  ) {
    sensor._ellipsoidHorizonSurfaceIsTranslucent =
      ellipsoidHorizonSurfaceIsTranslucent;
    SensorVolume.setEllipsoidHorizonSurfacesRenderStates3D(
      sensor,
      context,
      ellipsoidHorizonSurfaceIsTranslucent,
    );
  }

  const domeSurfaceIsTranslucent = sensor._domeSurfaceMaterial.isTranslucent();
  if (
    definitionChanged ||
    showThroughEllipsoidChanged ||
    sensor._domeSurfaceIsTranslucent !== domeSurfaceIsTranslucent
  ) {
    sensor._domeSurfaceIsTranslucent = domeSurfaceIsTranslucent;
    SensorVolume.setDomeSurfacesRenderStates3D(
      sensor,
      context,
      domeSurfaceIsTranslucent,
    );
  }

  // Manage shader programs.
  const primitiveType = sensor.debugShowProxyGeometry
    ? PrimitiveType.LINES
    : sensor._frontFaceColorCommand.primitiveType;
  const lateralShaderDirty =
    definitionChanged ||
    portionToDisplayChanged ||
    modeChanged ||
    showIntersectionChanged ||
    lateralSurfaceMaterialChanged ||
    environmentConstraintChanged ||
    showEnvironmentOcclusionChanged ||
    environmentOcclusionMaterialChanged ||
    showEnvironmentIntersectionChanged ||
    showThroughEllipsoidChanged;
  const ellipsoidHorizonShaderDirty =
    (definitionChanged ||
      portionToDisplayChanged ||
      modeChanged ||
      showIntersectionChanged ||
      ellipsoidHorizonSurfaceMaterialChanged ||
      environmentConstraintChanged ||
      showThroughEllipsoidChanged) &&
    !sensor.environmentConstraint;
  const domeShaderDirty =
    definitionChanged ||
    portionToDisplayChanged ||
    modeChanged ||
    showIntersectionChanged ||
    domeSurfaceMaterialChanged ||
    environmentConstraintChanged ||
    showEnvironmentOcclusionChanged ||
    environmentOcclusionMaterialChanged ||
    showEnvironmentIntersectionChanged ||
    showThroughEllipsoidChanged;
  const surfaceShadersDirty =
    lateralShaderDirty ||
    ellipsoidHorizonShaderDirty ||
    domeShaderDirty ||
    showViewshedChanged ||
    showEllipsoidSurfacesChanged ||
    ellipsoidSurfaceMaterialChanged;

  if (lateralShaderDirty) {
    let lateralSurfaceMaterial;
    if (!sensor.showEnvironmentOcclusion || !sensor.environmentConstraint) {
      lateralSurfaceMaterial = sensor._lateralSurfaceMaterial;
    } else {
      lateralSurfaceMaterial = sensor._environmentOcclusionLateralMaterial;
    }

    const frontFaceColorCommand = sensor._frontFaceColorCommand;
    const backFaceColorCommand = sensor._backFaceColorCommand;
    const vsSource = new ShaderSource({
      defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
      sources: [isZeroMatrix, PlanarSensorVolumeVS],
    });
    const fsSource = new ShaderSource({
      defines: [
        sensor.showIntersection ? "SHOW_INTERSECTION" : "",
        sensor.showThroughEllipsoid ? "SHOW_THROUGH_ELLIPSOID" : "",
        sensor.environmentConstraint ? "ENVIRONMENT_CONSTRAINT" : "",
        sensor.showEnvironmentOcclusion ? "SHOW_ENVIRONMENT_OCCLUSION" : "",
        sensor.showEnvironmentIntersection
          ? "SHOW_ENVIRONMENT_INTERSECTION"
          : "",
        SensorVolumePortionToDisplay.toString(sensor.portionToDisplay),
      ],
      sources: [
        isZeroMatrix,
        ShadersSensorVolume,
        lateralSurfaceMaterial.shaderSource,
        PlanarSensorVolumeFS,
      ],
    });
    frontFaceColorCommand.shaderProgram = ShaderProgram.replaceCache({
      context: context,
      shaderProgram: frontFaceColorCommand.shaderProgram,
      vertexShaderSource: vsSource,
      fragmentShaderSource: fsSource,
      attributeLocations: SensorVolume.attributeLocations3D,
    });
    frontFaceColorCommand.uniformMap = combine(
      sensor._uniforms,
      lateralSurfaceMaterial._uniforms,
    );

    backFaceColorCommand.shaderProgram = frontFaceColorCommand.shaderProgram;
    backFaceColorCommand.uniformMap = combine(
      sensor._uniforms,
      lateralSurfaceMaterial._uniforms,
    );
    backFaceColorCommand.uniformMap.u_normalDirection = function () {
      return -1.0;
    };

    if (sensor.environmentConstraint || sensor.showEnvironmentIntersection) {
      frontFaceColorCommand.uniformMap = combine(
        frontFaceColorCommand.uniformMap,
        sensor._shadowMapUniforms,
      );
      backFaceColorCommand.uniformMap = combine(
        backFaceColorCommand.uniformMap,
        sensor._shadowMapUniforms,
      );
    }

    if (sensor.showEnvironmentIntersection) {
      frontFaceColorCommand.uniformMap.u_environmentIntersectionWidth =
        backFaceColorCommand.uniformMap.u_environmentIntersectionWidth =
          function () {
            return sensor.environmentIntersectionWidth;
          };
      frontFaceColorCommand.uniformMap.u_environmentIntersectionColor =
        backFaceColorCommand.uniformMap.u_environmentIntersectionColor =
          function () {
            return sensor.environmentIntersectionColor;
          };
    }
  }

  camera = Cartesian3.subtract(
    sensor._ellipsoid.transformPositionToScaledSpace(
      frameState.camera.positionWC,
      camera,
    ),
    sensor._q,
    camera,
  );
  const dot = Cartesian3.dot(camera, sensor._q);
  const cameraIsInsideEllipsoidHorizonCone =
    dot / Cartesian3.magnitude(camera) <
    -Math.sqrt(sensor._qMagnitudeSquaredMinusOne);
  const cameraIsInsideDome =
    Cartesian3.magnitudeSquared(
      Cartesian3.subtract(frameState.camera.positionWC, sensor._p, camera),
    ) <
    sensor.radius * sensor.radius;

  if (ellipsoidHorizonShaderDirty) {
    const horizonVertexShader = new ShaderSource({
      defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
      sources: [isZeroMatrix, SensorVolume3DVS],
    });

    const horizonOptions = [
      sensor.debugShowProxyGeometry ? "ONLY_WIRE_FRAME" : "",
      context.fragmentDepth ? "WRITE_DEPTH" : "",
      sensor.showIntersection ? "SHOW_INTERSECTION" : "",
      sensor.showThroughEllipsoid ? "SHOW_THROUGH_ELLIPSOID" : "",
      SensorVolumePortionToDisplay.toString(sensor.portionToDisplay),
    ];

    const l = sensor._ellipsoidHorizonSurfaceColorCommands.length;
    for (let i = 0; i < l; ++i) {
      const command = sensor._ellipsoidHorizonSurfaceColorCommands[i];
      const source = sensor._ellipsoidHorizonSurfaceColorCommandsSource[i];
      command.uniformMap = combine(
        sensor._ellipsoidHorizonSurfaceMaterial._uniforms,
        command.uniformMap,
      );
      command.primitiveType = primitiveType;

      const insideShaderSource = new ShaderSource({
        defines: horizonOptions,
        sources: [
          isZeroMatrix,
          ShadersSensorVolume,
          SensorVolumeDepth,
          source,
          sensor._ellipsoidHorizonSurfaceMaterial.shaderSource,
          InfiniteCone,
          EllipsoidHorizonFacetFS,
          EllipsoidHorizonFacetInsideFS,
        ],
      });
      sensor._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[i] =
        ShaderProgram.replaceCache({
          context: context,
          shaderProgram:
            sensor._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[i],
          vertexShaderSource: horizonVertexShader,
          fragmentShaderSource: insideShaderSource,
          attributeLocations: SensorVolume.attributeLocations3D,
        });

      const outsideShaderSource = new ShaderSource({
        defines: horizonOptions,
        sources: [
          isZeroMatrix,
          ShadersSensorVolume,
          SensorVolumeDepth,
          source,
          sensor._ellipsoidHorizonSurfaceMaterial.shaderSource,
          InfiniteCone,
          EllipsoidHorizonFacetFS,
          EllipsoidHorizonFacetOutsideFS,
        ],
      });
      sensor._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[i] =
        ShaderProgram.replaceCache({
          context: context,
          shaderProgram:
            sensor._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[i],
          vertexShaderSource: horizonVertexShader,
          fragmentShaderSource: outsideShaderSource,
          attributeLocations: SensorVolume.attributeLocations3D,
        });
    }
  }

  if (!sensor.environmentConstraint) {
    const ll = sensor._ellipsoidHorizonSurfaceColorCommands.length;
    for (let ii = 0; ii < ll; ++ii) {
      const c = sensor._ellipsoidHorizonSurfaceColorCommands[ii];
      c.shaderProgram = cameraIsInsideEllipsoidHorizonCone
        ? sensor._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[ii]
        : sensor._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[ii];
    }
  }

  const domeCommand = sensor._domeColorCommand;
  if (domeShaderDirty) {
    let domeSurfaceMaterial;
    if (!sensor.showEnvironmentOcclusion || !sensor.environmentConstraint) {
      domeSurfaceMaterial = sensor._domeSurfaceMaterial;
    } else {
      domeSurfaceMaterial = sensor._environmentOcclusionDomeMaterial;
    }

    const domeSource = sensor._sensorGlsl;
    domeCommand.uniformMap = combine(
      domeSurfaceMaterial._uniforms,
      domeCommand.uniformMap,
    );
    domeCommand.primitiveType = primitiveType;

    if (sensor.environmentConstraint || sensor.showEnvironmentIntersection) {
      domeCommand.uniformMap = combine(
        domeCommand.uniformMap,
        sensor._shadowMapUniforms,
      );
    }

    if (sensor.showEnvironmentIntersection) {
      domeCommand.uniformMap.u_environmentIntersectionWidth = function () {
        return sensor.environmentIntersectionWidth;
      };
      domeCommand.uniformMap.u_environmentIntersectionColor = function () {
        return sensor.environmentIntersectionColor;
      };
    }

    const domeVertexShader = new ShaderSource({
      defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
      sources: [isZeroMatrix, SensorVolume3DVS],
    });

    const domeOptions = [
      sensor.debugShowProxyGeometry ? "ONLY_WIRE_FRAME" : "",
      context.fragmentDepth ? "WRITE_DEPTH" : "",
      sensor.showIntersection ? "SHOW_INTERSECTION" : "",
      sensor.showThroughEllipsoid ? "SHOW_THROUGH_ELLIPSOID" : "",
      sensor.environmentConstraint ? "ENVIRONMENT_CONSTRAINT" : "",
      sensor.showEnvironmentOcclusion ? "SHOW_ENVIRONMENT_OCCLUSION" : "",
      sensor.showEnvironmentIntersection ? "SHOW_ENVIRONMENT_INTERSECTION" : "",
      SensorVolumePortionToDisplay.toString(sensor.portionToDisplay),
    ];

    const insideFragmentShaderSource = new ShaderSource({
      defines: domeOptions,
      sources: [
        isZeroMatrix,
        ShadersSensorVolume,
        SensorVolumeDepth,
        domeSource,
        domeSurfaceMaterial.shaderSource,
        SensorDomeFS,
        SensorDomeInsideFS,
      ],
    });
    sensor._domeColorCommandInsideShaderProgram = ShaderProgram.replaceCache({
      context: context,
      shaderProgram: sensor._domeColorCommandInsideShaderProgram,
      vertexShaderSource: domeVertexShader,
      fragmentShaderSource: insideFragmentShaderSource,
      attributeLocations: SensorVolume.attributeLocations3D,
    });

    const outsideFragmentShaderSource = new ShaderSource({
      defines: domeOptions,
      sources: [
        isZeroMatrix,
        ShadersSensorVolume,
        SensorVolumeDepth,
        domeSource,
        domeSurfaceMaterial.shaderSource,
        SensorDomeFS,
        SensorDomeOutsideFS,
      ],
    });
    sensor._domeColorCommandOutsideShaderProgram = ShaderProgram.replaceCache({
      context: context,
      shaderProgram: sensor._domeColorCommandOutsideShaderProgram,
      vertexShaderSource: domeVertexShader,
      fragmentShaderSource: outsideFragmentShaderSource,
      attributeLocations: SensorVolume.attributeLocations3D,
    });
  }

  domeCommand.shaderProgram = cameraIsInsideDome
    ? sensor._domeColorCommandInsideShaderProgram
    : sensor._domeColorCommandOutsideShaderProgram;

  // Update command list.
  const commandList = frameState.commandList;
  const pass = frameState.passes;

  if (
    ellipsoidSurfaceIn3DSupported(context) &&
    (sensor.showEllipsoidSurfaces || sensor.showViewshed)
  ) {
    if (surfaceShadersDirty) {
      SensorVolume.updateSurface(sensor, context);
    }
    if (pass.render || pass.pick) {
      SensorVolume.addSurfaceCommand(sensor, frameState);
    }
  }

  if (pass.render) {
    const debugShowBoundingVolume = sensor.debugShowBoundingVolume;

    if (sensor.showLateralSurfaces) {
      sensor._frontFaceColorCommand.debugShowBoundingVolume =
        debugShowBoundingVolume;
      sensor._backFaceColorCommand.debugShowBoundingVolume =
        debugShowBoundingVolume;
      commandList.push(
        sensor._backFaceColorCommand,
        sensor._frontFaceColorCommand,
      );
    }

    if (sensor.showEllipsoidHorizonSurfaces && !sensor.environmentConstraint) {
      const lll = sensor._ellipsoidHorizonSurfaceColorCommandList.length;
      for (let iii = 0; iii < lll; ++iii) {
        const horizonCommand =
          sensor._ellipsoidHorizonSurfaceColorCommandList[iii];
        horizonCommand.debugShowBoundingVolume = debugShowBoundingVolume;
        commandList.push(horizonCommand);
      }
    }

    if (sensor.showDomeSurfaces) {
      const domeCommand2 = sensor._domeColorCommandToAdd;
      if (defined(domeCommand2)) {
        domeCommand2.debugShowBoundingVolume = debugShowBoundingVolume;
        commandList.push(domeCommand2);
      }
    }
  }

  if (pass.pick) {
    const pickCommand = sensor._pickCommand;

    if (
      lateralSurfaceMaterialChanged ||
      showIntersectionChanged ||
      !defined(pickCommand.shaderProgram)
    ) {
      pickCommand.uniformMap = combine(
        combine(sensor._uniforms, sensor._lateralSurfaceMaterial._uniforms),
        sensor._pickUniforms,
      );

      const pickVertexShaderSource = new ShaderSource({
        defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
        sources: [isZeroMatrix, PlanarSensorVolumeVS],
      });
      const pickShaderSource = new ShaderSource({
        defines: [
          sensor.showIntersection ? "SHOW_INTERSECTION" : "",
          sensor.showThroughEllipsoid ? "SHOW_THROUGH_ELLIPSOID" : "",
          SensorVolumePortionToDisplay.toString(sensor.portionToDisplay),
        ],
        sources: [
          isZeroMatrix,
          ShadersSensorVolume,
          sensor._lateralSurfaceMaterial.shaderSource,
          PlanarSensorVolumeFS,
        ],
        pickColorQualifier: "uniform",
      });

      pickCommand.shaderProgram = ShaderProgram.replaceCache({
        context: context,
        shaderProgram: pickCommand.shaderProgram,
        vertexShaderSource: pickVertexShaderSource,
        fragmentShaderSource: pickShaderSource,
        attributeLocations: SensorVolume.attributeLocations3D,
      });
    }

    if (sensor.showLateralSurfaces) {
      commandList.push(pickCommand);
    }
  }

  if (sensor.debugShowCrossingPoints) {
    labelCollection.modelMatrix = sensor.modelMatrix;
    labelCollection.update(frameState);
  }
}

/**
 * Called when {@link Viewer} or {@link CesiumWidget} render the scene to
 * get the draw commands needed to render this primitive.
 * <p>
 * Do not call this function directly.  This is documented just to
 * list the exceptions that may be propagated when the scene is rendered:
 * </p>
 *
 * @exception {DeveloperError} this.radius must be greater than or equal to zero.
 * @exception {DeveloperError} this.lateralSurfaceMaterial must be defined.
 */
CustomPatternSensor.prototype.update = function (frameState) {
  if (!this.show) {
    return;
  }
  //>>includeStart('debug', pragmas.debug);
  if (this.radius < 0.0) {
    throw new DeveloperError(
      "this.radius must be greater than or equal to zero.",
    );
  }
  if (!defined(this.lateralSurfaceMaterial)) {
    throw new DeveloperError("this.lateralSurfaceMaterial must be defined.");
  }
  //>>includeEnd('debug');

  const context = frameState.context;
  const idChanged = this._id !== this.id;
  this._id = this.id;

  // Initialize or update pick if necessary.
  if (frameState.passes.pick && (!defined(this._pickId) || idChanged)) {
    this._pickId = this._pickId && this._pickId.destroy();
    this._pickId = context.createPickId({
      primitive: this._pickPrimitive,
      id: this.id,
    });
  }

  // Manage materials.
  const lateralSurfaceMaterialChanged =
    this._lateralSurfaceMaterial !== this.lateralSurfaceMaterial;
  if (lateralSurfaceMaterialChanged) {
    this._lateralSurfaceMaterial = this.lateralSurfaceMaterial;
    this._lateralSurfaceMaterial.update(context);
  }

  const ellipsoidHorizonSurfaceMaterial = defined(
    this.ellipsoidHorizonSurfaceMaterial,
  )
    ? this.ellipsoidHorizonSurfaceMaterial
    : this.lateralSurfaceMaterial;
  const domeSurfaceMaterial = defined(this.domeSurfaceMaterial)
    ? this.domeSurfaceMaterial
    : this.lateralSurfaceMaterial;
  const ellipsoidSurfaceMaterial = defined(this.ellipsoidSurfaceMaterial)
    ? this.ellipsoidSurfaceMaterial
    : this.lateralSurfaceMaterial;

  const ellipsoidHorizonSurfaceMaterialChanged =
    this._ellipsoidHorizonSurfaceMaterial !== ellipsoidHorizonSurfaceMaterial;
  if (ellipsoidHorizonSurfaceMaterialChanged) {
    this._ellipsoidHorizonSurfaceMaterial = ellipsoidHorizonSurfaceMaterial;
    this._ellipsoidHorizonSurfaceMaterial.update(context);
  }

  const domeSurfaceMaterialChanged =
    this._domeSurfaceMaterial !== domeSurfaceMaterial;
  if (domeSurfaceMaterialChanged) {
    this._domeSurfaceMaterial = domeSurfaceMaterial;
    this._domeSurfaceMaterial.update(context);
  }

  const ellipsoidSurfaceMaterialChanged =
    this._ellipsoidSurfaceMaterial !== ellipsoidSurfaceMaterial;
  if (ellipsoidSurfaceMaterialChanged) {
    this._ellipsoidSurfaceMaterial = ellipsoidSurfaceMaterial;
    this._ellipsoidSurfaceMaterial.update(context);
  }

  const environmentOcclusionMaterialChanged =
    this._environmentOcclusionMaterial !== this.environmentOcclusionMaterial;
  if (environmentOcclusionMaterialChanged) {
    this._environmentOcclusionMaterial = this.environmentOcclusionMaterial;
    this._environmentOcclusionMaterial.update(context);
  }

  const showEnvironmentOcclusionChanged =
    this._showEnvironmentOcclusion !== this.showEnvironmentOcclusion;

  if (this.showEnvironmentOcclusion && this.environmentConstraint) {
    if (
      lateralSurfaceMaterialChanged ||
      environmentOcclusionMaterialChanged ||
      showEnvironmentOcclusionChanged
    ) {
      this._environmentOcclusionLateralMaterial =
        this._environmentOcclusionLateralMaterial &&
        this._environmentOcclusionLateralMaterial.destroy();
      this._environmentOcclusionLateralMaterial =
        SensorVolume.createEnvironmentOcclusionMaterial(
          this._lateralSurfaceMaterial,
          this._environmentOcclusionMaterial,
        );
      this._environmentOcclusionLateralMaterial.update(context);
    }

    if (
      domeSurfaceMaterialChanged ||
      environmentOcclusionMaterialChanged ||
      showEnvironmentOcclusionChanged
    ) {
      this._environmentOcclusionDomeMaterial =
        this._environmentOcclusionDomeMaterial &&
        this._environmentOcclusionDomeMaterial.destroy();
      this._environmentOcclusionDomeMaterial =
        SensorVolume.createEnvironmentOcclusionMaterial(
          this._domeSurfaceMaterial,
          this._environmentOcclusionMaterial,
        );
      this._environmentOcclusionDomeMaterial.update(context);
    }

    this._environmentOcclusionLateralMaterial.materials.domeMaterial.uniforms =
      this._lateralSurfaceMaterial.uniforms;
    this._environmentOcclusionLateralMaterial.materials.occludedMaterial.uniforms =
      this._environmentOcclusionMaterial.uniforms;
    this._environmentOcclusionDomeMaterial.materials.domeMaterial.uniforms =
      this._domeSurfaceMaterial.uniforms;
    this._environmentOcclusionDomeMaterial.materials.occludedMaterial.uniforms =
      this._environmentOcclusionMaterial.uniforms;
  }

  const modelMatrix = this.modelMatrix;
  const modelMatrixChanged = !Matrix4.equals(modelMatrix, this._modelMatrix);
  if (modelMatrixChanged) {
    this._modelMatrix = Matrix4.clone(modelMatrix, this._modelMatrix);
    this._inverseModelRotation = Matrix3.inverse(
      Matrix4.getMatrix3(modelMatrix, this._inverseModelRotation),
      this._inverseModelRotation,
    );
    this._p = Matrix4.getTranslation(modelMatrix, this._p);
    this._q = this._ellipsoid.transformPositionToScaledSpace(this._p, this._q);
    this._qMagnitudeSquared = Cartesian3.magnitudeSquared(this._q);
    this._qMagnitudeSquaredMinusOne = this._qMagnitudeSquared - 1.0;
    Cartesian3.normalize(this._q, this._unitQ);
    Cartesian3.multiplyByScalar(this._unitQ, -1.0, this._inverseUnitQ);
    const sineSquaredOfHalfAperture = 1.0 / this._qMagnitudeSquared;
    this._cosineAndSineOfHalfAperture.y = Math.sqrt(sineSquaredOfHalfAperture);
    const cosineSquaredOfHalfAperture = 1.0 - sineSquaredOfHalfAperture;
    this._cosineAndSineOfHalfAperture.x = Math.sqrt(
      cosineSquaredOfHalfAperture,
    );
  }

  const mode = frameState.mode;
  const modeChanged = this._mode !== mode;
  this._mode = mode;

  const showIntersectionChanged =
    this._showIntersection !== this.showIntersection;
  this._showIntersection = this.showIntersection;

  const definitionChanged = this._definitionChanged;
  if (definitionChanged) {
    this._definitionChanged = false;

    const sphericalPolygon = this._sphericalPolygon;
    const useUniformsForNormals = this._useUniformsForNormals;
    this._sensorGlsl = SphericalPolygonShaderSupport.implicitSurfaceFunction(
      sphericalPolygon,
      useUniformsForNormals,
    );
    this._sensorUniforms = useUniformsForNormals
      ? SphericalPolygonShaderSupport.uniforms(sphericalPolygon)
      : {};
  }

  if (definitionChanged || !defined(this._lateralPlanarCommandsVertexArray)) {
    initialize3D(this, context);
  }

  if (mode === SceneMode.SCENE3D) {
    update3D(
      this,
      frameState,
      definitionChanged,
      modelMatrixChanged,
      modeChanged,
      showIntersectionChanged,
      lateralSurfaceMaterialChanged,
      ellipsoidHorizonSurfaceMaterialChanged,
      domeSurfaceMaterialChanged,
      environmentOcclusionMaterialChanged,
      ellipsoidSurfaceMaterialChanged,
    );
  } else if (mode === SceneMode.SCENE2D || mode === SceneMode.COLUMBUS_VIEW) {
    if (!defined(this._drawCommands2D) || this._drawCommands2D.length === 0) {
      SensorVolume.initialize2D(
        this,
        context,
        this._ellipsoidSurfaceMaterial.isTranslucent(),
      );
    }
    update2D(
      this,
      frameState,
      definitionChanged,
      modelMatrixChanged,
      modeChanged,
      showIntersectionChanged,
      ellipsoidSurfaceMaterialChanged,
    );
  }
};

function ellipsoidSurfaceIn3DSupported(context) {
  return context.depthTexture;
}

/**
 * Determines if ellipsoid surface shading is supported in 3D mode.
 *
 * @param {Scene} scene The scene.
 * @returns {Boolean} <code>true</code> if ellipsoid surface shading is supported in 3D mode; otherwise, returns <code>false</code>
 */
CustomPatternSensor.ellipsoidSurfaceIn3DSupported = function (scene) {
  return ellipsoidSurfaceIn3DSupported(scene.context);
};

/**
 * Determines if viewshed shading is supported.
 *
 * @param {Scene} scene The scene.
 * @returns {Boolean} <code>true</code> if viewshed shading is supported; otherwise, returns <code>false</code>
 */
CustomPatternSensor.viewshedSupported = function (scene) {
  return ellipsoidSurfaceIn3DSupported(scene.context);
};

/**
 * Returns true if this object was destroyed; otherwise, false.
 * <br /><br />
 * If this object was destroyed, it should not be used; calling any function other than
 * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
 *
 * @returns {Boolean} <code>true</code> if this object was destroyed; otherwise, <code>false</code>.
 */
CustomPatternSensor.prototype.isDestroyed = function () {
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
CustomPatternSensor.prototype.destroy = function () {
  SensorVolume.destroyShaderPrograms2D(this);
  this._lateralPlanarCommandsVertexArray =
    this._lateralPlanarCommandsVertexArray &&
    this._lateralPlanarCommandsVertexArray.destroy();
  SensorVolume.destroyShaderProgram(this._frontFaceColorCommand);
  this._ellipsoidHorizonSurfaceCommandsVertexArray =
    this._ellipsoidHorizonSurfaceCommandsVertexArray &&
    this._ellipsoidHorizonSurfaceCommandsVertexArray.destroy();

  const l = this._ellipsoidHorizonSurfaceColorCommands.length;
  for (let i = 0; i < l; ++i) {
    this._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[i] =
      SensorVolume.destroyShader(
        this._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[i],
      );
    this._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[i] =
      SensorVolume.destroyShader(
        this._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[i],
      );
    this._ellipsoidHorizonSurfaceColorCommands[i].shaderProgram = undefined;
  }

  this._domeColorCommandInsideShaderProgram = SensorVolume.destroyShader(
    this._domeColorCommandInsideShaderProgram,
  );
  this._domeColorCommandOutsideShaderProgram = SensorVolume.destroyShader(
    this._domeColorCommandOutsideShaderProgram,
  );
  this._domeColorCommand.shaderProgram = undefined;
  this._domeCommandsVertexArray =
    this._domeCommandsVertexArray && this._domeCommandsVertexArray.destroy();

  this._surfaceCommandShaderProgram = SensorVolume.destroyShader(
    this._surfaceCommandShaderProgram,
  );
  this._surfaceCommandPickShaderProgram = SensorVolume.destroyShader(
    this._surfaceCommandPickShaderProgram,
  );
  this._surfaceCommandViewshedShaderProgram = SensorVolume.destroyShader(
    this._surfaceCommandViewshedShaderProgram,
  );
  this._surfaceCommandVertexArray =
    this._surfaceCommandVertexArray &&
    this._surfaceCommandVertexArray.destroy();

  SensorVolume.destroyShaderProgram(this._pickCommand);
  this._pickId = this._pickId && this._pickId.destroy();
  this._shadowMap = this._shadowMap && this._shadowMap.destroy();
  return destroyObject(this);
};

export default CustomPatternSensor;
