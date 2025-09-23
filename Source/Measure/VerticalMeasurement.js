import {
  defined,
  destroyObject,
  Cartesian2,
  Cartesian3,
  Cartographic,
  Check,
  Frozen,
  IntersectionTests,
  Plane,
  Ray,
  SceneTransforms,
  HorizontalOrigin,
  SceneMode,
  VerticalOrigin,
} from "@cesium/engine";

import getWorldPosition from "../getWorldPosition.js";
import Measurement from "./Measurement.js";
import MeasurementSettings from "./MeasurementSettings.js";
import MeasureUnits from "./MeasureUnits.js";
import PolylinePrimitive from "../Drawing/PolylinePrimitive.js";
import filterPickForMeasurement from "./filterPickForMeasurement.js";

const Mode = {
  BeforeDraw: 0,
  Drawing: 1,
  AfterDraw: 2,
};

const scratch = new Cartesian3();
const cart2 = new Cartesian2();
const normalScratch = new Cartesian3();
let v1 = new Cartesian3();
const rayScratch = new Ray();
const positionScratch = new Cartesian3();
const scratchCarto = new Cartographic();

function getIcon(size) {
  return `<svg viewBox="0 0 30 30" height="${size}px" width="${size}px">\n\
                 <g transform="translate(0,-267)">\n\
                   <path d="m 15.042838,272.34414 -0.0497,18.93758"/>\n\
                   <circle r="2.0788691" cy="270.01154" cx="15.078616"/>\n\
                   <circle r="2.0788691" cy="293.97095" cx="15.092237"/>\n\
                 </g>\n\
               </svg>`;
}

function getHeightPosition(measurement, mousePos) {
  const positions = measurement._positions;
  const pos0 = positions[0];
  let pos1 = positions[1];
  let plane = measurement._draggingPlane;
  let normal = measurement._surfaceNormal;
  const scene = measurement._scene;
  const camera = scene.camera;
  const cameraDirection = camera.direction;
  const ellipsoid = scene.frameState.mapProjection.ellipsoid;

  let planePoint = pos0;
  let surfaceNormal = normal;

  if (scene.mode === SceneMode.COLUMBUS_VIEW) {
    surfaceNormal = Cartesian3.UNIT_X;
    const cartoPos = ellipsoid.cartesianToCartographic(pos0, scratchCarto);
    planePoint = scene.mapProjection.project(cartoPos, scratch);
    Cartesian3.fromElements(
      planePoint.z,
      planePoint.x,
      planePoint.y,
      planePoint,
    );
  }

  let planeNormal = Cartesian3.cross(
    surfaceNormal,
    cameraDirection,
    normalScratch,
  );
  planeNormal = Cartesian3.cross(surfaceNormal, planeNormal, planeNormal);
  planeNormal = Cartesian3.normalize(planeNormal, planeNormal);
  plane = Plane.fromPointNormal(planePoint, planeNormal, plane);
  const ray = camera.getPickRay(mousePos, rayScratch);

  pos1 = IntersectionTests.rayPlane(ray, plane, pos1);
  if (!defined(pos1)) {
    return;
  }

  if (scene.mode === SceneMode.COLUMBUS_VIEW) {
    pos1 = Cartesian3.fromElements(pos1.y, pos1.z, pos1.x, pos1);
    const carto = scene.mapProjection.unproject(pos1, scratchCarto);
    pos1 = ellipsoid.cartographicToCartesian(carto, pos1);
  }

  const screenPos = SceneTransforms.worldToWindowCoordinates(
    scene,
    positions[0],
    cart2,
  );
  if (screenPos.y < mousePos.y) {
    normal = Cartesian3.negate(normal, normalScratch);
  }
  v1 = Cartesian3.subtract(pos1, pos0, v1);
  v1 = Cartesian3.projectVector(v1, normal, v1);
  pos1 = Cartesian3.add(pos0, v1, pos1);
  return pos1;
}

/**
 * Draws a measurement between two points that only differ in height.
 *
 * @param {Object} options An object with the following properties:
 * @ionsdk
 * @param {Scene} options.scene The scene
 * @param {MeasureUnits} options.units The selected units of measurement
 * @param {String} [options.locale] The {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag} string customizing language-sensitive number formatting. If <code>undefined</code>, the runtime's default locale is used. See the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation|Intl page on MDN}
 * @param {PointPrimitiveCollection} options.points A collection for adding the point primitives
 * @param {LabelCollection} options.labels A collection for adding the labels
 * @param {PrimitiveCollection} options.primitives A collection for adding primitives
 *
 * @constructor
 * @alias VerticalMeasurement
 */
function VerticalMeasurement(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  Measurement.call(this, options);

  const pointCollection = this._pointCollection;
  const positions = [new Cartesian3(), new Cartesian3()];

  this._startPoint = pointCollection.add(MeasurementSettings.getPointOptions());
  this._endPoint = pointCollection.add(MeasurementSettings.getPointOptions());

  this._positions = positions;
  this._polyline = this._primitives.add(
    new PolylinePrimitive(
      MeasurementSettings.getPolylineOptions({
        ellipsoid: this._scene.frameState.mapProjection.ellipsoid,
        positions: positions,
      }),
    ),
  );

  this._label = this._labelCollection.add(
    MeasurementSettings.getLabelOptions({
      horizontalOrigin: HorizontalOrigin.LEFT,
      verticalOrigin: VerticalOrigin.TOP,
      pixelOffset: new Cartesian2(10, 10),
    }),
  );

  this._mode = Mode.BeforeDraw;
  this._draggingPlane = new Plane(Cartesian3.UNIT_X, 0);
  this._surfaceNormal = new Cartesian3();
  this._distance = 0;
}

VerticalMeasurement.prototype = Object.create(Measurement.prototype);
VerticalMeasurement.prototype.constructor = VerticalMeasurement;

Object.defineProperties(VerticalMeasurement.prototype, {
  /**
   * Gets the distance.
   * @type {Number}
   * @memberof VerticalMeasurement.prototype
   * @readonly
   */
  distance: {
    get: function () {
      return this._distance;
    },
  },
  /**
   * Gets the type.
   * @type {String}
   * @memberof VerticalMeasurement.prototype
   * @readonly
   */
  type: {
    value: "Vertical distance",
  },
  /**
   * Gets the icon.
   * @type {String}
   * @memberof VerticalMeasurement.prototype
   * @readonly
   */
  icon: {
    value: getIcon(15),
  },
  /**
   * Gets the thumbnail.
   * @type {String}
   * @memberof VerticalMeasurement.prototype
   * @readonly
   */
  thumbnail: {
    value: getIcon(25),
  },
  /**
   * Gets the instruction text.
   * @type {String[]}
   * @memberof VerticalMeasurement.prototype
   * @readonly
   */
  instructions: {
    value: [
      "Click on the point cloud or the globe to set the start point",
      "Move the mouse to drag the line",
      "Click again to set the end point",
      "To make a new measurement, click to clear the previous measurement",
    ],
  },
  /**
   * Gets the id.
   * @type {String}
   * @memberof VerticalMeasurement.prototype
   * @readonly
   */
  id: {
    value: "verticalMeasurement",
  },
});

/**
 * Handles click events while drawing a vertical measurement.
 * @param {Cartesian2} clickPosition The click position
 */
VerticalMeasurement.prototype.handleClick = function (clickPosition) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("clickPosition", clickPosition);
  //>>includeEnd('debug');

  const scene = this._scene;
  const ellipsoid = scene.frameState.mapProjection.ellipsoid;
  if (this._mode === Mode.AfterDraw) {
    this.reset();
  }

  const mode = this._mode;
  const positions = this._positions;
  if (mode === Mode.BeforeDraw) {
    const pos = VerticalMeasurement._getWorldPosition(
      scene,
      clickPosition,
      filterPickForMeasurement,
      positions[0],
    );
    if (!defined(pos)) {
      return;
    }
    this._polyline.show = true;
    positions[0] = Cartesian3.clone(pos, positions[0]);
    positions[1] = Cartesian3.clone(pos, positions[1]);
    this._startPoint.position = pos;
    this._startPoint.show = true;
    this._mode = Mode.Drawing;
    this._polyline.positions = positions;
    this._surfaceNormal = ellipsoid.geodeticSurfaceNormal(
      pos,
      this._surfaceNormal,
    );
  } else if (mode === Mode.Drawing) {
    this._endPoint.position = positions[1];
    this._endPoint.show = true;
    this._mode = Mode.AfterDraw;
  }
};

/**
 * Handles mouse movement while drawing a vertical measurement.
 * @param {Cartesian2} mousePosition The mouse position
 */
VerticalMeasurement.prototype.handleMouseMove = function (mousePosition) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("mousePosition", mousePosition);
  //>>includeEnd('debug');

  if (this._mode !== Mode.Drawing) {
    return;
  }

  const label = this._label;
  if (this._scene.mode === SceneMode.SCENE2D) {
    label.position = this._positions[0];
    label.text = MeasureUnits.distanceToString(
      0,
      this._selectedUnits.distanceUnits,
      this._selectedLocale,
    );
    label.show = true;
    this._mode = Mode.AfterDraw;
    return;
  }
  const pos = VerticalMeasurement._getHeightPosition(this, mousePosition);
  if (!defined(pos)) {
    return;
  }

  const positions = this._positions;
  const pos1 = positions[0];
  const pos2 = positions[1];

  const vec = Cartesian3.subtract(pos2, pos1, scratch);
  const distance = Cartesian3.magnitude(vec);

  label.position = Cartesian3.midpoint(pos1, pos2, positionScratch);
  label.show = true;

  this._polyline.positions = positions; //triggers polyline update
  this._distance = distance;
  this._refreshLabels();
};

/**
 * Refreshes label text.
 * @private
 */
VerticalMeasurement.prototype._refreshLabels = function () {
  const label = this._label;
  label.text = MeasureUnits.distanceToString(
    this._distance,
    this._selectedUnits.distanceUnits,
    this._selectedLocale,
  );
};

/**
 * Resets the measurement.
 */
VerticalMeasurement.prototype.reset = function () {
  this._polyline.show = false;
  this._label.show = false;
  this._startPoint.show = false;
  this._endPoint.show = false;
  this._mode = Mode.BeforeDraw;
  this._distance = 0;
};

/**
 * @returns {Boolean} true if the object has been destroyed, false otherwise.
 */
VerticalMeasurement.prototype.isDestroyed = function () {
  return false;
};

/**
 * Destroys the measurement.
 */
VerticalMeasurement.prototype.destroy = function () {
  this._primitives.remove(this._polyline);
  const points = this._pointCollection;
  points.remove(this._startPoint);
  points.remove(this._endPoint);
  this._labelCollection.remove(this._label);

  return destroyObject(this);
};

// exposed for specs
VerticalMeasurement._getWorldPosition = getWorldPosition;
VerticalMeasurement._getHeightPosition = getHeightPosition;
export default VerticalMeasurement;
