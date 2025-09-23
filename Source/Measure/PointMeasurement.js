import {
  defined,
  destroyObject,
  Cartesian2,
  Cartesian3,
  Cartographic,
  Frozen,
  HorizontalOrigin,
  Math as CesiumMath,
  SceneMode,
  VerticalOrigin,
} from "@cesium/engine";

import AngleUnits from "./AngleUnits.js";
import getSlope from "./getSlope.js";
import getWorldPosition from "../getWorldPosition.js";
import Measurement from "./Measurement.js";
import MeasurementSettings from "./MeasurementSettings.js";
import MeasureUnits from "./MeasureUnits.js";
import filterPickForMeasurement from "./filterPickForMeasurement.js";

const scratchCartesian = new Cartesian3();
const scratchCartographic = new Cartographic();

function getIcon(size) {
  return `<svg viewBox="0 0 30 30" height="${size}px" width="${size}px">\n\
                 <g transform="translate(0,-267)">\n\
                   <circle r="2.0788691" cy="281.90503" cx="15.212251"/>\n\
                 </g>\n\
               </svg>`;
}

/**
 * Draws a point and the longitude, latitude, height, and slope of that point.
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
 * @alias PointMeasurement
 */
function PointMeasurement(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  Measurement.call(this, options);

  this._point = this._pointCollection.add(
    MeasurementSettings.getPointOptions(),
  );
  this._label = this._labelCollection.add(
    MeasurementSettings.getLabelOptions({
      horizontalOrigin: HorizontalOrigin.LEFT,
      verticalOrigin: VerticalOrigin.CENTER,
      pixelOffset: new Cartesian2(10, 0),
    }),
  );
  this._position = new Cartesian3();
  this._height = 0.0;
  this._slope = 0.0;
}

PointMeasurement.prototype = Object.create(Measurement.prototype);
PointMeasurement.prototype.constructor = PointMeasurement;

Object.defineProperties(PointMeasurement.prototype, {
  /**
   * Gets the position.
   * @type {Cartesian3}
   * @memberof PointMeasurement.prototype
   * @readonly
   */
  position: {
    get: function () {
      return this._position;
    },
  },
  /**
   * Gets the height.
   * @type {Number}
   * @memberof PointMeasurement.prototype
   * @readonly
   */
  height: {
    get: function () {
      return this._height;
    },
  },
  /**
   * Gets the slope in radians.
   * @type {Number}
   * @memberof PointMeasurement.prototype
   * @readonly
   */
  slope: {
    get: function () {
      return this._slope;
    },
  },
  /**
   * Gets the icon.
   * @type {String}
   * @memberof PointMeasurement.prototype
   * @readonly
   */
  icon: {
    value: getIcon(15),
  },
  /**
   * Gets the thumbnail.
   * @type {String}
   * @memberof PointMeasurement.prototype
   * @readonly
   */
  thumbnail: {
    value: getIcon(25),
  },
  /**
   * Gets the type.
   * @type {String}
   * @memberof PointMeasurement.prototype
   * @readonly
   */
  type: {
    value: "Point coordinates",
  },
  /**
   * Gets the instruction text.
   * @type {String[]}
   * @memberof PointMeasurement.prototype
   * @readonly
   */
  instructions: {
    value: [
      "Move the mouse to see the longitude, latitude and height of the point",
    ],
  },
  /**
   * Gets the id.
   * @type {String}
   * @memberof PointMeasurement.prototype
   * @readonly
   */
  id: {
    value: "pointMeasurement",
  },
});

PointMeasurement.prototype._pickPositionSupported = function () {
  return this._scene.pickPositionSupported;
};

/**
 * Handles drawing on mouse move.
 */
PointMeasurement.prototype.handleMouseMove = function (movePosition) {
  const scene = this._scene;
  this.reset();

  if (scene.mode === SceneMode.MORPHING) {
    return;
  }

  this._point.show = false;

  const position = PointMeasurement._getWorldPosition(
    scene,
    movePosition,
    filterPickForMeasurement,
    scratchCartesian,
  );
  if (!defined(position)) {
    return;
  }

  this._point.position = position;

  const positionCartographic =
    scene.frameState.mapProjection.ellipsoid.cartesianToCartographic(
      position,
      scratchCartographic,
    );
  let height = 0.0;
  if (defined(scene.globe)) {
    height = scene.globe.getHeight(positionCartographic) ?? 0.0;
  }
  height = positionCartographic.height - height;
  if (CesiumMath.equalsEpsilon(height, 0.0, CesiumMath.EPSILON3)) {
    height = 0.0;
  }

  let slope;
  if (scene.mode !== SceneMode.SCENE2D) {
    slope = PointMeasurement._getSlope(scene, movePosition, this._primitives);
  }

  this._point.show = true;

  const label = this._label;
  label.position = position;
  label.show = true;

  this._position = Cartesian3.clone(position, this._position);
  this._height = height;
  this._slope = slope;

  this._refreshLabels();
};

/**
 * Refreshes label text.
 * @private
 */
PointMeasurement.prototype._refreshLabels = function () {
  const scene = this._scene;
  const label = this._label;
  const positionCartographic =
    scene.frameState.mapProjection.ellipsoid.cartesianToCartographic(
      this._position,
      scratchCartographic,
    );

  label.text =
    `lon: ${MeasureUnits.angleToString(
      positionCartographic.longitude,
      AngleUnits.DEGREES_MINUTES_SECONDS,
      this._selectedLocale,
    )}\n` +
    `lat: ${MeasureUnits.angleToString(
      positionCartographic.latitude,
      AngleUnits.DEGREES_MINUTES_SECONDS,
      this._selectedLocale,
    )}`;

  if (scene.mode !== SceneMode.SCENE2D && this._pickPositionSupported()) {
    label.text += `\nheight: ${MeasureUnits.distanceToString(
      this._height,
      this._selectedUnits.distanceUnits,
      this._selectedLocale,
    )}`;
    if (defined(this._slope)) {
      label.text += `\nslope: ${MeasureUnits.angleToString(
        this._slope,
        this._selectedUnits.slopeUnits,
        this._selectedLocale,
        3,
      )}`;
    }
  }
};

/**
 * Resets the widget.
 */
PointMeasurement.prototype.reset = function () {
  this._label.show = false;
  this._point.show = false;
  this._position = Cartesian3.clone(Cartesian3.ZERO, this._position);
};

/**
 * @returns {Boolean} true if the object has been destroyed, false otherwise.
 */
PointMeasurement.prototype.isDestroyed = function () {
  return false;
};

/**
 * Destroys the measurement.
 */
PointMeasurement.prototype.destroy = function () {
  this._labelCollection.remove(this._label);
  this._pointCollection.remove(this._point);

  return destroyObject(this);
};

// exposed for specs
PointMeasurement._getSlope = getSlope;
PointMeasurement._getWorldPosition = getWorldPosition;
export default PointMeasurement;
