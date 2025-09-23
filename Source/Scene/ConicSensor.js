import {
  BoundingSphere,
  Cartesian3,
  ClassificationType,
  Color,
  Ellipsoid,
  Material,
  Matrix4,
  defined,
  Frozen,
  Math as CesiumMath,
  Cartesian2,
  Matrix3,
  SceneMode,
  combine,
  PrimitiveType,
  CullFace,
  Cartographic,
  Cartesian4,
  DeveloperError,
  LabelCollection,
  PerspectiveFrustum,
  destroyObject,
  BufferUsage,
  DrawCommand,
  Pass,
  ShaderProgram,
  Buffer,
  ShaderSource,
  ShadowMap,
  SensorVolumePortionToDisplay,
} from "@cesium/engine";
import ConicSensorInsideFS from "../Shaders/ConicSensorInsideFS.js";
import ConicSensorOutsideFS from "../Shaders/ConicSensorOutsideFS.js";
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
 * Visualizes a conical sensor volume taking into account occlusion of an ellipsoid, i.e., the globe, or the environment, i.e., terrain and models.  The sensor's
 * shape is defined by inner {@link ConicSensor#innerHalfAngle} and outer {@link ConicSensor#outerHalfAngle} cone angles,
 * minimum {@link ConicSensor#minimumClockAngle} and maximum {@link ConicSensor#maximumClockAngle} clock angles, and a radius
 * ({@link ConicSensor#radius}).  The sensor's principal direction is along the positive z-axis.  Clock
 * angles are angles around the z-axis, rotating x into y.  Cone angles are angles from the z-axis towards the xy plane.
 * The shape also depends on if the sensor intersects the ellipsoid, as shown in examples 3 and 4 below, and what
 * surfaces are shown using properties such as {@link ConicSensor#showDomeSurfaces}.
 *
 * <div align='center'>
 * <table border='0' cellpadding='5'>
 * <tr>
 * <td align='center'>Code Example 1 below<br/><img src='Images/ConicSensor.example1.png' width='250' height='188' /></td>
 * <td align='center'>Code Example 2 below<br/><img src='Images/ConicSensor.example2.png' width='250' height='188' /></td>
 * <td align='center'>Code Example 3 below<br/><img src='Images/ConicSensor.example3.png' width='250' height='188' /></td>
 * </tr>
 * </table>
 * </div>
 *
 * <p>
 * A sensor points along the local positive z-axis and is positioned and oriented using
 * {@link ConicSensor#modelMatrix}.
 * </p>
 * <p>
 * <div align='center'>
 * <img src='Images/ConicSensor.modelMatrix.png' /><br />
 * </div>
 * </p>
 *
 * @alias ConicSensor
 * @ionsdk
 * @constructor
 *
 * @param {Object} [options] Object with the following properties:
 * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid that the sensor potentially intersects.
 * @param {Boolean} [options.show=true] Determines if the sensor will be shown.
 * @param {SensorVolumePortionToDisplay} [options.portionToDisplay=SensorVolumePortionToDisplay.COMPLETE] Indicates what portion of the sensor is shown.
 * @param {Matrix4} [options.modelMatrix=Matrix4.IDENTITY] The 4x4 transformation matrix that transforms the sensor from model to world coordinates.
 * @param {Number} [options.radius=Number.POSITIVE_INFINITY] The distance from the sensor origin to any point on the sensor dome.
 * @param {Number} [options.innerHalfAngle=0.0] The half angle of the inner conical surface.
 * @param {Number} [options.outerHalfAngle=CesiumMath.PI_OVER_TWO] The half angle of the outer conical surface.
 * @param {Number} [options.minimumClockAngle=0.0] The minimum clock angle of the cone wedge.
 * @param {Number} [options.maximumClockAngle=CesiumMath.TWO_PI] The maximum clock angle of the cone wedge.
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
 * @see CustomPatternSensor
 * @see RectangularSensor
 *
 * @example
 * // Example 1. Sensor on the ground pointing straight up
 * var sensor = scene.primitives.add(new IonSdkSensors.ConicSensor({
 *   modelMatrix : Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706)),
 *   radius : 1000000.0,
 *   innerHalfAngle : Cesium.Math.toRadians(5.0),
 *   outerHalfAngle : Cesium.Math.toRadians(85.0)
 * }));
 *
 * @example
 * // Example 2. Sensor pointing straight down with its dome intersecting the ellipsoid
 * var sensor = scene.primitives.add(new IonSdkSensors.ConicSensor({
 *   modelMatrix : Cesium.Transforms.northEastDownToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 900000.0)),
 *   radius : 1000000.0,
 *   innerHalfAngle : Cesium.Math.toRadians(0.0),
 *   outerHalfAngle : Cesium.Math.toRadians(40.0),
 *   minimumClockAngle : Cesium.Math.toRadians(-30.0),
 *   maximumClockAngle : Cesium.Math.toRadians(30.0),
 *   lateralSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.StripeType),
 *   intersectionColor :  Cesium.Color.YELLOW
 * }));
 *
 * @example
 * // Example 3. Sensor with custom materials for each surface.  Switch to 2D to see the ellipsoid surface material.
 * var sensor = scene.primitives.add(new IonSdkSensors.ConicSensor({
 *   modelMatrix : Cesium.Transforms.northEastDownToFixedFrame(Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 9000000.0)),
 *   radius : 20000000.0,
 *   innerHalfAngle : Cesium.Math.toRadians(15.0),
 *   outerHalfAngle : Cesium.Math.toRadians(40.0),
 *   minimumClockAngle : Cesium.Math.toRadians(-60.0),
 *   maximumClockAngle : Cesium.Math.toRadians(60.0),
 *   lateralSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(1.0, 0.0, 0.0, 0.5) }),
 *   ellipsoidHorizonSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(0.0, 1.0, 0.0, 0.5) }),
 *   ellipsoidSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(0.0, 0.0, 1.0, 0.5) }),
 *   domeSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.ColorType, { color : new Cesium.Color(1.0, 1.0, 1.0, 0.5) })
 * }));
 */
function ConicSensor(options) {
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

  this._lateralInnerConicCommandsVertexArray = undefined;
  this._lateralInnerConicBoundingSphere = new BoundingSphere();
  this._lateralInnerConicBoundingSphereWC = new BoundingSphere();

  this._lateralOuterConicCommandsVertexArray = undefined;
  this._lateralOuterConicBoundingSphere = new BoundingSphere();
  this._lateralOuterConicBoundingSphereWC = new BoundingSphere();

  this._lateralInnerConicCommand = new DrawCommand({
    boundingVolume: this._lateralInnerConicBoundingSphereWC,
    owner: this,
  });
  this._lateralInnerConicCommandInsideShaderProgram = undefined;
  this._lateralInnerConicCommandOutsideShaderProgram = undefined;

  this._lateralInnerConicPickCommand = new DrawCommand({
    boundingVolume: this._lateralInnerConicBoundingSphereWC,
    owner: this,
    pickOnly: true,
  });

  this._lateralOuterConicCommand = new DrawCommand({
    boundingVolume: this._lateralOuterConicBoundingSphereWC,
    owner: this,
  });
  this._lateralOuterConicCommandInsideShaderProgram = undefined;
  this._lateralOuterConicCommandOutsideShaderProgram = undefined;

  this._lateralOuterConicPickCommand = new DrawCommand({
    boundingVolume: this._lateralOuterConicBoundingSphereWC,
    owner: this,
    pickOnly: true,
  });

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
   * <img src='Images/ConicSensor.modelMatrix.png' /><br />
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
   * @see {@link ConicSensor#showLateralSurfaces}
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
   * @see {@link ConicSensor#lateralSurfaceMaterial}
   */
  this.showLateralSurfaces = options.showLateralSurfaces ?? true;

  /**
   * The surface appearance of the ellipsoid horizon surfaces, i.e., the sides formed from occlusion due to the ellipsoid hoirzon.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
   * {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}.
   * <p>
   * When <code>undefined</code>, {@link ConicSensor#lateralSurfaceMaterial} is used.
   * </p>
   *
   * @type {Material}
   * @default undefined
   *
   * @see {@link ConicSensor#showEllipsoidHorizonSurfaces}
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
   * @see {@link ConicSensor#ellipsoidHorizonSurfaceMaterial}
   */
  this.showEllipsoidHorizonSurfaces =
    options.showEllipsoidHorizonSurfaces ?? true;

  /**
   * The appearance of the ellipsoid surface where the sensor intersects.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
   * <a href='https://github.com/CesiumGS/cesium/wiki/Fabric'>Fabric</a>.
   * <p>
   * When <code>undefined</code>, {@link ConicSensor#lateralSurfaceMaterial} is used.
   * </p>
   *
   * @type {Material}
   * @default undefined
   *
   * @see {@link ConicSensor#showEllipsoidSurfaces}
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
   * @see {@link ConicSensor#ellipsoidSurfaceMaterial}
   */
  this.showEllipsoidSurfaces = options.showEllipsoidSurfaces ?? true;
  this._showEllipsoidSurfaces = this.showEllipsoidSurfaces;

  /**
   * The surface appearance of the sensor dome.  This can be one of several built-in {@link Material} objects or a custom material, scripted with
   * {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}.
   * <p>
   * When <code>undefined</code>, {@link ConicSensor#lateralSurfaceMaterial} is used.
   * </p>
   *
   * @type {Material}
   * @default undefined
   *
   * @see {@link ConicSensor#showDomeSurfaces}
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
   * @see {@link ConicSensor#domeSurfaceMaterial}
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
   * @default true
   *
   * @see ConicSensor#intersectionColor
   * @see ConicSensor#intersectionWidth
   */
  this.showIntersection = options.showIntersection ?? true;
  this._showIntersection = this.showIntersection;

  /**
   * The color of the polyline where the sensor intersects the ellipsoid.
   *
   * @type {Color}
   * @default {@link Color.WHITE}
   *
   * @see ConicSensor#showIntersection
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
   * @see ConicSensor#showIntersection
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
   * When <code>true</code>, the portion of the sensor occluded by the environment will be drawn with {@link ConicSensor#environmentOcclusionMaterial}.
   * {@link ConicSensor#environmentConstraint} must also be <code>true</code>.
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
   * @see ConicSensor#viewshedVisibleColor
   * @see ConicSensor#viewshedOccludedColor
   * @see ConicSensor#viewshedResolution
   *
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

  this._updatePickCommands = true;
  this._definitionChanged = true;
  this._hasInnerCone = undefined;
  this._hasOuterCone = undefined;
  this._isPartialCone = undefined;

  this._radius = options.radius ?? Number.POSITIVE_INFINITY;

  this._outerHalfAngle = options.outerHalfAngle ?? CesiumMath.PI_OVER_TWO;

  this._innerHalfAngle = options.innerHalfAngle ?? 0.0;

  this._maximumClockAngle = options.maximumClockAngle ?? CesiumMath.TWO_PI;

  this._minimumClockAngle = options.minimumClockAngle ?? 0.0;

  this._cosineOfInnerHalfAngle = undefined;
  this._cosineOfOuterHalfAngle = undefined;
  this._cosineAndSineOfInnerHalfAngle = new Cartesian2();
  this._cosineAndSineOfOuterHalfAngle = new Cartesian2();
  this._minimumClockAngleSurfaceNormal = new Cartesian3();
  this._minimumClockAngleSurfaceFacetBisector = new Cartesian3();
  this._minimumClockAngleSurfaceFacetBisectorMagnitudeSquared = 0.0;
  this._maximumClockAngleSurfaceNormal = new Cartesian3();
  this._maximumClockAngleSurfaceFacetBisector = new Cartesian3();
  this._maximumClockAngleSurfaceFacetBisectorMagnitudeSquared = 0.0;

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

  this._clockUniforms = {
    u_minimumClockAngleSurfaceNormal: function () {
      return that._minimumClockAngleSurfaceNormal;
    },
    u_maximumClockAngleSurfaceNormal: function () {
      return that._maximumClockAngleSurfaceNormal;
    },
  };

  this._coneUniforms = {
    u_cosineOfInnerHalfAngle: function () {
      return that._cosineOfInnerHalfAngle;
    },
    u_cosineOfOuterHalfAngle: function () {
      return that._cosineOfOuterHalfAngle;
    },
  };

  this._innerConeUniform = {
    u_cosineAndSineOfConeAngle: function () {
      return that._cosineAndSineOfInnerHalfAngle;
    },
  };

  this._outerConeUniform = {
    u_cosineAndSineOfConeAngle: function () {
      return that._cosineAndSineOfOuterHalfAngle;
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

Object.defineProperties(ConicSensor.prototype, {
  /**
   * The distance from the sensor origin to any point on the sensor dome.  Informally, this is the length of the sensor.
   * @memberof ConicSensor.prototype
   *
   * @type {Number}
   *
   * @default Number.POSITIVE_INFINITY
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
   * @memberof ConicSensor.prototype
   *
   * @type {Ellipsoid}
   * @readonly
   *
   * @default {@link Ellipsoid.WGS84}
   */
  ellipsoid: {
    get: function () {
      return this._ellipsoid;
    },
  },

  /**
   * Gets or sets the semi-aperture of the outer cone in radians.
   * This half angle is measured from the positive z-axis of the sensor.
   * @memberof ConicSensor.prototype
   *
   * @type {Number}
   * @default {@link CesiumMath.PI_OVER_TWO}
   */
  outerHalfAngle: {
    get: function () {
      return this._outerHalfAngle;
    },
    set: function (value) {
      if (this._outerHalfAngle !== value) {
        this._outerHalfAngle = value;
        this._definitionChanged = true;
      }
    },
  },

  /**
   * Gets or sets the semi-aperture of the inner cone in radians.
   * This half angle is measured from the positive z-axis of the sensor.
   * @memberof ConicSensor.prototype
   *
   * @type {Number}
   * @default 0.0
   */
  innerHalfAngle: {
    get: function () {
      return this._innerHalfAngle;
    },
    set: function (value) {
      if (this._innerHalfAngle !== value) {
        this._innerHalfAngle = value;
        this._definitionChanged = true;
      }
    },
  },

  /**
   * Gets or sets the final clock angle of the cone wedge in radians.
   * This angle is measured in the xy-plane from the positive x-axis toward the positive y-axis.
   * @memberof ConicSensor.prototype
   *
   * @type {Number}
   * @default {@link CesiumMath.TWO_PI}
   */
  maximumClockAngle: {
    get: function () {
      return this._maximumClockAngle;
    },
    set: function (value) {
      if (this._maximumClockAngle !== value) {
        this._maximumClockAngle = value;
        this._definitionChanged = true;
      }
    },
  },

  /**
   * Gets or sets the initial clock angle of the cone wedge in radians.
   * This angle is measured in the xy-plane from the positive x-axis toward the positive y-axis.
   * @memberof ConicSensor.prototype
   *
   * @type {Number}
   * @default 0.0
   */
  minimumClockAngle: {
    get: function () {
      return this._minimumClockAngle;
    },
    set: function (value) {
      if (this._minimumClockAngle !== value) {
        this._minimumClockAngle = value;
        this._definitionChanged = true;
      }
    },
  },
});

function getSensorSurfaceFunction(sensor, checkCones) {
  checkCones &= sensor._hasInnerCone || sensor._hasOuterCone;
  let source = "\n";

  if (checkCones) {
    source += "uniform float u_cosineOfOuterHalfAngle;\n";
    if (sensor._hasInnerCone) {
      source += "uniform float u_cosineOfInnerHalfAngle;\n";
    }
  }
  if (sensor._isPartialCone) {
    source += "uniform vec3 u_maximumClockAngleSurfaceNormal;\n";
    source += "uniform vec3 u_minimumClockAngleSurfaceNormal;\n";
  }
  source += "\n";
  source += "float sensorSurfaceFunction(vec3 pointMC)\n";
  source += "{\n";
  source += "\tvec3 direction = normalize(pointMC);\n";
  if (checkCones) {
    if (sensor._hasInnerCone) {
      source += "\tfloat value = direction.z - u_cosineOfInnerHalfAngle;\n";
      if (sensor._hasOuterCone) {
        source +=
          "\tvalue = max(value, u_cosineOfOuterHalfAngle - direction.z);\n";
      }
    } else {
      source += "\tfloat value = u_cosineOfOuterHalfAngle - direction.z;\n";
    }
  }
  if (sensor._isPartialCone) {
    const span = sensor._maximumClockAngle - sensor._minimumClockAngle;
    if (span < Math.PI) {
      source +=
        "\tfloat wedge = max(dot(direction, u_maximumClockAngleSurfaceNormal), dot(direction, u_minimumClockAngleSurfaceNormal));\n";
    } else if (span > Math.PI) {
      source +=
        "\tfloat wedge = min(dot(direction, u_maximumClockAngleSurfaceNormal), dot(direction, u_minimumClockAngleSurfaceNormal));\n";
    } else {
      source +=
        "\tfloat wedge = dot(direction, u_minimumClockAngleSurfaceNormal);\n";
    }
    if (checkCones) {
      source += "\tvalue = max(value, wedge);\n";
    } else {
      source += "\tfloat value = wedge;\n";
    }
  }
  if (!checkCones && !sensor._isPartialCone) {
    source += "\treturn -1.0;\n";
  } else {
    source += "\treturn value;\n";
  }
  source += "}\n";
  return source;
}

function isWithinCones(sensor, direction) {
  const outerValue = sensor._cosineOfOuterHalfAngle - direction.z;
  if (sensor._hasInnerCone) {
    const innerValue = direction.z - sensor._cosineOfInnerHalfAngle;
    return Math.max(innerValue, outerValue) < 0.0;
  }
  return outerValue < 0.0;
}

function isWithinWedge(sensor, direction) {
  const dotWithMinimumSurface = Cartesian3.dot(
    direction,
    sensor._minimumClockAngleSurfaceNormal,
  );
  const dotWithMaximumSurface = Cartesian3.dot(
    direction,
    sensor._maximumClockAngleSurfaceNormal,
  );
  const span = sensor._maximumClockAngle - sensor._minimumClockAngle;
  if (span < Math.PI) {
    return Math.max(dotWithMinimumSurface, dotWithMaximumSurface) < 0.0;
  } else if (span > Math.PI) {
    return Math.min(dotWithMinimumSurface, dotWithMaximumSurface) < 0.0;
  }
  return dotWithMinimumSurface < 0.0;
}

function packTriangle(first, second, third, normal, array, index) {
  Cartesian3.pack(first, array, index);
  index += 3;
  Cartesian3.pack(normal, array, index);
  index += 3;
  Cartesian3.pack(second, array, index);
  index += 3;
  Cartesian3.pack(normal, array, index);
  index += 3;
  Cartesian3.pack(third, array, index);
  index += 3;
  Cartesian3.pack(normal, array, index);
  index += 3;
  return index;
}

let direction = new Cartesian3();
let leftNormal = new Cartesian3();
let rightNormal = new Cartesian3();
const innerVertexScratch1 = new Cartesian3();
const outerVertexScratch1 = new Cartesian3();
const innerVertexScratch2 = new Cartesian3();
const outerVertexScratch2 = new Cartesian3();

function computePlanarVertices(
  innerConeAngle,
  outerConeAngle,
  initialClockAngle,
  finalClockAngle,
  radius,
  numberOfDivisionsOfFullCircle,
) {
  const step = CesiumMath.TWO_PI / numberOfDivisionsOfFullCircle;
  const coneSpan = outerConeAngle - innerConeAngle;
  const steps = coneSpan / step;
  const wedges = steps % 1.0 !== 0.0 ? Math.ceil(steps) : Math.ceil(steps) + 1;

  const factor = radius / Math.cos(Math.PI / numberOfDivisionsOfFullCircle);

  const numberOfFloatsPerTriangle = 3 * SensorVolume.numberOfFloatsPerVertex3D;
  const numberOfTriangles = wedges * 2;
  const vertices = new Float32Array(
    numberOfTriangles * numberOfFloatsPerTriangle,
  );

  // Set up references to scratch variables.
  let lastLeft = innerVertexScratch1;
  let currentLeft = outerVertexScratch1;
  let lastRight = innerVertexScratch2;
  let currentRight = outerVertexScratch2;

  let index = 0;

  const cosineInitialClock = Math.cos(initialClockAngle);
  const sineInitialClock = Math.sin(initialClockAngle);
  const cosineFinalClock = Math.cos(finalClockAngle);
  const sineFinalClock = Math.sin(finalClockAngle);

  leftNormal = Cartesian3.fromElements(
    sineInitialClock,
    -cosineInitialClock,
    0.0,
    leftNormal,
  );
  rightNormal = Cartesian3.fromElements(
    -sineInitialClock,
    cosineInitialClock,
    0.0,
    rightNormal,
  );

  let sineConeWithFactor = factor * Math.sin(innerConeAngle);
  let cosineConeWithFactor = factor * Math.cos(innerConeAngle);
  lastLeft = Cartesian3.fromElements(
    cosineInitialClock * sineConeWithFactor,
    sineInitialClock * sineConeWithFactor,
    cosineConeWithFactor,
    lastLeft,
  );
  lastRight = Cartesian3.fromElements(
    cosineFinalClock * sineConeWithFactor,
    sineFinalClock * sineConeWithFactor,
    cosineConeWithFactor,
    lastRight,
  );

  let cone =
    wedges > 1
      ? innerConeAngle + (((steps % 1.0) + 1.0) * step) / 2.0
      : outerConeAngle;
  for (let i = 0; i < wedges; ++i) {
    sineConeWithFactor = factor * Math.sin(cone);
    cosineConeWithFactor = factor * Math.cos(cone);
    currentLeft = Cartesian3.fromElements(
      cosineInitialClock * sineConeWithFactor,
      sineInitialClock * sineConeWithFactor,
      cosineConeWithFactor,
      currentLeft,
    );
    currentRight = Cartesian3.fromElements(
      cosineFinalClock * sineConeWithFactor,
      sineFinalClock * sineConeWithFactor,
      cosineConeWithFactor,
      currentRight,
    );

    index = packTriangle(
      Cartesian3.ZERO,
      currentLeft,
      lastLeft,
      leftNormal,
      vertices,
      index,
    );
    index = packTriangle(
      Cartesian3.ZERO,
      lastRight,
      currentRight,
      rightNormal,
      vertices,
      index,
    );

    // Swap scratch references.
    let temp = lastLeft;
    lastLeft = currentLeft;
    currentLeft = temp;
    temp = lastRight;
    lastRight = currentRight;
    currentRight = temp;

    cone = i + 1 === wedges - 1 ? outerConeAngle : cone + step;
  }

  return vertices;
}

const innerVertexScratch3 = new Cartesian3();
const innerVertexScratch4 = new Cartesian3();
const outerVertexScratch3 = new Cartesian3();
const outerVertexScratch4 = new Cartesian3();
const negativeUnitZ = Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3());
const difference1 = new Cartesian3();
const difference2 = new Cartesian3();
let initialClockDirection = new Cartesian2();
let finalClockDirection = new Cartesian2();
let clockBisector = new Cartesian2();
let tempClockDirection = new Cartesian2();
let normal = new Cartesian3();

function computeBoundingVertices(
  domeOnly,
  innerConeAngle,
  outerConeAngle,
  initialClockAngle,
  finalClockAngle,
  radius,
  numberOfDivisionsOfFullCircle,
  hasInnerCone,
  isPartialCone,
) {
  const step = CesiumMath.TWO_PI / numberOfDivisionsOfFullCircle;
  const clockSpan = finalClockAngle - initialClockAngle;
  const steps = isPartialCone
    ? clockSpan / step
    : numberOfDivisionsOfFullCircle;
  const wedges = steps % 1.0 !== 0.0 ? Math.ceil(steps) : Math.ceil(steps) + 1;

  let zFront = radius * Math.cos(outerConeAngle);
  let zBack = radius * Math.cos(innerConeAngle);

  let wOuter;
  let wInner;
  if (outerConeAngle < CesiumMath.PI_OVER_TWO) {
    wInner = radius * Math.sin(innerConeAngle);
    wOuter =
      (radius * Math.sin(outerConeAngle)) /
      Math.cos(Math.PI / numberOfDivisionsOfFullCircle);
  } else if (innerConeAngle < CesiumMath.PI_OVER_TWO) {
    wInner =
      radius * Math.min(Math.sin(innerConeAngle), Math.sin(outerConeAngle));
    wOuter = radius / Math.cos(Math.PI / numberOfDivisionsOfFullCircle);
  } else {
    wInner = radius * Math.sin(outerConeAngle);
    wOuter =
      (radius * Math.sin(innerConeAngle)) /
      Math.cos(Math.PI / numberOfDivisionsOfFullCircle);
  }

  if (!domeOnly) {
    wInner = CesiumMath.EPSILON2;
    zFront = Math.min(zFront, 0.0);
    zBack = Math.max(zBack, 0.0);
  }

  const numberOfFloatsPerTriangle = 3 * SensorVolume.numberOfFloatsPerVertex3D;
  const numberOfTriangles =
    wedges *
      (isPartialCone && clockSpan < Math.PI ? (hasInnerCone ? 6 : 4) : 4) +
    (isPartialCone ? (clockSpan < Math.PI ? (hasInnerCone ? 6 : 4) : 4) : 0);
  const vertices = new Float32Array(
    numberOfTriangles * numberOfFloatsPerTriangle,
  );

  // Set up references to scratch variables.
  let innerFrontLeft = innerVertexScratch1;
  let innerFrontRight = innerVertexScratch2;
  let innerBackLeft = innerVertexScratch3;
  let innerBackRight = innerVertexScratch4;
  let outerFrontLeft = outerVertexScratch1;
  let outerFrontRight = outerVertexScratch2;
  let outerBackLeft = outerVertexScratch3;
  let outerBackRight = outerVertexScratch4;

  let cosineClock = Math.cos(finalClockAngle);
  let sineClock = Math.sin(finalClockAngle);

  finalClockDirection = Cartesian2.fromElements(
    cosineClock,
    sineClock,
    finalClockDirection,
  );

  cosineClock = Math.cos(initialClockAngle);
  sineClock = Math.sin(initialClockAngle);

  initialClockDirection = Cartesian2.fromElements(
    cosineClock,
    sineClock,
    initialClockDirection,
  );

  clockBisector = Cartesian2.divideByScalar(
    Cartesian2.add(initialClockDirection, finalClockDirection, clockBisector),
    2.0,
    clockBisector,
  );
  const bisectorMagnitudeSquared = Cartesian2.magnitudeSquared(clockBisector);

  tempClockDirection = Cartesian2.fromElements(
    cosineClock,
    sineClock,
    tempClockDirection,
  );
  let factor =
    clockSpan < Math.PI && hasInnerCone
      ? (wInner * bisectorMagnitudeSquared) /
        Cartesian2.dot(tempClockDirection, clockBisector)
      : 0.0;

  innerFrontRight = Cartesian3.fromElements(
    cosineClock * factor,
    sineClock * factor,
    zFront,
    innerFrontRight,
  );
  innerBackRight = Cartesian3.fromElements(
    cosineClock * factor,
    sineClock * factor,
    zBack,
    innerBackRight,
  );
  outerFrontRight = Cartesian3.fromElements(
    cosineClock * wOuter,
    sineClock * wOuter,
    zFront,
    outerFrontRight,
  );
  outerBackRight = Cartesian3.fromElements(
    cosineClock * wOuter,
    sineClock * wOuter,
    zBack,
    outerBackRight,
  );

  let index = 0;

  // Right side.
  if (isPartialCone && clockSpan < Math.PI) {
    normal = Cartesian3.fromElements(
      Math.sin(initialClockAngle),
      -Math.cos(initialClockAngle),
      0.0,
      normal,
    );
    index = packTriangle(
      innerFrontRight,
      outerFrontRight,
      outerBackRight,
      normal,
      vertices,
      index,
    );
    index = packTriangle(
      outerBackRight,
      innerBackRight,
      innerFrontRight,
      normal,
      vertices,
      index,
    );
  }

  let clock = initialClockAngle + (((steps % 1.0) + 1.0) * step) / 2.0;
  for (let i = 0; i < wedges; ++i) {
    cosineClock = Math.cos(clock);
    sineClock = Math.sin(clock);

    tempClockDirection = Cartesian2.fromElements(
      cosineClock,
      sineClock,
      tempClockDirection,
    );
    factor =
      clockSpan < Math.PI && hasInnerCone
        ? (wInner * bisectorMagnitudeSquared) /
          Cartesian2.dot(tempClockDirection, clockBisector)
        : 0.0;

    innerFrontLeft = Cartesian3.fromElements(
      cosineClock * factor,
      sineClock * factor,
      zFront,
      innerFrontLeft,
    );
    innerBackLeft = Cartesian3.fromElements(
      cosineClock * factor,
      sineClock * factor,
      zBack,
      innerBackLeft,
    );
    outerFrontLeft = Cartesian3.fromElements(
      cosineClock * wOuter,
      sineClock * wOuter,
      zFront,
      outerFrontLeft,
    );
    outerBackLeft = Cartesian3.fromElements(
      cosineClock * wOuter,
      sineClock * wOuter,
      zBack,
      outerBackLeft,
    );

    // Front side.
    if (clockSpan < Math.PI && hasInnerCone) {
      index = packTriangle(
        outerFrontLeft,
        outerFrontRight,
        innerFrontRight,
        negativeUnitZ,
        vertices,
        index,
      );
      index = packTriangle(
        innerFrontRight,
        innerFrontLeft,
        outerFrontLeft,
        negativeUnitZ,
        vertices,
        index,
      );
    } else {
      index = packTriangle(
        outerFrontLeft,
        outerFrontRight,
        innerFrontRight,
        negativeUnitZ,
        vertices,
        index,
      );
    }

    // Outer side.
    normal = Cartesian3.normalize(
      Cartesian3.cross(
        Cartesian3.subtract(outerBackLeft, outerFrontLeft, difference1),
        Cartesian3.subtract(outerFrontRight, outerFrontLeft, difference2),
        normal,
      ),
      normal,
    );
    index = packTriangle(
      outerFrontRight,
      outerFrontLeft,
      outerBackLeft,
      normal,
      vertices,
      index,
    );
    index = packTriangle(
      outerBackLeft,
      outerBackRight,
      outerFrontRight,
      normal,
      vertices,
      index,
    );

    // Back side.
    if (clockSpan < Math.PI && hasInnerCone) {
      index = packTriangle(
        innerBackRight,
        outerBackRight,
        outerBackLeft,
        Cartesian3.UNIT_Z,
        vertices,
        index,
      );
      index = packTriangle(
        outerBackLeft,
        innerBackLeft,
        innerBackRight,
        Cartesian3.UNIT_Z,
        vertices,
        index,
      );
    } else {
      index = packTriangle(
        outerBackRight,
        outerBackLeft,
        innerBackRight,
        Cartesian3.UNIT_Z,
        vertices,
        index,
      );
    }

    // Swap scratch references.
    let temp = innerFrontRight;
    innerFrontRight = innerFrontLeft;
    innerFrontLeft = temp;
    temp = innerBackRight;
    innerBackRight = innerBackLeft;
    innerBackLeft = temp;
    temp = outerFrontRight;
    outerFrontRight = outerFrontLeft;
    outerFrontLeft = temp;
    temp = outerBackRight;
    outerBackRight = outerBackLeft;
    outerBackLeft = temp;

    clock = i + 1 === wedges - 1 ? finalClockAngle : clock + step;
  }

  // Left side (but use "Right" since swap occured).
  if (isPartialCone && clockSpan < Math.PI) {
    normal = Cartesian3.fromElements(
      -Math.sin(finalClockAngle),
      Math.cos(finalClockAngle),
      0.0,
      normal,
    );
    index = packTriangle(
      outerBackRight,
      outerFrontRight,
      innerFrontRight,
      normal,
      vertices,
      index,
    );
    index = packTriangle(
      innerFrontRight,
      innerBackRight,
      outerBackRight,
      normal,
      vertices,
      index,
    );
  }

  // Inner side.
  if (isPartialCone) {
    cosineClock = Math.cos(initialClockAngle);
    sineClock = Math.sin(initialClockAngle);

    tempClockDirection = Cartesian2.fromElements(
      cosineClock,
      sineClock,
      tempClockDirection,
    );
    factor =
      clockSpan < Math.PI && hasInnerCone
        ? (wInner * bisectorMagnitudeSquared) /
          Cartesian2.dot(tempClockDirection, clockBisector)
        : 0.0;

    innerFrontLeft = Cartesian3.fromElements(
      cosineClock * factor,
      sineClock * factor,
      zFront,
      innerFrontLeft,
    );
    innerBackLeft = Cartesian3.fromElements(
      cosineClock * factor,
      sineClock * factor,
      zBack,
      innerBackLeft,
    );

    if (clockSpan >= Math.PI) {
      outerFrontLeft = Cartesian3.fromElements(
        cosineClock * wOuter,
        sineClock * wOuter,
        zFront,
        outerFrontLeft,
      );
      outerBackLeft = Cartesian3.fromElements(
        cosineClock * wOuter,
        sineClock * wOuter,
        zBack,
        outerBackLeft,
      );
      normal = Cartesian3.normalize(
        Cartesian3.cross(
          Cartesian3.subtract(outerBackLeft, outerFrontLeft, difference1),
          Cartesian3.subtract(outerFrontRight, outerFrontLeft, difference2),
          normal,
        ),
        normal,
      );
      index = packTriangle(
        outerFrontRight,
        outerFrontLeft,
        outerBackLeft,
        normal,
        vertices,
        index,
      );
      index = packTriangle(
        outerBackLeft,
        outerBackRight,
        outerFrontRight,
        normal,
        vertices,
        index,
      );

      index = packTriangle(
        innerBackRight,
        outerBackRight,
        outerBackLeft,
        Cartesian3.UNIT_Z,
        vertices,
        index,
      );
      index = packTriangle(
        innerFrontLeft,
        outerFrontLeft,
        outerFrontRight,
        negativeUnitZ,
        vertices,
        index,
      );
    } else if (hasInnerCone) {
      normal = Cartesian3.normalize(
        Cartesian3.cross(
          Cartesian3.subtract(innerFrontRight, innerFrontLeft, difference1),
          Cartesian3.subtract(innerBackLeft, innerFrontLeft, difference2),
          normal,
        ),
        normal,
      );
      index = packTriangle(
        innerBackRight,
        innerFrontRight,
        innerFrontLeft,
        normal,
        vertices,
        index,
      );
      index = packTriangle(
        innerFrontLeft,
        innerBackLeft,
        innerBackRight,
        normal,
        vertices,
        index,
      );
    }
  }

  return vertices;
}

function initializeDomeCommand(
  sensor,
  context,
  primitiveType,
  innerConeAngle,
  outerConeAngle,
  initialClockAngle,
  finalClockAngle,
  radius,
  numberOfDivisionsOfFullCircle,
  hasInnerCone,
  isPartialCone,
  uniforms,
) {
  const vertices = computeBoundingVertices(
    true,
    innerConeAngle,
    outerConeAngle,
    initialClockAngle,
    finalClockAngle,
    radius,
    numberOfDivisionsOfFullCircle,
    hasInnerCone,
    isPartialCone,
  );
  sensor._domeCommandsVertices = vertices;
  const domeBuffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: vertices,
    usage: BufferUsage.STATIC_DRAW,
  });
  sensor._domeCommandsBuffer = domeBuffer;
  const domeVertexArray = SensorVolume.makeVertexArray3D(
    sensor,
    context,
    domeBuffer,
  );
  sensor._domeCommandsVertexArray = domeVertexArray;

  const command = sensor._domeColorCommand;

  const boundingVolume = BoundingSphere.fromVertices(
    vertices,
    undefined,
    SensorVolume.numberOfFloatsPerVertex3D,
    sensor._completeDomeBoundingVolumeMC,
  );
  command.uniformMap = combine(
    combine(sensor._uniforms, sensor._domeSurfaceMaterial._uniforms),
    uniforms,
  );
  command.boundingVolume = BoundingSphere.transform(
    boundingVolume,
    sensor.modelMatrix,
    command.boundingVolume,
  );
  command.modelMatrix = sensor.modelMatrix;

  sensor._domeCommandsBuffer.copyFromArrayView(vertices, 0);

  command.primitiveType = primitiveType;
  command.owner = sensor;
  command.vertexArray = domeVertexArray;
}

function initializeSurfaceCommand(
  sensor,
  context,
  primitiveType,
  innerConeAngle,
  outerConeAngle,
  initialClockAngle,
  finalClockAngle,
  radius,
  numberOfDivisionsOfFullCircle,
  hasInnerCone,
  isPartialCone,
) {
  if (defined(sensor._surfaceCommandVertexArray)) {
    sensor._surfaceCommandVertexArray.destroy();
  }

  const vertices = computeBoundingVertices(
    false,
    innerConeAngle,
    outerConeAngle,
    initialClockAngle,
    finalClockAngle,
    radius,
    numberOfDivisionsOfFullCircle,
    hasInnerCone,
    isPartialCone,
  );
  BoundingSphere.fromVertices(
    vertices,
    undefined,
    SensorVolume.numberOfFloatsPerVertex3D,
    sensor._surfaceBoundingVolumeMC,
  );

  const surfaceBuffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: vertices,
    usage: BufferUsage.STATIC_DRAW,
  });
  const surfaceVertexArray = SensorVolume.makeVertexArray3D(
    sensor,
    context,
    surfaceBuffer,
  );
  sensor._surfaceCommandVertexArray = surfaceVertexArray;

  const command = sensor._surfaceCommand;
  command.primitiveType = primitiveType;
  command.owner = sensor;
  command.vertexArray = surfaceVertexArray;
}

function computeConeBoundingVertices(
  outerConeAngle,
  initialClockAngle,
  finalClockAngle,
  radius,
  numberOfDivisionsOfFullCircle,
  isPartialCone,
) {
  let step = CesiumMath.TWO_PI / numberOfDivisionsOfFullCircle;
  const clockSpan = finalClockAngle - initialClockAngle;
  const steps = isPartialCone
    ? clockSpan / step
    : numberOfDivisionsOfFullCircle;
  const wedges = steps % 1.0 !== 0.0 ? Math.ceil(steps) : Math.ceil(steps) + 1;

  if (outerConeAngle > CesiumMath.PI_OVER_TWO) {
    const angle = initialClockAngle;
    initialClockAngle = finalClockAngle;
    finalClockAngle = angle;
    step = -step;
  }

  const z = radius * Math.cos(outerConeAngle);

  const wInner = radius * Math.sin(outerConeAngle);
  const wOuter = wInner / Math.cos(Math.PI / numberOfDivisionsOfFullCircle);

  const numberOfFloatsPerTriangle = 3 * SensorVolume.numberOfFloatsPerVertex3D;
  const numberOfTriangles =
    wedges * (isPartialCone && clockSpan < Math.PI ? 3 : 2) +
    (isPartialCone ? (clockSpan < Math.PI ? 3 : 2) : 0);
  const vertices = new Float32Array(
    numberOfTriangles * numberOfFloatsPerTriangle,
  );

  // Set up references to scratch variables.
  let innerLeft = innerVertexScratch1;
  let innerRight = innerVertexScratch2;
  let outerLeft = outerVertexScratch1;
  let outerRight = outerVertexScratch2;

  let cosineClock = Math.cos(finalClockAngle);
  let sineClock = Math.sin(finalClockAngle);

  finalClockDirection = Cartesian2.fromElements(
    cosineClock,
    sineClock,
    finalClockDirection,
  );

  cosineClock = Math.cos(initialClockAngle);
  sineClock = Math.sin(initialClockAngle);

  initialClockDirection = Cartesian2.fromElements(
    cosineClock,
    sineClock,
    initialClockDirection,
  );

  clockBisector = Cartesian2.divideByScalar(
    Cartesian2.add(initialClockDirection, finalClockDirection, clockBisector),
    2.0,
    clockBisector,
  );
  const bisectorMagnitudeSquared = Cartesian2.magnitudeSquared(clockBisector);

  tempClockDirection = Cartesian2.fromElements(
    cosineClock,
    sineClock,
    tempClockDirection,
  );
  let factor =
    clockSpan < Math.PI
      ? (wInner * bisectorMagnitudeSquared) /
        Cartesian2.dot(tempClockDirection, clockBisector)
      : 0.0;

  innerRight = Cartesian3.fromElements(
    cosineClock * factor,
    sineClock * factor,
    z,
    innerRight,
  );
  outerRight = Cartesian3.fromElements(
    cosineClock * wOuter,
    sineClock * wOuter,
    z,
    outerRight,
  );

  let index = 0;

  // Right side.
  if (isPartialCone && clockSpan < Math.PI) {
    normal = Cartesian3.fromElements(
      Math.sin(initialClockAngle),
      -Math.cos(initialClockAngle),
      0.0,
      normal,
    );
    index = packTriangle(
      Cartesian3.ZERO,
      outerRight,
      innerRight,
      normal,
      vertices,
      index,
    );
  }

  let clock = initialClockAngle + (((steps % 1.0) + 1.0) * step) / 2.0;
  for (let i = 0; i < wedges; ++i) {
    cosineClock = Math.cos(clock);
    sineClock = Math.sin(clock);

    tempClockDirection = Cartesian2.fromElements(
      cosineClock,
      sineClock,
      tempClockDirection,
    );
    factor =
      clockSpan < Math.PI
        ? (wInner * bisectorMagnitudeSquared) /
          Cartesian2.dot(tempClockDirection, clockBisector)
        : 0.0;

    innerLeft = Cartesian3.fromElements(
      cosineClock * factor,
      sineClock * factor,
      z,
      innerLeft,
    );
    outerLeft = Cartesian3.fromElements(
      cosineClock * wOuter,
      sineClock * wOuter,
      z,
      outerLeft,
    );

    // Outer side.
    normal = Cartesian3.normalize(
      Cartesian3.cross(outerLeft, outerRight, normal),
      normal,
    );
    index = packTriangle(
      Cartesian3.ZERO,
      outerLeft,
      outerRight,
      normal,
      vertices,
      index,
    );

    // Back side.
    if (clockSpan < Math.PI) {
      index = packTriangle(
        innerRight,
        outerRight,
        outerLeft,
        Cartesian3.UNIT_Z,
        vertices,
        index,
      );
      index = packTriangle(
        outerLeft,
        innerLeft,
        innerRight,
        Cartesian3.UNIT_Z,
        vertices,
        index,
      );
    } else {
      index = packTriangle(
        outerRight,
        outerLeft,
        innerRight,
        Cartesian3.UNIT_Z,
        vertices,
        index,
      );
    }

    // Swap scratch references.
    let temp = innerRight;
    innerRight = innerLeft;
    innerLeft = temp;
    temp = outerRight;
    outerRight = outerLeft;
    outerLeft = temp;

    clock = i + 1 === wedges - 1 ? finalClockAngle : clock + step;
  }

  // Left side (but use "Right" since swap occured).
  if (isPartialCone && clockSpan < Math.PI) {
    normal = Cartesian3.fromElements(
      -Math.sin(finalClockAngle),
      Math.cos(finalClockAngle),
      0.0,
      normal,
    );
    index = packTriangle(
      Cartesian3.ZERO,
      innerRight,
      outerRight,
      normal,
      vertices,
      index,
    );
  }

  // Inner side.
  if (isPartialCone) {
    cosineClock = Math.cos(initialClockAngle);
    sineClock = Math.sin(initialClockAngle);

    tempClockDirection = Cartesian2.fromElements(
      cosineClock,
      sineClock,
      tempClockDirection,
    );
    factor =
      clockSpan < Math.PI
        ? (wInner * bisectorMagnitudeSquared) /
          Cartesian2.dot(tempClockDirection, clockBisector)
        : 0.0;

    innerLeft = Cartesian3.fromElements(
      cosineClock * factor,
      sineClock * factor,
      z,
      innerLeft,
    );

    if (clockSpan < Math.PI) {
      normal = Cartesian3.normalize(
        Cartesian3.cross(innerLeft, innerRight, normal),
        normal,
      );
      index = packTriangle(
        Cartesian3.ZERO,
        innerLeft,
        innerRight,
        normal,
        vertices,
        index,
      );
    } else {
      outerLeft = Cartesian3.fromElements(
        cosineClock * wOuter,
        sineClock * wOuter,
        z,
        outerLeft,
      );
      normal = Cartesian3.normalize(
        Cartesian3.cross(outerLeft, outerRight, normal),
        normal,
      );
      index = packTriangle(
        Cartesian3.ZERO,
        outerLeft,
        outerRight,
        normal,
        vertices,
        index,
      );

      index = packTriangle(
        innerRight,
        outerRight,
        outerLeft,
        Cartesian3.UNIT_Z,
        vertices,
        index,
      );
    }
  }

  return vertices;
}

function updateDefinitionDependentData(sensor, context) {
  const radius = isFinite(sensor.radius)
    ? sensor.radius
    : SensorVolume.maximumRadius;
  const n = SensorVolume.numberOfSidesForCompleteCircle;

  let vertices = computeConeBoundingVertices(
    sensor._outerHalfAngle,
    sensor._minimumClockAngle,
    sensor._maximumClockAngle,
    radius,
    n,
    sensor._isPartialCone,
  );
  BoundingSphere.fromVertices(
    vertices,
    undefined,
    6,
    sensor._lateralOuterConicBoundingSphere,
  );
  let buffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: vertices,
    usage: BufferUsage.STATIC_DRAW,
  });
  sensor._lateralOuterConicCommandsVertexArray = SensorVolume.makeVertexArray3D(
    sensor,
    context,
    buffer,
  );
  sensor._lateralOuterConicCommand.vertexArray =
    sensor._lateralOuterConicCommandsVertexArray;
  sensor._lateralOuterConicPickCommand.vertexArray =
    sensor._lateralOuterConicCommandsVertexArray;
  if (sensor._isPartialCone) {
    sensor._lateralOuterConicCommand.uniformMap = combine(
      combine(sensor._uniforms, sensor._clockUniforms),
      sensor._outerConeUniform,
    );
    sensor._lateralOuterConicPickCommand.uniformMap = combine(
      combine(sensor._uniforms, sensor._clockUniforms),
      sensor._outerConeUniform,
    );
  } else {
    sensor._lateralOuterConicCommand.uniformMap = combine(
      sensor._uniforms,
      sensor._outerConeUniform,
    );
    sensor._lateralOuterConicPickCommand.uniformMap = combine(
      sensor._uniforms,
      sensor._outerConeUniform,
    );
  }

  if (sensor._hasInnerCone) {
    vertices = computeConeBoundingVertices(
      sensor._innerHalfAngle,
      sensor._minimumClockAngle,
      sensor._maximumClockAngle,
      radius,
      n,
      sensor._isPartialCone,
    );
    BoundingSphere.fromVertices(
      vertices,
      undefined,
      6,
      sensor._lateralInnerConicBoundingSphere,
    );
    buffer = Buffer.createVertexBuffer({
      context: context,
      typedArray: vertices,
      usage: BufferUsage.STATIC_DRAW,
    });
    sensor._lateralInnerConicCommandsVertexArray =
      SensorVolume.makeVertexArray3D(sensor, context, buffer);
    sensor._lateralInnerConicCommand.vertexArray =
      sensor._lateralInnerConicCommandsVertexArray;
    sensor._lateralInnerConicPickCommand.vertexArray =
      sensor._lateralInnerConicCommandsVertexArray;
    if (sensor._isPartialCone) {
      sensor._lateralInnerConicCommand.uniformMap = combine(
        combine(sensor._uniforms, sensor._clockUniforms),
        sensor._innerConeUniform,
      );
      sensor._lateralInnerConicPickCommand.uniformMap = combine(
        combine(sensor._uniforms, sensor._clockUniforms),
        sensor._innerConeUniform,
      );
    } else {
      sensor._lateralInnerConicCommand.uniformMap = combine(
        sensor._uniforms,
        sensor._innerConeUniform,
      );
      sensor._lateralInnerConicPickCommand.uniformMap = combine(
        sensor._uniforms,
        sensor._innerConeUniform,
      );
    }
  }

  const maximumNumberOfEllipsoidHorizonSurfaces = 4; // There can be at most 4 ellipsoid horizon surfaces.

  // Allocate scratch arrays as necessary.
  if (sensor._crossings.length === 0) {
    for (
      let iiii = 0;
      iiii < 2 * maximumNumberOfEllipsoidHorizonSurfaces;
      ++iiii
    ) {
      sensor._crossings[iiii] = new Crossing();
    }
    for (
      let iii = 0;
      iii < SensorVolume.numberOfSidesForCompleteCircle;
      ++iii
    ) {
      sensor._directions[iii] = new Cartesian3();
      sensor._fronts[iii] = new Cartesian3();
      sensor._backs[iii] = new Cartesian3();
    }
  }

  const primitiveType = sensor.debugShowProxyGeometry
    ? PrimitiveType.LINES
    : sensor._frontFaceColorCommand.primitiveType;

  SensorVolume.initializeEllipsoidHorizonSurfaceCommands(
    sensor,
    context,
    maximumNumberOfEllipsoidHorizonSurfaces,
    primitiveType,
  );

  initializeDomeCommand(
    sensor,
    context,
    primitiveType,
    sensor._innerHalfAngle,
    sensor._outerHalfAngle,
    sensor._minimumClockAngle,
    sensor._maximumClockAngle,
    radius,
    SensorVolume.numberOfSidesForCompleteCircle,
    sensor._hasInnerCone,
    sensor._isPartialCone,
    sensor._sensorUniforms,
  );

  initializeSurfaceCommand(
    sensor,
    context,
    primitiveType,
    sensor._innerHalfAngle,
    sensor._outerHalfAngle,
    sensor._minimumClockAngle,
    sensor._maximumClockAngle,
    radius,
    SensorVolume.numberOfSidesForCompleteCircle,
    sensor._hasInnerCone,
    sensor._isPartialCone,
  );

  vertices = computePlanarVertices(
    sensor._innerHalfAngle,
    sensor._outerHalfAngle,
    sensor._minimumClockAngle,
    sensor._maximumClockAngle,
    radius,
    SensorVolume.numberOfSidesForCompleteCircle,
  );
  BoundingSphere.fromVertices(
    vertices,
    undefined,
    6,
    sensor._lateralPlanarBoundingSphere,
  );
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
  if (sensor._hasInnerCone) {
    sensor._lateralInnerConicCommandsVertexArray =
      sensor._lateralInnerConicCommandsVertexArray &&
      sensor._lateralInnerConicCommandsVertexArray.destroy();
  }
  sensor._lateralOuterConicCommandsVertexArray =
    sensor._lateralOuterConicCommandsVertexArray &&
    sensor._lateralOuterConicCommandsVertexArray.destroy();
  sensor._lateralPlanarCommandsVertexArray =
    sensor._lateralPlanarCommandsVertexArray &&
    sensor._lateralPlanarCommandsVertexArray.destroy();

  updateDefinitionDependentData(sensor, context);
}

function setLateralSurfacesRenderStates3D(sensor, context, isTranslucent) {
  let rs = SensorVolume.getRenderState3D(
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

  rs = SensorVolume.getRenderState3D(
    sensor,
    context,
    isTranslucent,
    CullFace.FRONT,
  );

  if (sensor._hasInnerCone) {
    sensor._lateralInnerConicCommand.renderState = rs;
    sensor._lateralInnerConicCommand.pass = pass;

    sensor._lateralInnerConicPickCommand.renderState = rs;
    sensor._lateralInnerConicPickCommand.pass = pass;
  }

  sensor._lateralOuterConicCommand.renderState = rs;
  sensor._lateralOuterConicCommand.pass = pass;

  sensor._lateralOuterConicPickCommand.renderState = rs;
  sensor._lateralOuterConicPickCommand.pass = pass;
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
let axis = new Cartesian3();
let leftDirection = new Cartesian3();
let rightDirection = new Cartesian3();

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

      direction = Cartesian3.normalize(earthCenter, direction);
      earthCenterIsInsideSensor =
        isWithinCones(sensor, direction) &&
        (sensor._isPartialCone ? isWithinWedge(sensor, direction) : true);

      let index = 0;

      axis = Matrix3.getColumn(modelToWorld, 2, axis);

      if (sensor._outerHalfAngle === CesiumMath.PI_OVER_TWO) {
        const checkOuterBisector = sensor._isPartialCone;
        leftDirection = Cartesian3.fromElements(
          Math.cos(sensor._minimumClockAngle),
          Math.sin(sensor._minimumClockAngle),
          0.0,
          leftDirection,
        );
        rightDirection = Cartesian3.fromElements(
          Math.cos(sensor._maximumClockAngle),
          Math.sin(sensor._maximumClockAngle),
          0.0,
          rightDirection,
        );
        bisector = Cartesian3.divideByScalar(
          Cartesian3.add(leftDirection, rightDirection, bisector),
          2.0,
          bisector,
        );
        const outerBisectorMagnitudeSquared =
          Cartesian3.magnitudeSquared(bisector);
        normal = Cartesian3.negate(Cartesian3.UNIT_Z, normal);
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
            checkOuterBisector,
            normal,
            bisector,
            outerBisectorMagnitudeSquared,
            sensor._portionToDisplay,
            index++,
            info,
          );
      } else {
        noLateralFacetsIntersectEllipsoidHorizonSurface &=
          SensorVolume.checkConicCrossings(
            sensor._ellipsoid,
            p,
            q,
            qMagnitudeSquared,
            qUnit,
            oneOverQ,
            scaledQ,
            radiusSquared,
            worldToModel,
            xAxis,
            yAxis,
            sensor._minimumClockAngle,
            sensor._minimumClockAngleSurfaceNormal,
            sensor._maximumClockAngle,
            sensor._maximumClockAngleSurfaceNormal,
            sensor._isPartialCone,
            axis,
            sensor._outerHalfAngle,
            1,
            sensor._portionToDisplay,
            index++,
            info,
          );
      }

      if (sensor._isPartialCone) {
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
            sensor._minimumClockAngleSurfaceNormal,
            sensor._minimumClockAngleSurfaceFacetBisector,
            sensor._minimumClockAngleSurfaceFacetBisectorMagnitudeSquared,
            sensor._portionToDisplay,
            index++,
            info,
          );

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
            sensor._maximumClockAngleSurfaceNormal,
            sensor._maximumClockAngleSurfaceFacetBisector,
            sensor._maximumClockAngleSurfaceFacetBisectorMagnitudeSquared,
            sensor._portionToDisplay,
            index++,
            info,
          );
      }

      if (sensor._hasInnerCone) {
        if (sensor._innerHalfAngle === CesiumMath.PI_OVER_TWO) {
          const checkInnerBisector = sensor._isPartialCone;
          leftDirection = Cartesian3.fromElements(
            Math.cos(sensor._minimumClockAngle),
            Math.sin(sensor._minimumClockAngle),
            0.0,
            leftDirection,
          );
          rightDirection = Cartesian3.fromElements(
            Math.cos(sensor._maximumClockAngle),
            Math.sin(sensor._maximumClockAngle),
            0.0,
            rightDirection,
          );
          bisector = Cartesian3.divideByScalar(
            Cartesian3.add(leftDirection, rightDirection, bisector),
            2.0,
            bisector,
          );
          const innerBisectorMagnitudeSquared =
            Cartesian3.magnitudeSquared(bisector);
          normal = Cartesian3.clone(Cartesian3.UNIT_Z, normal);
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
              checkInnerBisector,
              normal,
              bisector,
              innerBisectorMagnitudeSquared,
              sensor._portionToDisplay,
              index++,
              info,
            );
        } else {
          noLateralFacetsIntersectEllipsoidHorizonSurface &=
            SensorVolume.checkConicCrossings(
              sensor._ellipsoid,
              p,
              q,
              qMagnitudeSquared,
              qUnit,
              oneOverQ,
              scaledQ,
              radiusSquared,
              worldToModel,
              xAxis,
              yAxis,
              sensor._minimumClockAngle,
              sensor._minimumClockAngleSurfaceNormal,
              sensor._maximumClockAngle,
              sensor._maximumClockAngleSurfaceNormal,
              sensor._isPartialCone,
              axis,
              sensor._innerHalfAngle,
              -1,
              sensor._portionToDisplay,
              index++,
              info,
            );
        }
      }

      const crossingCount = info.count;
      let crossings = info.crossings;

      if (crossingCount > 0 && qMagnitudeSquared > 1.0) {
        crossings = crossings.slice(0, crossingCount);
        crossings.sort(SensorVolume.angularSortUsingSineAndCosine);

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
    if (sensor._hasInnerCone) {
      BoundingSphere.transform(
        sensor._lateralInnerConicBoundingSphere,
        sensor.modelMatrix,
        sensor._lateralInnerConicBoundingSphereWC,
      );
      sensor._lateralInnerConicCommand.modelMatrix = sensor.modelMatrix;
      sensor._lateralInnerConicPickCommand.modelMatrix = sensor.modelMatrix;
    }
    BoundingSphere.transform(
      sensor._lateralOuterConicBoundingSphere,
      sensor.modelMatrix,
      sensor._lateralOuterConicBoundingSphereWC,
    );
    sensor._lateralOuterConicCommand.modelMatrix = sensor.modelMatrix;
    sensor._lateralOuterConicPickCommand.modelMatrix = sensor.modelMatrix;
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
    definitionChanged ||
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

  camera = Cartesian3.normalize(
    Matrix3.multiplyByVector(
      sensor._inverseModelRotation,
      Cartesian3.subtract(frameState.camera.positionWC, sensor._p, camera),
      camera,
    ),
    camera,
  );
  let cameraIsInsideInnerCone;
  if (sensor._hasInnerCone) {
    cameraIsInsideInnerCone = camera.z > sensor._cosineOfInnerHalfAngle;
  }
  const cameraIsInsideOuterCone = camera.z > sensor._cosineOfOuterHalfAngle;

  if (lateralShaderDirty) {
    let lateralMaterial;
    if (
      !sensor.showEnvironmentOcclusion ||
      !sensor.showEnvironmentIntersection
    ) {
      lateralMaterial = sensor._lateralSurfaceMaterial;
    } else {
      lateralMaterial = sensor._environmentOcclusionLateralMaterial;
    }

    // Lateral inner conic facet.
    if (sensor._hasInnerCone) {
      const innerCommand = sensor._lateralInnerConicCommand;
      const innerSource = getSensorSurfaceFunction(sensor, false);
      innerCommand.uniformMap = combine(
        lateralMaterial._uniforms,
        innerCommand.uniformMap,
      );
      innerCommand.primitiveType = primitiveType;

      if (sensor.environmentConstraint || sensor.showEnvironmentIntersection) {
        innerCommand.uniformMap = combine(
          innerCommand.uniformMap,
          sensor._shadowMapUniforms,
        );
      }

      if (sensor.showEnvironmentIntersection) {
        innerCommand.uniformMap.u_environmentIntersectionWidth = function () {
          return sensor.environmentIntersectionWidth;
        };
        innerCommand.uniformMap.u_environmentIntersectionColor = function () {
          return sensor.environmentIntersectionColor;
        };
      }

      const lateralVertexShader = new ShaderSource({
        defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
        sources: [isZeroMatrix, SensorVolume3DVS],
      });

      const innerOptions = [
        sensor.debugShowProxyGeometry ? "ONLY_WIRE_FRAME" : "",
        context.fragmentDepth ? "WRITE_DEPTH" : "",
        sensor.showIntersection ? "SHOW_INTERSECTION" : "",
        sensor.showThroughEllipsoid ? "SHOW_THROUGH_ELLIPSOID" : "",
        sensor.environmentConstraint ? "ENVIRONMENT_CONSTRAINT" : "",
        sensor.showEnvironmentOcclusion ? "SHOW_ENVIRONMENT_OCCLUSION" : "",
        sensor.showEnvironmentIntersection
          ? "SHOW_ENVIRONMENT_INTERSECTION"
          : "",
        SensorVolumePortionToDisplay.toString(sensor.portionToDisplay),
      ];

      const innerInsideShaderSource = new ShaderSource({
        defines: innerOptions,
        sources: [
          isZeroMatrix,
          ShadersSensorVolume,
          SensorVolumeDepth,
          innerSource,
          lateralMaterial.shaderSource,
          InfiniteCone,
          ConicSensorInsideFS,
        ],
      });
      sensor._lateralInnerConicCommandInsideShaderProgram =
        ShaderProgram.replaceCache({
          context: context,
          shaderProgram: sensor._lateralInnerConicCommandInsideShaderProgram,
          vertexShaderSource: lateralVertexShader,
          fragmentShaderSource: innerInsideShaderSource,
          attributeLocations: SensorVolume.attributeLocations3D,
        });

      const innerOutsideShaderSource = new ShaderSource({
        defines: innerOptions,
        sources: [
          isZeroMatrix,
          ShadersSensorVolume,
          SensorVolumeDepth,
          innerSource,
          lateralMaterial.shaderSource,
          InfiniteCone,
          ConicSensorOutsideFS,
        ],
      });
      sensor._lateralInnerConicCommandOutsideShaderProgram =
        ShaderProgram.replaceCache({
          context: context,
          shaderProgram: sensor._lateralInnerConicCommandOutsideShaderProgram,
          vertexShaderSource: lateralVertexShader,
          fragmentShaderSource: innerOutsideShaderSource,
          attributeLocations: SensorVolume.attributeLocations3D,
        });
    }

    // Lateral outer conic facet.
    const outerCommand = sensor._lateralOuterConicCommand;
    const outerSource = getSensorSurfaceFunction(sensor, false);
    outerCommand.primitiveType = primitiveType;
    outerCommand.uniformMap = combine(
      lateralMaterial._uniforms,
      outerCommand.uniformMap,
    );

    if (sensor.environmentConstraint || sensor.showEnvironmentIntersection) {
      outerCommand.uniformMap = combine(
        outerCommand.uniformMap,
        sensor._shadowMapUniforms,
      );
    }

    if (sensor.showEnvironmentIntersection) {
      outerCommand.uniformMap.u_environmentIntersectionWidth = function () {
        return sensor.environmentIntersectionWidth;
      };
      outerCommand.uniformMap.u_environmentIntersectionColor = function () {
        return sensor.environmentIntersectionColor;
      };
    }

    const lateralOuterVertexShader = new ShaderSource({
      defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
      sources: [isZeroMatrix, SensorVolume3DVS],
    });

    const outerOptions = [
      sensor.debugShowProxyGeometry ? "ONLY_WIRE_FRAME" : "",
      context.fragmentDepth ? "WRITE_DEPTH" : "",
      sensor.showIntersection ? "SHOW_INTERSECTION" : "",
      sensor.showThroughEllipsoid ? "SHOW_THROUGH_ELLIPSOID" : "",
      sensor.environmentConstraint ? "ENVIRONMENT_CONSTRAINT" : "",
      sensor.showEnvironmentOcclusion ? "SHOW_ENVIRONMENT_OCCLUSION" : "",
      sensor.showEnvironmentIntersection ? "SHOW_ENVIRONMENT_INTERSECTION" : "",
      SensorVolumePortionToDisplay.toString(sensor.portionToDisplay),
    ];

    const outerInsideShaderSource = new ShaderSource({
      defines: outerOptions,
      sources: [
        isZeroMatrix,
        ShadersSensorVolume,
        SensorVolumeDepth,
        outerSource,
        lateralMaterial.shaderSource,
        InfiniteCone,
        ConicSensorInsideFS,
      ],
    });
    sensor._lateralOuterConicCommandInsideShaderProgram =
      ShaderProgram.replaceCache({
        context: context,
        shaderProgram: sensor._lateralOuterConicCommandInsideShaderProgram,
        vertexShaderSource: lateralOuterVertexShader,
        fragmentShaderSource: outerInsideShaderSource,
        attributeLocations: SensorVolume.attributeLocations3D,
      });

    const outerOutsideShaderSource = new ShaderSource({
      defines: outerOptions,
      sources: [
        isZeroMatrix,
        ShadersSensorVolume,
        SensorVolumeDepth,
        outerSource,
        lateralMaterial.shaderSource,
        InfiniteCone,
        ConicSensorOutsideFS,
      ],
    });
    sensor._lateralOuterConicCommandOutsideShaderProgram =
      ShaderProgram.replaceCache({
        context: context,
        shaderProgram: sensor._lateralOuterConicCommandOutsideShaderProgram,
        vertexShaderSource: lateralOuterVertexShader,
        fragmentShaderSource: outerOutsideShaderSource,
        attributeLocations: SensorVolume.attributeLocations3D,
      });

    // Lateral planar facets.
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
        "CONIC_TEXTURE_COORDINATES",
      ],
      sources: [
        isZeroMatrix,
        ShadersSensorVolume,
        lateralMaterial.shaderSource,
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
      lateralMaterial._uniforms,
    );

    backFaceColorCommand.shaderProgram = frontFaceColorCommand.shaderProgram;
    backFaceColorCommand.uniformMap = combine(
      sensor._uniforms,
      lateralMaterial._uniforms,
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

  if (sensor._hasInnerCone) {
    const ic = sensor._lateralInnerConicCommand;
    ic.shaderProgram = cameraIsInsideInnerCone
      ? sensor._innerHalfAngle < CesiumMath.PI_OVER_TWO
        ? sensor._lateralInnerConicCommandInsideShaderProgram
        : sensor._lateralInnerConicCommandOutsideShaderProgram
      : sensor._innerHalfAngle < CesiumMath.PI_OVER_TWO
        ? sensor._lateralInnerConicCommandOutsideShaderProgram
        : sensor._lateralInnerConicCommandInsideShaderProgram;
  }

  const oc = sensor._lateralOuterConicCommand;
  oc.shaderProgram = cameraIsInsideOuterCone
    ? sensor._outerHalfAngle < CesiumMath.PI_OVER_TWO
      ? sensor._lateralOuterConicCommandInsideShaderProgram
      : sensor._lateralOuterConicCommandOutsideShaderProgram
    : sensor._outerHalfAngle < CesiumMath.PI_OVER_TWO
      ? sensor._lateralOuterConicCommandOutsideShaderProgram
      : sensor._lateralOuterConicCommandInsideShaderProgram;

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
    let domeMaterial;
    if (!sensor.showEnvironmentOcclusion || !sensor.environmentConstraint) {
      domeMaterial = sensor._domeSurfaceMaterial;
    } else {
      domeMaterial = sensor._environmentOcclusionDomeMaterial;
    }

    const domeSource = sensor._sensorGlsl;
    domeCommand.uniformMap = combine(
      domeMaterial._uniforms,
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

    const options = [
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
      defines: options,
      sources: [
        isZeroMatrix,
        ShadersSensorVolume,
        SensorVolumeDepth,
        domeSource,
        domeMaterial.shaderSource,
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
      defines: options,
      sources: [
        isZeroMatrix,
        ShadersSensorVolume,
        SensorVolumeDepth,
        domeSource,
        domeMaterial.shaderSource,
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
      sensor._lateralInnerConicCommand.debugShowBoundingVolume =
        debugShowBoundingVolume;
      sensor._lateralOuterConicCommand.debugShowBoundingVolume =
        debugShowBoundingVolume;

      if (sensor._hasInnerCone) {
        commandList.push(
          sensor._lateralInnerConicCommand,
          sensor._lateralOuterConicCommand,
        );
      } else {
        commandList.push(sensor._lateralOuterConicCommand);
      }
      if (sensor._isPartialCone) {
        commandList.push(
          sensor._backFaceColorCommand,
          sensor._frontFaceColorCommand,
        );
      }
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

  sensor._updatePickCommands =
    sensor._updatePickCommands ||
    definitionChanged ||
    lateralSurfaceMaterialChanged ||
    showIntersectionChanged;

  if (pass.pick) {
    const pickCommand = sensor._pickCommand;

    if (sensor._updatePickCommands || !defined(pickCommand.shaderProgram)) {
      sensor._updatePickCommands = false;

      const pickVertexShader = new ShaderSource({
        defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
        sources: [isZeroMatrix, SensorVolume3DVS],
      });

      if (sensor._hasInnerCone) {
        const innerPickFS = cameraIsInsideInnerCone
          ? sensor._innerHalfAngle < CesiumMath.PI_OVER_TWO
            ? ConicSensorInsideFS
            : ConicSensorOutsideFS
          : sensor._innerHalfAngle < CesiumMath.PI_OVER_TWO
            ? ConicSensorOutsideFS
            : ConicSensorInsideFS;
        const innerPickCommand = sensor._lateralInnerConicPickCommand;
        const innerPickSource = getSensorSurfaceFunction(sensor, false);
        innerPickCommand.uniformMap = combine(
          combine(
            sensor._lateralSurfaceMaterial._uniforms,
            innerPickCommand.uniformMap,
          ),
          sensor._pickUniforms,
        );

        const innerPickShaderSource = new ShaderSource({
          defines: [
            sensor.debugShowProxyGeometry ? "ONLY_WIRE_FRAME" : "",
            context.fragmentDepth ? "WRITE_DEPTH" : "",
            sensor.showIntersection ? "SHOW_INTERSECTION" : "",
            sensor.showThroughEllipsoid ? "SHOW_THROUGH_ELLIPSOID" : "",
            SensorVolumePortionToDisplay.toString(sensor.portionToDisplay),
          ],
          sources: [
            isZeroMatrix,
            ShadersSensorVolume,
            SensorVolumeDepth,
            innerPickSource,
            sensor._lateralSurfaceMaterial.shaderSource,
            InfiniteCone,
            innerPickFS,
          ],
          pickColorQualifier: "uniform",
        });
        innerPickCommand.shaderProgram = ShaderProgram.replaceCache({
          context: context,
          shaderProgram: innerPickCommand.shaderProgram,
          vertexShaderSource: pickVertexShader,
          fragmentShaderSource: innerPickShaderSource,
          attributeLocations: SensorVolume.attributeLocations3D,
        });
      }

      // Lateral outer conic facet.
      const outerPickFS = cameraIsInsideOuterCone
        ? sensor._outerHalfAngle < CesiumMath.PI_OVER_TWO
          ? ConicSensorInsideFS
          : ConicSensorOutsideFS
        : sensor._outerHalfAngle < CesiumMath.PI_OVER_TWO
          ? ConicSensorOutsideFS
          : ConicSensorInsideFS;
      const outerPickCommand = sensor._lateralOuterConicPickCommand;
      const outerPickSource = getSensorSurfaceFunction(sensor, false);
      outerPickCommand.uniformMap = combine(
        combine(
          sensor._lateralSurfaceMaterial._uniforms,
          outerPickCommand.uniformMap,
        ),
        sensor._pickUniforms,
      );

      const outerPickShaderSource = new ShaderSource({
        defines: [
          sensor.debugShowProxyGeometry ? "ONLY_WIRE_FRAME" : "",
          context.fragmentDepth ? "WRITE_DEPTH" : "",
          sensor.showIntersection ? "SHOW_INTERSECTION" : "",
          sensor.showThroughEllipsoid ? "SHOW_THROUGH_ELLIPSOID" : "",
          SensorVolumePortionToDisplay.toString(sensor.portionToDisplay),
        ],
        sources: [
          isZeroMatrix,
          ShadersSensorVolume,
          SensorVolumeDepth,
          outerPickSource,
          sensor._lateralSurfaceMaterial.shaderSource,
          InfiniteCone,
          outerPickFS,
        ],
        pickColorQualifier: "uniform",
      });
      outerPickCommand.shaderProgram = ShaderProgram.replaceCache({
        context: context,
        shaderProgram: outerPickCommand.shaderProgram,
        vertexShaderSource: pickVertexShader,
        fragmentShaderSource: outerPickShaderSource,
        attributeLocations: SensorVolume.attributeLocations3D,
      });

      // Lateral planar facets.
      pickCommand.uniformMap = combine(
        combine(sensor._uniforms, sensor._lateralSurfaceMaterial._uniforms),
        sensor._pickUniforms,
      );

      const pickPlanarVertexShader = new ShaderSource({
        defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
        sources: [isZeroMatrix, PlanarSensorVolumeVS],
      });
      const pickShaderSource = new ShaderSource({
        defines: [
          sensor.showIntersection ? "SHOW_INTERSECTION" : "",
          sensor.showThroughEllipsoid ? "SHOW_THROUGH_ELLIPSOID" : "",
          SensorVolumePortionToDisplay.toString(sensor.portionToDisplay),
          "CONIC_TEXTURE_COORDINATES",
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
        vertexShaderSource: pickPlanarVertexShader,
        fragmentShaderSource: pickShaderSource,
        attributeLocations: SensorVolume.attributeLocations3D,
      });
    }

    if (sensor._hasInnerCone) {
      commandList.push(
        sensor._lateralInnerConicPickCommand,
        sensor._lateralOuterConicPickCommand,
      );
    } else {
      commandList.push(sensor._lateralOuterConicPickCommand);
    }

    if (sensor._isPartialCone) {
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
 * @exception {DeveloperError} this.innerHalfAngle must be between zero and pi.
 * @exception {DeveloperError} this.outerHalfAngle must be between zero and pi.
 * @exception {DeveloperError} this.innerHalfAngle must be less than this.outerHalfAngle.
 * @exception {DeveloperError} this.minimumClockAngle must be between negative two pi and positive two pi.
 * @exception {DeveloperError} this.maximumClockAngle must be between negative two pi and positive two pi.
 * @exception {DeveloperError} this.minimumClockAngle must be less than this.maximumClockAngle.
 */
ConicSensor.prototype.update = function (frameState) {
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
  if (this._definitionChanged) {
    if (this._innerHalfAngle < 0.0 || this._innerHalfAngle > CesiumMath.PI) {
      throw new DeveloperError(
        "this.innerHalfAngle must be between zero and pi.",
      );
    } else if (
      this._outerHalfAngle < 0.0 ||
      this._outerHalfAngle > CesiumMath.PI
    ) {
      throw new DeveloperError(
        "this.outerHalfAngle must be between zero and pi.",
      );
    } else if (this._innerHalfAngle >= this._outerHalfAngle) {
      throw new DeveloperError(
        "this.innerHalfAngle must be less than this.outerHalfAngle.",
      );
    }
    if (
      this._minimumClockAngle < -CesiumMath.TWO_PI ||
      this._minimumClockAngle > CesiumMath.TWO_PI
    ) {
      throw new DeveloperError(
        "this.minimumClockAngle must be between negative two pi and positive two pi.",
      );
    } else if (
      this._maximumClockAngle < -CesiumMath.TWO_PI ||
      this._maximumClockAngle > CesiumMath.TWO_PI
    ) {
      throw new DeveloperError(
        "this.maximumClockAngle must be between negative two pi and positive two pi.",
      );
    } else if (this._minimumClockAngle >= this._maximumClockAngle) {
      throw new DeveloperError(
        "this.minimumClockAngle must be less than this.maximumClockAngle.",
      );
    }
  }
  //>>includeEnd('debug');

  if (this._definitionChanged) {
    this._hasInnerCone = this._innerHalfAngle !== 0.0;
    this._hasOuterCone = this._outerHalfAngle !== Math.PI;

    const minimum = this._minimumClockAngle;
    const maximum = this._maximumClockAngle;
    let temp = minimum + ((maximum - minimum) % CesiumMath.TWO_PI);
    if (temp === minimum) {
      temp += CesiumMath.TWO_PI;
      this._isPartialCone = false;
    } else {
      this._isPartialCone = true;
    }
    if (this._maximumClockAngle !== temp) {
      this._maximumClockAngle = temp;
    }
  }

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

    this._sensorGlsl = getSensorSurfaceFunction(this, true);
    this._sensorUniforms = combine(this._clockUniforms, this._coneUniforms);

    const cosineOuter = Math.cos(this._outerHalfAngle);
    const sineOuter = Math.sin(this._outerHalfAngle);
    this._cosineAndSineOfOuterHalfAngle.x = cosineOuter;
    this._cosineAndSineOfOuterHalfAngle.y = sineOuter;
    this._cosineOfOuterHalfAngle = cosineOuter;

    if (this._hasInnerCone) {
      this._cosineAndSineOfInnerHalfAngle.x = Math.cos(this._innerHalfAngle);
      this._cosineAndSineOfInnerHalfAngle.y = Math.sin(this._innerHalfAngle);
      this._cosineOfInnerHalfAngle = this._cosineAndSineOfInnerHalfAngle.x;
    }

    if (this._isPartialCone) {
      const cosineInner = Math.cos(this._innerHalfAngle);
      const sineInner = Math.sin(this._innerHalfAngle);

      const minimumClockAngle = this._minimumClockAngle;
      let cosineClock = Math.cos(minimumClockAngle);
      let sineClock = Math.sin(minimumClockAngle);
      Cartesian3.fromElements(
        sineClock,
        -cosineClock,
        0.0,
        this._minimumClockAngleSurfaceNormal,
      );
      leftDirection = Cartesian3.fromElements(
        cosineClock * sineInner,
        sineClock * sineInner,
        cosineInner,
        leftDirection,
      );
      rightDirection = Cartesian3.fromElements(
        cosineClock * sineOuter,
        sineClock * sineOuter,
        cosineOuter,
        rightDirection,
      );
      Cartesian3.divideByScalar(
        Cartesian3.add(leftDirection, rightDirection, bisector),
        2.0,
        this._minimumClockAngleSurfaceFacetBisector,
      );
      this._minimumClockAngleSurfaceFacetBisectorMagnitudeSquared =
        Cartesian3.magnitudeSquared(
          this._minimumClockAngleSurfaceFacetBisector,
        );

      const maximumClockAngle = this._maximumClockAngle;
      cosineClock = Math.cos(maximumClockAngle);
      sineClock = Math.sin(maximumClockAngle);
      Cartesian3.fromElements(
        -sineClock,
        cosineClock,
        0.0,
        this._maximumClockAngleSurfaceNormal,
      );
      leftDirection = Cartesian3.fromElements(
        cosineClock * sineOuter,
        sineClock * sineOuter,
        cosineOuter,
        leftDirection,
      );
      rightDirection = Cartesian3.fromElements(
        cosineClock * sineInner,
        sineClock * sineInner,
        cosineInner,
        rightDirection,
      );
      Cartesian3.divideByScalar(
        Cartesian3.add(leftDirection, rightDirection, bisector),
        2.0,
        this._maximumClockAngleSurfaceFacetBisector,
      );
      this._maximumClockAngleSurfaceFacetBisectorMagnitudeSquared =
        Cartesian3.magnitudeSquared(
          this._maximumClockAngleSurfaceFacetBisector,
        );
    }
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
ConicSensor.ellipsoidSurfaceIn3DSupported = function (scene) {
  return ellipsoidSurfaceIn3DSupported(scene.context);
};

/**
 * Determines if viewshed shading is supported.
 *
 * @param {Scene} scene The scene.
 * @returns {Boolean} <code>true</code> if viewshed shading is supported; otherwise, returns <code>false</code>
 */
ConicSensor.viewshedSupported = function (scene) {
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
ConicSensor.prototype.isDestroyed = function () {
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
ConicSensor.prototype.destroy = function () {
  SensorVolume.destroyShaderPrograms2D(this);
  if (this._hasInnerCone) {
    this._lateralInnerConicCommandsVertexArray =
      this._lateralInnerConicCommandsVertexArray &&
      this._lateralInnerConicCommandsVertexArray.destroy();
    this._lateralInnerConicCommandInsideShaderProgram =
      SensorVolume.destroyShader(
        this._lateralInnerConicCommandInsideShaderProgram,
      );
    this._lateralInnerConicCommandOutsideShaderProgram =
      SensorVolume.destroyShader(
        this._lateralInnerConicCommandOutsideShaderProgram,
      );
    this._lateralInnerConicCommand.shaderProgram = undefined;
    SensorVolume.destroyShaderProgram(this._lateralInnerConicPickCommand);
  }
  this._lateralOuterConicCommandsVertexArray =
    this._lateralOuterConicCommandsVertexArray &&
    this._lateralOuterConicCommandsVertexArray.destroy();
  this._lateralOuterConicCommandInsideShaderProgram =
    SensorVolume.destroyShader(
      this._lateralOuterConicCommandInsideShaderProgram,
    );
  this._lateralOuterConicCommandOutsideShaderProgram =
    SensorVolume.destroyShader(
      this._lateralOuterConicCommandOutsideShaderProgram,
    );
  this._lateralOuterConicCommand.shaderProgram = undefined;
  SensorVolume.destroyShaderProgram(this._lateralOuterConicPickCommand);

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

export default ConicSensor;
