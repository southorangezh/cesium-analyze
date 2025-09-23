import {
  defined,
  Cartesian2,
  Cartesian3,
  Check,
  Frozen,
  SceneTransforms,
  HorizontalOrigin,
  VerticalOrigin,
} from "@cesium/engine";

import DrawingMode from "../Drawing/DrawingMode.js";
import HorizontalPolylineDrawing from "../Drawing/HorizontalPolylineDrawing.js";
import MeasurementSettings from "./MeasurementSettings.js";
import MeasureUnits from "./MeasureUnits.js";

const cart3Scratch = new Cartesian3();
const cart2Scratch1 = new Cartesian2();
const cart2Scratch2 = new Cartesian2();
const cart2Scratch3 = new Cartesian2();
const v1Scratch = new Cartesian3();

/**
 * @private
 * @ionsdk
 */
function HorizontalMeasurementDrawing(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  //>>includeStart('debug', pragmas.debug);
  Check.defined("options.scene", options.scene);
  Check.defined("options.primitives", options.primitives);
  Check.defined("options.units", options.units);
  Check.defined("options.points", options.points);
  Check.defined("options.labels", options.labels);
  //>>includeEnd('debug');
  HorizontalPolylineDrawing.call(this, options);

  const labels = options.labels;
  this._labelCollection = labels;
  this._label = labels.add(
    MeasurementSettings.getLabelOptions({
      horizontalOrigin: HorizontalOrigin.LEFT,
      verticalOrigin: VerticalOrigin.BOTTOM,
      pixelOffset: new Cartesian2(10, -10),
    }),
  );
  this._segmentLabels = [];
  this._segmentDistances = [];
  this._selectedUnits = options.units;
  this._selectedLocale = options.locale;
  this._previousDistance = 0;
  this._distance = 0;

  const that = this;
  this._removeEvent = this._scene.preRender.addEventListener(function () {
    that.updateLabels();
  });
}

HorizontalMeasurementDrawing.prototype = Object.create(
  HorizontalPolylineDrawing.prototype,
);
HorizontalMeasurementDrawing.prototype.constructor =
  HorizontalMeasurementDrawing;

Object.defineProperties(HorizontalMeasurementDrawing.prototype, {
  /**
   * Gets the distance in meters
   * @type {Number}
   * @memberof HorizontalMeasurementDrawing.prototype
   * @readonly
   */
  distance: {
    get: function () {
      return this._distance;
    },
  },
});

/**
 * Updates the label position.
 * @private
 */
HorizontalMeasurementDrawing.prototype.updateLabels = function () {
  const positions = this._positions;
  if (positions.length < 2) {
    return;
  }
  const scene = this._scene;
  let top = positions[0];
  const pos2d = SceneTransforms.worldToWindowCoordinates(
    scene,
    top,
    cart2Scratch1,
  );
  let lastScreenPos = defined(pos2d)
    ? Cartesian2.clone(pos2d, cart2Scratch3)
    : Cartesian2.fromElements(
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        cart2Scratch3,
      );
  let topY = lastScreenPos.y;
  const labels = this._segmentLabels;
  labels[0].show = this._polyline.positions.length > 2;
  for (let i = 1; i < positions.length; i++) {
    const nextScreenPos = SceneTransforms.worldToWindowCoordinates(
      scene,
      positions[i],
      cart2Scratch2,
    );
    if (!defined(nextScreenPos)) {
      continue;
    }

    const m =
      (lastScreenPos.y - nextScreenPos.y) / (nextScreenPos.x - lastScreenPos.x);
    const label = labels[i - 1];
    if (m > 0) {
      label.horizontalOrigin = HorizontalOrigin.LEFT;
    } else {
      label.horizontalOrigin = HorizontalOrigin.RIGHT;
    }

    if (nextScreenPos.y < topY) {
      topY = nextScreenPos.y;
      top = positions[i];
    }
    lastScreenPos = Cartesian2.clone(nextScreenPos, lastScreenPos);
  }
  if (this._mode === DrawingMode.AfterDraw) {
    this._label.position = top;
  }
};

HorizontalMeasurementDrawing.prototype.addPoint = function (position) {
  const positions = this._positions;
  if (positions.length > 0) {
    // store distance that was calculated on mouse move
    this._previousDistance = this._distance;

    const label = this._labelCollection.add(
      MeasurementSettings.getLabelOptions({
        scale: 0.8,
        horizontalOrigin: HorizontalOrigin.LEFT,
        verticalOrigin: VerticalOrigin.TOP,
        pixelOffset: new Cartesian2(5, 5),
      }),
    );
    const p1 = positions[positions.length - 1];
    label.position = Cartesian3.midpoint(p1, position, new Cartesian3());
    label.text = MeasureUnits.distanceToString(
      Cartesian3.distance(p1, position),
      this._selectedUnits.distanceUnits,
      this._selectedLocale,
    );
    label.show = true;
    this._segmentDistances.push(Cartesian3.distance(p1, position));
    this._segmentLabels.push(label);
  }
  HorizontalPolylineDrawing.prototype.addPoint.call(this, position);
};

/**
 * Handles click events while drawing a polyline.
 * @param {Cartesian2} clickPosition The click position
 */
HorizontalMeasurementDrawing.prototype.handleClick = function (clickPosition) {
  if (this._mode === DrawingMode.AfterDraw) {
    this.reset();
  }
  const position = HorizontalPolylineDrawing.prototype.handleClick.call(
    this,
    clickPosition,
  );
  if (defined(position)) {
    this._label.show = true;
    this._polyline.show = true;
  }
};

/**
 * Refreshes labels texts.
 * @private
 */
HorizontalMeasurementDrawing.prototype._refreshLabels = function () {
  // Change the current label
  const label = this._label;
  label.text = MeasureUnits.distanceToString(
    this._distance,
    this._selectedUnits.distanceUnits,
    this._selectedLocale,
  );

  // Update all old labels
  const labels = this._segmentLabels;
  for (let i = 0; i < labels.length; i++) {
    labels[i].text = MeasureUnits.distanceToString(
      this._segmentDistances[i],
      this._selectedUnits.distanceUnits,
      this._selectedLocale,
    );
  }
};

/**
 * Handles mouse movements while drawing a horizontal measurement.
 * @param {Cartesian2} mousePosition The mouse position
 * @param {Boolean} shift True if the shift key was pressed
 */
HorizontalMeasurementDrawing.prototype.handleMouseMove = function (
  mousePosition,
  shift,
) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("mousePosition", mousePosition);
  Check.defined("shift", shift);
  //>>includeEnd('debug');

  const nextPos = HorizontalPolylineDrawing.prototype.handleMouseMove.call(
    this,
    mousePosition,
    shift,
  );
  if (!defined(nextPos)) {
    return;
  }

  const positions = this._positions;
  const lastPos = positions[positions.length - 1];
  const vec = Cartesian3.subtract(nextPos, lastPos, v1Scratch);
  const distance = this._previousDistance + Cartesian3.magnitude(vec);

  const label = this._label;
  label.position = Cartesian3.midpoint(lastPos, nextPos, cart3Scratch);
  label.text = MeasureUnits.distanceToString(
    distance,
    this._selectedUnits.distanceUnits,
    this._selectedLocale,
  );
  label.show = true;

  this._distance = distance;
};

/**
 * Resets the measurement.
 */
HorizontalMeasurementDrawing.prototype.reset = function () {
  let i;
  const primitives = this._primitives;
  const dashLines = this._dashedLines;
  for (i = 0; i < dashLines.length; i++) {
    primitives.remove(dashLines[i]);
  }
  this._dashedLines = [];

  this._polyline.positions = [];
  this._polyline.show = false;

  this._label.show = false;
  this._label.text = "";

  this._previousDistance = 0;
  this._distance = 0;

  this._positions = [];

  const points = this._points;
  const pointCollection = this._pointCollection;
  for (i = 0; i < points.length; i++) {
    pointCollection.remove(points[i]);
  }
  points.length = 0;

  const labelCollection = this._labelCollection;
  const labels = this._segmentLabels;
  const distances = this._segmentDistances;
  for (i = 0; i < labels.length; i++) {
    labelCollection.remove(labels[i]);
  }
  labels.length = 0;
  distances.length = 0;

  this._moveDashLine.show = false;
  this._mode = DrawingMode.BeforeDraw;
  this._lastClickPosition.x = Number.POSITIVE_INFINITY;
  this._lastClickPosition.y = Number.POSITIVE_INFINITY;
};

/**
 * Destroys the measurement.
 */
HorizontalMeasurementDrawing.prototype.destroy = function () {
  this._removeEvent();

  let i;
  const labelCollection = this._labelCollection;
  const labels = this._segmentLabels;
  for (i = 0; i < labels.length; i++) {
    labelCollection.remove(labels[i]);
  }

  const primitives = this._primitives;
  const dashLines = this._dashedLines;
  for (i = 0; i < dashLines.length; i++) {
    primitives.remove(dashLines[i]);
  }

  this._labelCollection.remove(this._label);

  HorizontalPolylineDrawing.prototype.destroy.call(this);
};
export default HorizontalMeasurementDrawing;
