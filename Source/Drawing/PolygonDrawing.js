import {
  combine,
  defined,
  destroyObject,
  Cartesian2,
  Cartesian3,
  Check,
  Frozen,
  PointPrimitiveCollection,
} from "@cesium/engine";

import getWorldPosition from "../getWorldPosition.js";
import DrawingMode from "./DrawingMode.js";
import PolygonPrimitive from "./PolygonPrimitive.js";
import PolylinePrimitive from "./PolylinePrimitive.js";
import filterPickForMeasurement from "../Measure/filterPickForMeasurement.js";

const clickDistanceScratch = new Cartesian2();
const cart3Scratch = new Cartesian3();

const mouseDelta = 10;

/**
 * @private
 * @ionsdk
 */
function PolygonDrawing(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  //>>includeStart('debug', pragmas.debug);
  Check.defined("options.scene", options.scene);
  //>>includeEnd('debug');

  const scene = options.scene;
  const primitives = options.primitives ?? scene.primitives;
  let removePoints = false;
  let points = options.points;
  if (!defined(points)) {
    points = primitives.add(new PointPrimitiveCollection());
    removePoints = true;
  }

  this._polygon = primitives.add(new PolygonPrimitive(options.polygonOptions));
  this._polyline = primitives.add(
    new PolylinePrimitive(
      combine(
        {
          loop: true,
        },
        options.polylineOptions,
      ),
    ),
  );
  this._pointOptions = options.pointOptions;
  this._pointCollection = points;
  this._removePoints = removePoints;
  this._scene = scene;
  this._primitives = primitives;
  this._positions = [];
  this._points = [];
  this._tempNextPos = new Cartesian3();
  this._mode = DrawingMode.BeforeDraw;
  this._lastClickPosition = new Cartesian2(
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
  );
}

/**
 * Adds a point to the polygon.
 * @param {Cartesian3} position The position to add
 * @private
 */
PolygonDrawing.prototype.addPoint = function (position) {
  const positions = this._positions;
  positions.push(position);
  this._polyline.positions = positions;
  this._polygon.positions = positions;
  const point = this._pointCollection.add(this._pointOptions);
  point.position = position;
  point.show = true;
  this._points.push(point);
};

/**
 * Ends drawing on double click.
 */
PolygonDrawing.prototype.handleDoubleClick = function () {
  // expect point to be added by handleClick
  this._mode = DrawingMode.AfterDraw;

  // Sometimes a move event is fired between the ending
  // click and doubleClick events, so make sure the polyline
  // and polygon have the correct positions.
  const positions = this._positions;
  this._polyline.positions = positions;
  this._polygon.positions = positions;
};

/**
 * Handles click events while drawing a polygon.
 * @param {Cartesian2} clickPosition The click position
 */
PolygonDrawing.prototype.handleClick = function (clickPosition) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("clickPosition", clickPosition);
  //>>includeEnd('debug');

  if (this._mode === DrawingMode.AfterDraw) {
    return;
  }

  // Don't handle if clickPos is too close to previous click.
  // This typically indicates a double click handler will be fired next,
  // we don't expect the user to wait and click this point again.
  const lastClickPos = this._lastClickPosition;
  const distance = Cartesian2.magnitude(
    Cartesian2.subtract(lastClickPos, clickPosition, clickDistanceScratch),
  );
  if (distance < mouseDelta) {
    return;
  }

  const position = PolygonDrawing._getWorldPosition(
    this._scene,
    clickPosition,
    filterPickForMeasurement,
    cart3Scratch,
  );
  if (!defined(position)) {
    return;
  }

  this.addPoint(Cartesian3.clone(position, new Cartesian3()));
  this._mode = DrawingMode.Drawing;

  Cartesian2.clone(clickPosition, lastClickPos);

  return position;
};

/**
 * Handles mouse move events while drawing a polygon.
 * @param {Cartesian2} mousePosition The mouse position
 */
PolygonDrawing.prototype.handleMouseMove = function (mousePosition) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("mousePosition", mousePosition);
  //>>includeEnd('debug');

  if (this._mode !== DrawingMode.Drawing) {
    return;
  }
  const scene = this._scene;
  const nextPos = PolygonDrawing._getWorldPosition(
    scene,
    mousePosition,
    filterPickForMeasurement,
    cart3Scratch,
  );
  if (!defined(nextPos)) {
    return;
  }
  const positions = this._positions.slice();
  positions.push(Cartesian3.clone(nextPos, this._tempNextPos));
  this._polyline.positions = positions;
  this._polygon.positions = positions;

  return nextPos;
};

/**
 * @returns {Boolean} true if the object has been destroyed, false otherwise.
 */
PolygonDrawing.prototype.isDestroyed = function () {
  return false;
};

/**
 * Destroys the widget.
 */
PolygonDrawing.prototype.destroy = function () {
  const primitives = this._primitives;
  if (this._removePoints) {
    primitives.remove(this._points);
  } else {
    const points = this._points;
    const pointCollection = this._pointCollection;
    for (let i = 0; i < points.length; i++) {
      pointCollection.remove(points[i]);
    }
  }

  primitives.remove(this._polygon);
  primitives.remove(this._polyline);

  return destroyObject(this);
};

// Exposed for specs
PolygonDrawing._getWorldPosition = getWorldPosition;
export default PolygonDrawing;
