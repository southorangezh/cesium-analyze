import {
  Cartesian2,
  Cartesian3,
  Cartographic,
  Check,
  defined,
  IntersectionTests,
  Frozen,
  Plane,
  Ray,
  Material,
  SceneMode,
} from "@cesium/engine";
import DrawingMode from "./DrawingMode.js";
import PolylineDrawing from "./PolylineDrawing.js";
import PolylinePrimitive from "./PolylinePrimitive.js";

const clickDistanceScratch = new Cartesian2();
const cart3Scratch = new Cartesian3();
const cart3Scratch1 = new Cartesian3();
const normalScratch = new Cartesian3();
const rayScratch = new Ray();
const v1Scratch = new Cartesian3();
const v2Scratch = new Cartesian3();
const cartoScratch = new Cartographic();

const mouseDelta = 10;

/**
 * @private
 * @ionsdk
 */
function HorizontalPolylineDrawing(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  //>>includeStart('debug', pragmas.debug);
  Check.defined("options.scene", options.scene);
  //>>includeEnd('debug');
  PolylineDrawing.call(this, options);
  const polylineOptions = options.polylineOptions ?? Frozen.EMPTY_OBJECT;

  const dashLineOptions = {
    color: polylineOptions.color,
    ellipsoid: polylineOptions.ellipsoid,
    width: 2,
    materialType: Material.PolylineDashType,
    allowPicking: false,
  };
  const moveDashLine = this._primitives.add(
    new PolylinePrimitive(dashLineOptions),
  );
  moveDashLine.positions = [new Cartesian3(), new Cartesian3()];
  moveDashLine.show = false;
  this._dashLineOptions = dashLineOptions;
  this._dashedLines = [];
  this._moveDashLine = moveDashLine;

  this._heightPlane = new Plane(Cartesian3.UNIT_X, 0);
  this._heightPlaneCV = new Plane(Cartesian3.UNIT_X, 0);
  this._firstMove = false;
  this._height = 0;
}

HorizontalPolylineDrawing.prototype = Object.create(PolylineDrawing.prototype);
HorizontalPolylineDrawing.prototype.constructor = HorizontalPolylineDrawing;

HorizontalPolylineDrawing.prototype._setDashLinePositions = function (
  line,
  position,
) {
  const globe = this._scene.globe;
  const ellipsoid = this._scene.frameState.mapProjection.ellipsoid;

  const positions = line.positions;
  positions[0] = Cartesian3.clone(position, positions[0]);

  const carto = ellipsoid.cartesianToCartographic(position, cartoScratch);
  if (defined(globe)) {
    carto.height = globe.getHeight(carto) ?? 0;
  } else {
    carto.height = 0;
  }
  positions[1] = ellipsoid.cartographicToCartesian(carto, positions[1]);
  line.positions = positions;
};

/**
 * Adds a point to the polyline.
 * @param {Cartesian3} position The position to add
 * @private
 */
HorizontalPolylineDrawing.prototype.addPoint = function (position) {
  PolylineDrawing.prototype.addPoint.call(this, position);

  const dashLine = this._primitives.add(
    new PolylinePrimitive(this._dashLineOptions),
  );
  dashLine.positions = [new Cartesian3(), new Cartesian3()];
  this._dashedLines.push(dashLine);

  this._setDashLinePositions(dashLine, position);
};

/**
 * Ends drawing on double click.
 */
HorizontalPolylineDrawing.prototype.handleDoubleClick = function () {
  // expect point to be added by handleClick
  this._mode = DrawingMode.AfterDraw;

  // Sometimes a move event is fired between the ending
  // click and doubleClick events, so make sure the polyline
  // has the correct positions.
  this._polyline.positions = this._positions;
  this._moveDashLine.show = false;
};

/**
 * Handles click events while drawing a polyline.
 * @param {Cartesian2} clickPosition The click position
 */
HorizontalPolylineDrawing.prototype.handleClick = function (clickPosition) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("clickPosition", clickPosition);
  //>>includeEnd('debug');

  let pos;
  if (this._positions.length === 0) {
    const scene = this._scene;
    const ellipsoid = scene.frameState.mapProjection.ellipsoid;
    pos = PolylineDrawing.prototype.handleClick.call(this, clickPosition);
    if (!defined(pos)) {
      return;
    }
    this._heightPlane = Plane.fromPointNormal(
      pos,
      ellipsoid.geodeticSurfaceNormal(pos, normalScratch),
      this._heightPlane,
    );

    const cartoPos = ellipsoid.cartesianToCartographic(pos, cartoScratch);
    const planePoint = scene.mapProjection.project(cartoPos, cart3Scratch1);
    const posCV = Cartesian3.fromElements(
      planePoint.z,
      planePoint.x,
      planePoint.y,
      planePoint,
    );

    this._heightPlaneCV = Plane.fromPointNormal(
      posCV,
      Cartesian3.UNIT_X,
      this._heightPlaneCV,
    );
    this._height = ellipsoid.cartesianToCartographic(pos, cartoScratch).height;
    this._firstMove = true;
  } else {
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
    Cartesian2.clone(clickPosition, lastClickPos);
    pos = Cartesian3.clone(this._tempNextPos);
    this.addPoint(pos);
    this._firstMove = true;
  }
  return pos;
};

/**
 * Handles mouse move events while drawing a polyline.
 * @param {Cartesian2} mousePosition The mouse position
 * @param {Boolean} shift True if the shift key was pressed
 */
HorizontalPolylineDrawing.prototype.handleMouseMove = function (
  mousePosition,
  shift,
) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("mousePosition", mousePosition);
  Check.defined("shift", shift);
  //>>includeEnd('debug');

  if (this._mode !== DrawingMode.Drawing) {
    return;
  }
  const scene = this._scene;
  const ellipsoid = scene.frameState.mapProjection.ellipsoid;
  let positions = this._positions;

  let nextPos;
  const ray = scene.camera.getPickRay(mousePosition, rayScratch);
  if (scene.mode === SceneMode.SCENE3D) {
    nextPos = IntersectionTests.rayPlane(ray, this._heightPlane, cart3Scratch);
  } else if (scene.mode === SceneMode.COLUMBUS_VIEW) {
    nextPos = IntersectionTests.rayPlane(
      ray,
      this._heightPlaneCV,
      cart3Scratch,
    );
    nextPos = Cartesian3.fromElements(nextPos.y, nextPos.z, nextPos.x, nextPos);
    const carto = scene.mapProjection.unproject(nextPos, cartoScratch);
    nextPos = ellipsoid.cartographicToCartesian(carto, nextPos);
  } else {
    nextPos = scene.camera.pickEllipsoid(
      mousePosition,
      ellipsoid,
      cart3Scratch,
    );
    if (defined(nextPos)) {
      const cartoPos = ellipsoid.cartesianToCartographic(nextPos, cartoScratch);
      cartoPos.height = this._height;
      nextPos = ellipsoid.cartographicToCartesian(cartoPos, nextPos);
    }
  }

  if (!defined(nextPos)) {
    return;
  }

  if (!this._firstMove && shift) {
    const anchorPos = positions[positions.length - 1];
    const lastPos = this._tempNextPos;
    const direction = Cartesian3.subtract(lastPos, anchorPos, v1Scratch);
    let newDirection = Cartesian3.subtract(nextPos, anchorPos, v2Scratch);
    newDirection = Cartesian3.projectVector(
      newDirection,
      direction,
      newDirection,
    );
    nextPos = Cartesian3.add(anchorPos, newDirection, nextPos);
  }

  positions = positions.slice();
  positions.push(Cartesian3.clone(nextPos, this._tempNextPos));
  this._polyline.positions = positions;
  this._firstMove = false;
  this._moveDashLine.show = true;
  this._setDashLinePositions(this._moveDashLine, nextPos);

  return nextPos;
};

/**
 * @returns {Boolean} true if the object has been destroyed, false otherwise.
 */
HorizontalPolylineDrawing.prototype.isDestroyed = function () {
  return false;
};

/**
 * Destroys the widget.
 */
HorizontalPolylineDrawing.prototype.destroy = function () {
  const primitives = this._primitives;
  const dashLines = this._dashedLines;
  for (let i = 0; i < dashLines.length; i++) {
    primitives.remove(dashLines[i]);
  }
  primitives.remove(this._moveDashLine);

  PolylineDrawing.prototype.destroy.call(this);
};
export default HorizontalPolylineDrawing;
