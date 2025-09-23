import {
  defined,
  destroyObject,
  Cartesian2,
  Cartesian3,
  Cartographic,
  Check,
  Frozen,
  Math as CesiumMath,
  Material,
  SceneTransforms,
  HorizontalOrigin,
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

const cart2Scratch1 = new Cartesian2();
const cart2Scratch2 = new Cartesian2();
const scratchCarto = new Cartographic();

const cart3Scratch1 = new Cartesian3();
const cart3Scratch2 = new Cartesian3();
const cart3Scratch3 = new Cartesian3();

function getIcon(size) {
  return `<svg viewBox="0 0 30 30" height="${size}px" width="${size}px">\n\
                 <g transform="translate(0,-267)">\n\
                  <path d="m 4.934989,292.6549 20.67981,-20.80395"/>\n\
                   <circle r="2.0788691" cy="270.1637" cx="27.025297"/>\n\
                   <circle r="2.0788691" cy="294.07068" cx="3.1183045"/>\n\
                 </g>\n\
               </svg>\n`;
}

function getComponentIcon(size) {
  return `<svg viewBox="0 0 30 30" height="${size}px" width="${size}px">\n\
                 <g transform="translate(0,-267)">\n\
                   <path d="m 4.934989,292.6549 20.67981,-20.80395" />\n\
                   <circle r="2.0788691" cy="270.1637" cx="27.025297" />\n\
                   <circle r="2.0788691" cy="294.07068" cx="3.1183045" />\n\
                   <path style="stroke-dasharray:2.00314951, 1.00157475;stroke-dashoffset:0;" d="m 3.3194019,292.73274 -0.046996,-22.53109 21.6420984,-0.0266" />\n\
                 </g>\n\
               </svg>\n`;
}

/**
 * Draws a measurement between two points.
 *
 * @param {Object} options An object with the following properties:
 * @ionsdk
 * @param {Scene} options.scene The scene
 * @param {MeasureUnits} options.units The selected units of measurement
 * @param {String} [options.locale] The {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag} string customizing language-sensitive number formatting. If <code>undefined</code>, the runtime's default locale is used. See the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation|Intl page on MDN}
 * @param {PointPrimitiveCollection} options.points A collection for adding the point primitives
 * @param {LabelCollection} options.labels A collection for adding the labels
 * @param {PrimitiveCollection} options.primitives A collection for adding primitives
 * @param {Boolean} [options.showComponentLines=false] Whether or not to show the x and y component lines
 *
 * @constructor
 * @alias DistanceMeasurement
 */
function DistanceMeasurement(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  Measurement.call(this, options);

  const that = this;
  const pointCollection = this._pointCollection;
  const labelCollection = this._labelCollection;
  const primitives = this._primitives;
  const scene = this._scene;

  const positions = [new Cartesian3(), new Cartesian3()];
  const xyPolylinePositions = [
    new Cartesian3(),
    new Cartesian3(),
    new Cartesian3(),
  ];
  const xyBoxPositions = [new Cartesian3(), new Cartesian3(), new Cartesian3()];

  const yPixelOffset = new Cartesian2(-9, 0);
  const xPixelOffset = new Cartesian2(9, 0);

  const ellipsoid = scene.frameState.mapProjection.ellipsoid;

  this._startPoint = pointCollection.add(MeasurementSettings.getPointOptions());
  this._endPoint = pointCollection.add(MeasurementSettings.getPointOptions());

  this._positions = positions;
  this._polyline = primitives.add(
    new PolylinePrimitive(
      MeasurementSettings.getPolylineOptions({
        ellipsoid: ellipsoid,
        width: 3,
        show: false,
        positions: positions,
      }),
    ),
  );

  this._xyPolylinePositions = xyPolylinePositions;
  this._xyPolyline = primitives.add(
    new PolylinePrimitive(
      MeasurementSettings.getPolylineOptions({
        ellipsoid: ellipsoid,
        width: 2,
        positions: xyPolylinePositions,
        materialType: Material.PolylineDashType,
      }),
    ),
  );

  this._xyBoxPositions = xyBoxPositions;
  this._xyBox = primitives.add(
    new PolylinePrimitive(
      MeasurementSettings.getPolylineOptions({
        ellipsoid: ellipsoid,
        width: 1,
        positions: xyBoxPositions,
      }),
    ),
  );

  this._label = labelCollection.add(
    MeasurementSettings.getLabelOptions({
      horizontalOrigin: HorizontalOrigin.LEFT,
      verticalOrigin: VerticalOrigin.TOP,
      pixelOffset: new Cartesian2(10, 10),
    }),
  );

  this._xPixelOffset = xPixelOffset;
  this._xLabel = labelCollection.add(MeasurementSettings.getLabelOptions());
  this._xAngleLabel = labelCollection.add(
    MeasurementSettings.getLabelOptions({
      horizontalOrigin: HorizontalOrigin.LEFT,
      verticalOrigin: VerticalOrigin.MIDDLE,
      pixelOffset: xPixelOffset,
    }),
  );

  this._yPixelOffset = yPixelOffset;
  this._yLabel = labelCollection.add(
    MeasurementSettings.getLabelOptions({
      horizontalOrigin: HorizontalOrigin.RIGHT,
      pixelOffset: yPixelOffset,
    }),
  );
  this._yAngleLabel = labelCollection.add(
    MeasurementSettings.getLabelOptions({
      verticalOrigin: VerticalOrigin.TOP,
      pixelOffset: new Cartesian2(0, 9),
    }),
  );

  this._distance = 0;
  this._xDistance = 0;
  this._yDistance = 0;
  this._xAngle = 0;
  this._yAngle = 0;

  this._mode = Mode.BeforeDraw;
  this._showComponentLines = options.showComponentLines ?? false;

  this._removeEvent = scene.preRender.addEventListener(function () {
    that._updateLabelPosition();
  });
}

DistanceMeasurement.prototype = Object.create(Measurement.prototype);
DistanceMeasurement.prototype.constructor = DistanceMeasurement;

Object.defineProperties(DistanceMeasurement.prototype, {
  /**
   * Gets the distance of the measurement in meters
   * @type {Number}
   * @memberof DistanceMeasurement.prototype
   * @readonly
   */
  distance: {
    get: function () {
      return this._distance;
    },
  },
  /**
   * Gets the horizontal component of distance of the measurement in meters
   * @type {Number}
   * @memberof DistanceMeasurement.prototype
   * @readonly
   */
  horizontalDistance: {
    get: function () {
      return this._xDistance;
    },
  },
  /**
   * Gets the vertical component of the distance of the measurement in meters
   * @type {Number}
   * @memberof DistanceMeasurement.prototype
   * @readonly
   */
  verticalDistance: {
    get: function () {
      return this._yDistance;
    },
  },
  /**
   * Gets the angle between horizontal and the distance line in radians
   * @type {Number}
   * @memberof DistanceMeasurement.prototype
   * @readonly
   */
  angleFromHorizontal: {
    get: function () {
      return this._xAngle;
    },
  },
  /**
   * Gets the angle between vertical and the distance line in radians
   * @type {Number}
   * @memberof DistanceMeasurement.prototype
   * @readonly
   */
  angleFromVertical: {
    get: function () {
      return this._yAngle;
    },
  },
  /**
   * Gets the icon.
   * @type {String}
   * @memberof DistanceMeasurement.prototype
   * @readonly
   */
  icon: {
    get: function () {
      if (this._showComponentLines) {
        return getComponentIcon(15);
      }
      return getIcon(15);
    },
  },
  /**
   * Gets the thumbnail.
   * @type {String}
   * @memberof DistanceMeasurement.prototype
   * @readonly
   */
  thumbnail: {
    get: function () {
      if (this._showComponentLines) {
        return getComponentIcon(25);
      }
      return getIcon(25);
    },
  },
  /**
   * Gets the type.
   * @type {String}
   * @memberof DistanceMeasurement.prototype
   * @readonly
   */
  type: {
    get: function () {
      if (this._showComponentLines) {
        return "Component Distance";
      }
      return "Distance";
    },
  },
  /**
   * Gets the instruction text.
   * @type {String[]}
   * @memberof DistanceMeasurement.prototype
   * @readonly
   */
  instructions: {
    value: [
      "Click on the point cloud or the globe to set the start point and end points",
      "To make a new measurement, click to clear the previous measurement",
    ],
  },
  /**
   * Gets the id.
   * @type {String}
   * @memberof DistanceMeasurement.prototype
   * @readonly
   */
  id: {
    get: function () {
      if (this._showComponentLines) {
        return "componentDistanceMeasurement";
      }
      return "distanceMeasurement";
    },
  },
  /**
   * Gets and sets whether or not to show the x and y component lines of the measurement.
   * @type {Boolean}
   * @memberof DistanceMeasurement.prototype
   * @default false
   */
  showComponentLines: {
    get: function () {
      return this._showComponentLines;
    },
    set: function (value) {
      this._showComponentLines = value;
      if (this._mode !== Mode.BeforeDraw) {
        this._updateComponents();
      }
    },
  },
});

/**
 * Refreshes label text.
 * @private
 */
DistanceMeasurement.prototype._refreshLabels = function () {
  this._refreshDistanceText();
  this._refreshComponentsText();
};

/**
 * Updates the straight line distance label text
 * @private
 */
DistanceMeasurement.prototype._refreshDistanceText = function () {
  const label = this._label;
  const distance = this._distance;
  label.text = MeasureUnits.distanceToString(
    distance,
    this._selectedUnits.distanceUnits,
    this._selectedLocale,
  );
};

/**
 * Updates the straight line distance label text
 * @private
 */
DistanceMeasurement.prototype._refreshComponentsText = function () {
  const xLabel = this._xLabel;
  const yLabel = this._yLabel;
  const xAngleLabel = this._xAngleLabel;
  const yAngleLabel = this._yAngleLabel;

  const xDistance = this._xDistance;
  const yDistance = this._yDistance;
  const xAngle = this._xAngle;
  const yAngle = this._yAngle;

  const selectedUnits = this._selectedUnits;
  const selectedLocale = this._selectedLocale;

  xLabel.text = MeasureUnits.distanceToString(
    xDistance,
    selectedUnits.distanceUnits,
    selectedLocale,
  );

  yLabel.text = MeasureUnits.distanceToString(
    yDistance,
    selectedUnits.distanceUnits,
    selectedLocale,
  );

  xAngleLabel.text = MeasureUnits.angleToString(
    xAngle,
    selectedUnits.slopeUnits,
    selectedLocale,
  );
  yAngleLabel.text = MeasureUnits.angleToString(
    yAngle,
    selectedUnits.slopeUnits,
    selectedLocale,
  );
};

/**
 * Updates the label positions.
 * @private
 */
DistanceMeasurement.prototype._updateComponents = function () {
  const show = this._showComponentLines;
  const xLabel = this._xLabel;
  const yLabel = this._yLabel;
  const xAngleLabel = this._xAngleLabel;
  const yAngleLabel = this._yAngleLabel;
  const xyPolyline = this._xyPolyline;
  const xyBox = this._xyBox;

  // always set to false first in case we can't compute the values.
  xLabel.show = false;
  yLabel.show = false;
  xAngleLabel.show = false;
  yAngleLabel.show = false;
  xyPolyline.show = false;
  xyBox.show = false;

  if (!show) {
    return;
  }

  const ellipsoid = this._scene.frameState.mapProjection.ellipsoid;

  const positions = this._positions;
  const p0 = positions[0];
  const p1 = positions[1];
  const height0 = ellipsoid.cartesianToCartographic(p0, scratchCarto).height;
  const height1 = ellipsoid.cartesianToCartographic(p1, scratchCarto).height;
  let bottomPoint;
  let topPoint;
  let topHeight;
  let bottomHeight;
  if (height0 < height1) {
    bottomPoint = p0;
    topPoint = p1;
    topHeight = height1;
    bottomHeight = height0;
  } else {
    bottomPoint = p1;
    topPoint = p0;
    topHeight = height0;
    bottomHeight = height1;
  }

  const xyPositions = this._xyPolylinePositions;
  xyPositions[0] = Cartesian3.clone(bottomPoint, xyPositions[0]);
  xyPositions[2] = Cartesian3.clone(topPoint, xyPositions[2]);
  let normal = ellipsoid.geodeticSurfaceNormal(bottomPoint, cart3Scratch1);
  normal = Cartesian3.multiplyByScalar(
    normal,
    topHeight - bottomHeight,
    normal,
  );
  const corner = Cartesian3.add(bottomPoint, normal, xyPositions[1]);

  xyPolyline.positions = xyPositions;

  if (
    Cartesian3.equalsEpsilon(corner, topPoint, CesiumMath.EPSILON10) ||
    Cartesian3.equalsEpsilon(corner, bottomPoint, CesiumMath.EPSILON10)
  ) {
    return;
  }

  yLabel.show = true;
  xLabel.show = true;
  yAngleLabel.show = true;
  xAngleLabel.show = true;
  xyPolyline.show = true;
  xyBox.show = true;

  let v1 = Cartesian3.subtract(topPoint, corner, cart3Scratch1);
  let v2 = Cartesian3.subtract(bottomPoint, corner, cart3Scratch2);
  const mag = Math.min(Cartesian3.magnitude(v1), Cartesian3.magnitude(v2));
  const scale = mag > 15.0 ? mag * 0.15 : mag * 0.25;
  v1 = Cartesian3.normalize(v1, v1);
  v2 = Cartesian3.normalize(v2, v2);
  v1 = Cartesian3.multiplyByScalar(v1, scale, v1);
  v2 = Cartesian3.multiplyByScalar(v2, scale, v2);

  const boxPos = this._xyBoxPositions;
  boxPos[0] = Cartesian3.add(corner, v1, boxPos[0]);
  boxPos[1] = Cartesian3.add(boxPos[0], v2, boxPos[1]);
  boxPos[2] = Cartesian3.add(corner, v2, boxPos[2]);
  xyBox.positions = boxPos;

  xLabel.position = Cartesian3.midpoint(corner, topPoint, cart3Scratch1);
  yLabel.position = Cartesian3.midpoint(bottomPoint, corner, cart3Scratch1);
  xAngleLabel.position = Cartesian3.clone(topPoint, cart3Scratch1);
  yAngleLabel.position = Cartesian3.clone(bottomPoint, cart3Scratch1);

  const vx = Cartesian3.subtract(corner, topPoint, cart3Scratch2);
  const vy = Cartesian3.subtract(corner, bottomPoint, cart3Scratch1);
  let v = Cartesian3.subtract(topPoint, bottomPoint, cart3Scratch3);

  const yAngle = Cartesian3.angleBetween(vy, v);
  v = Cartesian3.negate(v, v);
  const xAngle = Cartesian3.angleBetween(vx, v);

  const xDistance = Cartesian3.magnitude(vx);
  const yDistance = Cartesian3.magnitude(vy);

  this._xDistance = xDistance;
  this._yDistance = yDistance;
  this._xAngle = xAngle;
  this._yAngle = yAngle;

  this._refreshComponentsText();
};

/**
 * Updates the label positions.
 * @private
 */
DistanceMeasurement.prototype._updateLabelPosition = function () {
  const positions = this._positions;
  if (this._mode === Mode.BeforeDraw) {
    return;
  }
  const scene = this._scene;
  const p0 = positions[0];
  const p1 = positions[1];

  const pos0 = SceneTransforms.worldToWindowCoordinates(
    scene,
    p0,
    cart2Scratch1,
  );
  const pos1 = SceneTransforms.worldToWindowCoordinates(
    scene,
    p1,
    cart2Scratch2,
  );

  if (!defined(pos0) || !defined(pos1)) {
    return;
  }

  const label = this._label;
  const yLabel = this._yLabel;
  const xAngleLabel = this._xAngleLabel;
  const m = (pos0.y - pos1.y) / (pos1.x - pos0.x);
  if (m > 0) {
    this._yPixelOffset.x = -9;
    this._xPixelOffset.x = 12;
    yLabel.pixelOffset = this._yPixelOffset;
    yLabel.horizontalOrigin = HorizontalOrigin.RIGHT;
    xAngleLabel.pixelOffset = this._xPixelOffset;
    xAngleLabel.horizontalOrigin = HorizontalOrigin.LEFT;
    label.horizontalOrigin = HorizontalOrigin.LEFT;
  } else {
    this._yPixelOffset.x = 9;
    this._xPixelOffset.x = -12;
    yLabel.pixelOffset = this._yPixelOffset;
    yLabel.horizontalOrigin = HorizontalOrigin.LEFT;
    xAngleLabel.pixelOffset = this._xPixelOffset;
    xAngleLabel.horizontalOrigin = HorizontalOrigin.RIGHT;
    label.horizontalOrigin = HorizontalOrigin.RIGHT;
  }
};

/**
 * Handles click events while drawing a distance measurement.
 * @param {Cartesian2} clickPosition The click position
 */
DistanceMeasurement.prototype.handleClick = function (clickPosition) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("clickPosition", clickPosition);
  //>>includeEnd('debug');

  const scene = this._scene;
  if (this._mode === Mode.AfterDraw) {
    this.reset();
  }
  const mode = this._mode;

  const positions = this._positions;
  if (mode === Mode.BeforeDraw) {
    const pos = DistanceMeasurement._getWorldPosition(
      scene,
      clickPosition,
      filterPickForMeasurement,
      positions[0],
    );
    if (!defined(pos)) {
      return;
    }
    this._polyline.show = true;
    positions[0] = pos.clone(positions[0]);
    positions[1] = pos.clone(positions[1]);
    this._startPoint.position = pos;
    this._startPoint.show = true;
    this._mode = Mode.Drawing;
    this._polyline.positions = positions;
  } else if (mode === Mode.Drawing) {
    this._endPoint.position = positions[1];
    this._endPoint.show = true;
    this._polyline.positions = positions;
    this._mode = Mode.AfterDraw;
  }
};

/**
 * Handles mouse move events while drawing a distance measurement.
 * @param {Cartesian2} mousePosition The mouse position
 */
DistanceMeasurement.prototype.handleMouseMove = function (mousePosition) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("mousePosition", mousePosition);
  //>>includeEnd('debug');

  if (this._mode !== Mode.Drawing) {
    return;
  }

  const scene = this._scene;
  const positions = this._positions;
  const pos = DistanceMeasurement._getWorldPosition(
    scene,
    mousePosition,
    filterPickForMeasurement,
    cart3Scratch1,
  );

  if (!defined(pos)) {
    return;
  }

  const pos0 = positions[0];
  const pos1 = Cartesian3.clone(pos, positions[1]);

  const vec = Cartesian3.subtract(pos1, pos0, cart3Scratch1);

  this._distance = Cartesian3.magnitude(vec);
  this._polyline.positions = positions;

  const label = this._label;
  label.position = Cartesian3.midpoint(pos0, pos1, cart3Scratch1);
  label.show = true;

  this._refreshDistanceText();
  this._updateComponents();
};

/**
 * Resets the measurement.
 */
DistanceMeasurement.prototype.reset = function () {
  this._polyline.show = false;
  this._xyPolyline.show = false;
  this._xyBox.show = false;
  this._label.show = false;
  this._xLabel.show = false;
  this._yLabel.show = false;
  this._xAngleLabel.show = false;
  this._yAngleLabel.show = false;
  this._startPoint.show = false;
  this._endPoint.show = false;
  this._mode = Mode.BeforeDraw;
  this._distance = 0;
  this._xDistance = 0;
  this._yDistance = 0;
  this._xAngle = 0;
  this._yAngle = 0;
};

/**
 * @returns {Boolean} true if the object has been destroyed, false otherwise.
 */
DistanceMeasurement.prototype.isDestroyed = function () {
  return false;
};

/**
 * Destroys the measurement.
 */
DistanceMeasurement.prototype.destroy = function () {
  this._removeEvent();

  const primitives = this._primitives;
  primitives.remove(this._polyline);
  primitives.remove(this._xyPolyline);
  primitives.remove(this._xyBox);

  const points = this._pointCollection;
  points.remove(this._startPoint);
  points.remove(this._endPoint);

  const labels = this._labelCollection;
  labels.remove(this._label);
  labels.remove(this._xLabel);
  labels.remove(this._yLabel);
  labels.remove(this._xAngleLabel);
  labels.remove(this._yAngleLabel);

  return destroyObject(this);
};

// Exposed for specs
DistanceMeasurement._getWorldPosition = getWorldPosition;
export default DistanceMeasurement;
