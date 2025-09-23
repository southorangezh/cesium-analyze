import {
  Cartesian3,
  Check,
  Color,
  ColorGeometryInstanceAttribute,
  ColorMaterialProperty,
  ConstantProperty,
  DeveloperError,
  DistanceDisplayConditionGeometryInstanceAttribute,
  GeometryInstance,
  GeometryUpdater,
  Iso8601,
  MaterialAppearance,
  PerInstanceColorAppearance,
  Property,
  ShowGeometryInstanceAttribute,
  defined,
  DynamicGeometryUpdater,
} from "@cesium/engine";
import FanGeometry from "../Core/FanGeometry.js";
import FanOutlineGeometry from "../Core/FanOutlineGeometry.js";

const scratchColor = new Color();
const positionScratch = new Cartesian3();
const defaultNumberOfRings = new ConstantProperty(6);

function FanGeometryOptions(entity) {
  this.id = entity;
  this.vertexFormat = undefined;
  this.directions = undefined;
  this.radius = undefined;
  this.perDirectionRadius = undefined;
  this.numberOfRings = undefined;
}

/**
 * A {@link GeometryUpdater} for {@link FanGeometry} and {@link FanOutlineGeometry}.
 * Clients do not normally create this class directly, but instead rely on {@link DataSourceDisplay}.
 * @alias FanGeometryUpdater
 * @ionsdk
 * @constructor
 *
 * @param {Entity} entity The object containing the geometry to be visualized.
 * @param {Scene} scene The scene where visualization is taking place.
 */
function FanGeometryUpdater(entity, scene) {
  GeometryUpdater.call(this, {
    entity: entity,
    scene: scene,
    geometryOptions: new FanGeometryOptions(entity),
    geometryPropertyName: "fan",
    observedPropertyNames: ["availability", "position", "fan"],
  });

  this._onEntityPropertyChanged(entity, "fan", entity.fan, undefined);
}

if (defined(Object.create)) {
  FanGeometryUpdater.prototype = Object.create(GeometryUpdater.prototype);
  FanGeometryUpdater.prototype.constructor = FanGeometryUpdater;
}

/**
 * Creates the geometry instance which represents the fill of the geometry.
 *
 * @param {JulianDate} time The time to use when retrieving initial attribute values.
 * @returns {GeometryInstance} The geometry instance representing the filled portion of the geometry.
 *
 * @exception {DeveloperError} This instance does not represent a filled geometry.
 */
FanGeometryUpdater.prototype.createFillGeometryInstance = function (time) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("time", time);

  if (!this._fillEnabled) {
    throw new DeveloperError(
      "This instance does not represent a filled geometry.",
    );
  }
  //>>includeEnd('debug');

  const entity = this._entity;
  const isAvailable = entity.isAvailable(time);

  let attributes;

  let color;
  const show = new ShowGeometryInstanceAttribute(
    isAvailable &&
      entity.isShowing &&
      this._showProperty.getValue(time) &&
      this._fillProperty.getValue(time),
  );
  const distanceDisplayCondition =
    this._distanceDisplayConditionProperty.getValue(time);
  const distanceDisplayConditionAttribute =
    DistanceDisplayConditionGeometryInstanceAttribute.fromDistanceDisplayCondition(
      distanceDisplayCondition,
    );
  if (this._materialProperty instanceof ColorMaterialProperty) {
    let currentColor;
    if (
      defined(this._materialProperty.color) &&
      (this._materialProperty.color.isConstant || isAvailable)
    ) {
      currentColor = this._materialProperty.color.getValue(time, scratchColor);
    }
    if (!defined(currentColor)) {
      currentColor = Color.WHITE;
    }
    color = ColorGeometryInstanceAttribute.fromColor(currentColor);
    attributes = {
      show: show,
      distanceDisplayCondition: distanceDisplayConditionAttribute,
      color: color,
    };
  } else {
    attributes = {
      show: show,
      distanceDisplayCondition: distanceDisplayConditionAttribute,
    };
  }

  return new GeometryInstance({
    id: entity,
    geometry: new FanGeometry(this._options),
    modelMatrix: entity.computeModelMatrix(time),
    attributes: attributes,
  });
};

/**
 * Creates the geometry instance which represents the outline of the geometry.
 *
 * @param {JulianDate} time The time to use when retrieving initial attribute values.
 * @returns {GeometryInstance} The geometry instance representing the outline portion of the geometry.
 *
 * @exception {DeveloperError} This instance does not represent an outlined geometry.
 */
FanGeometryUpdater.prototype.createOutlineGeometryInstance = function (time) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("time", time);

  if (!this._outlineEnabled) {
    throw new DeveloperError(
      "This instance does not represent an outlined geometry.",
    );
  }
  //>>includeEnd('debug');

  const entity = this._entity;
  const isAvailable = entity.isAvailable(time);
  const outlineColor = Property.getValueOrDefault(
    this._outlineColorProperty,
    time,
    Color.BLACK,
    scratchColor,
  );
  const distanceDisplayCondition =
    this._distanceDisplayConditionProperty.getValue(time);

  return new GeometryInstance({
    id: entity,
    geometry: new FanOutlineGeometry(this._options),
    modelMatrix: entity.computeModelMatrix(time),
    attributes: {
      show: new ShowGeometryInstanceAttribute(
        isAvailable &&
          this._showProperty.getValue(time) &&
          this._showOutlineProperty.getValue(time),
      ),
      color: ColorGeometryInstanceAttribute.fromColor(outlineColor),
      distanceDisplayCondition:
        DistanceDisplayConditionGeometryInstanceAttribute.fromDistanceDisplayCondition(
          distanceDisplayCondition,
        ),
    },
  });
};

FanGeometryUpdater.prototype._isHidden = function (entity, fan) {
  return (
    !defined(entity.position) ||
    (!defined(fan.perDirectionRadius) && !defined(fan.radius)) ||
    GeometryUpdater.prototype._isHidden.call(this, entity, fan)
  );
};

FanGeometryUpdater.prototype._isDynamic = function (entity, fan) {
  return (
    !Property.isConstant(entity.position) ||
    !Property.isConstant(entity.orientation) ||
    !Property.isConstant(fan.perDirectionRadius) ||
    !Property.isConstant(fan.radius) ||
    !Property.isConstant(fan.directions) ||
    !Property.isConstant(fan.outlineWidth) ||
    !Property.isConstant(fan.numberOfRings)
  );
};

FanGeometryUpdater.prototype._getIsClosed = function () {
  return false;
};

FanGeometryUpdater.prototype._setStaticOptions = function (entity, fan) {
  const isColorMaterial =
    this._materialProperty instanceof ColorMaterialProperty;
  const numberOfRings = fan.numberOfRings ?? defaultNumberOfRings;

  const options = this._options;
  options.vertexFormat = isColorMaterial
    ? PerInstanceColorAppearance.VERTEX_FORMAT
    : MaterialAppearance.VERTEX_FORMAT;
  options.directions = fan.directions.getValue(
    Iso8601.MINIMUM_VALUE,
    options.directions,
  );
  options.radius = defined(fan.radius)
    ? fan.radius.getValue(Iso8601.MINIMUM_VALUE)
    : undefined;
  options.perDirectionRadius = defined(fan.perDirectionRadius)
    ? fan.perDirectionRadius.getValue(Iso8601.MINIMUM_VALUE)
    : undefined;
  options.numberOfRings = numberOfRings.getValue(Iso8601.MINIMUM_VALUE);
};

FanGeometryUpdater.DynamicGeometryUpdater = DynamicFanGeometryUpdater;

/**
 * @private
 */
function DynamicFanGeometryUpdater(
  geometryUpdater,
  primitives,
  groundPrimitives,
) {
  DynamicGeometryUpdater.call(
    this,
    geometryUpdater,
    primitives,
    groundPrimitives,
  );
}

if (defined(Object.create)) {
  DynamicFanGeometryUpdater.prototype = Object.create(
    DynamicGeometryUpdater.prototype,
  );
  DynamicFanGeometryUpdater.prototype.constructor = DynamicFanGeometryUpdater;
}

DynamicFanGeometryUpdater.prototype._isHidden = function (entity, fan, time) {
  const position = Property.getValueOrUndefined(
    entity.position,
    time,
    positionScratch,
  );
  const options = this._options;
  return (
    !defined(position) ||
    (!defined(options.perDirectionRadius) && !defined(options.radius)) ||
    DynamicGeometryUpdater.prototype._isHidden.call(this, entity, fan, time)
  );
};

DynamicFanGeometryUpdater.prototype._setOptions = function (entity, fan, time) {
  const radius = fan.radius;
  const perDirectionRadius = fan.perDirectionRadius;
  const numberOfRings = fan.numberOfRings ?? defaultNumberOfRings;

  const options = this._options;
  options.directions = fan.directions.getValue(time, options.directions);
  options.radius = defined(radius) ? radius.getValue(time) : undefined;
  options.perDirectionRadius = defined(perDirectionRadius)
    ? perDirectionRadius.getValue(time)
    : undefined;
  options.numberOfRings = numberOfRings.getValue(time);
};
export default FanGeometryUpdater;
