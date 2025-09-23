import {
  BoundingSphere,
  Cartesian3,
  ClassificationType,
  Color,
  ColorGeometryInstanceAttribute,
  CoplanarPolygonGeometry,
  Ellipsoid,
  Frozen,
  GeometryInstance,
  GroundPrimitive,
  PerInstanceColorAppearance,
  PolygonGeometry,
  Primitive,
  createGuid,
  defined,
  destroyObject,
} from "@cesium/engine";

function createAppearance(color) {
  return new PerInstanceColorAppearance({
    flat: true,
    closed: false,
    translucent: color.alpha < 1.0,
  });
}

/**
 * @private
 * @ionsdk
 *
 * note: this contains functionality used by cesium-earthworks and smart-construction
 * that is not used by cesium-analytics.
 */
function PolygonPrimitive(options) {
  options = options ?? Frozen.EMPTY_OBJECT;

  this.show = options.show ?? true;

  this._id = defined(options.id) ? options.id : createGuid();
  this._ellipsoid = options.ellipsoid ?? Ellipsoid.WGS84;
  this._color = Color.clone(options.color ?? Color.WHITE);
  this._depthFailColor = Color.clone(options.depthFailColor ?? this._color);
  this._positions = options.positions ?? [];
  this._clampToGround = options.clampToGround ?? false;
  this._classificationType =
    options.classificationType ?? ClassificationType.BOTH;
  this._allowPicking = options.allowPicking ?? true;

  this._boundingSphere = new BoundingSphere();
  this._primitive = undefined;
  this._update = true;
}

Object.defineProperties(PolygonPrimitive.prototype, {
  positions: {
    get: function () {
      return this._positions;
    },
    set: function (positions) {
      this._positions = positions;
      this._update = true;
    },
  },
  color: {
    get: function () {
      return this._color;
    },
    set: function (value) {
      if (Color.equals(this._color, value)) {
        return;
      }
      this._color = Color.clone(value, this._color);
      if (defined(this._primitive)) {
        let color = this._primitive.getGeometryInstanceAttributes(
          this._id,
        ).color;
        color = value.toBytes(color);
        this._primitive.getGeometryInstanceAttributes(this._id).color = color;
      }
    },
  },
  depthFailColor: {
    get: function () {
      return this._depthFailColor;
    },
    set: function (value) {
      if (Color.equals(this._depthFailColor, value)) {
        return;
      }
      this._depthFailColor = Color.clone(value, this._depthFailColor);
      if (defined(this._primitive) && !this._clampToGround) {
        let color = this._primitive.getGeometryInstanceAttributes(
          this._id,
        ).depthFailColor;
        color = value.toBytes(color);
        this._primitive.getGeometryInstanceAttributes(this._id).depthFailColor =
          color;
      }
    },
  },
  id: {
    get: function () {
      return this._id;
    },
  },
  boundingVolume: {
    get: function () {
      return this._boundingSphere;
    },
  },
  ellipsoid: {
    get: function () {
      return this._ellipsoid;
    },
  },
  clampToGround: {
    get: function () {
      return this._clampToGround;
    },
  },
  classificationType: {
    get: function () {
      return this._classificationType;
    },
    set: function (classificationType) {
      this._classificationType = classificationType;
      this._update = true;
    },
  },
  allowPicking: {
    get: function () {
      return this._allowPicking;
    },
  },
});

PolygonPrimitive.prototype.update = function (frameState) {
  if (!this.show) {
    return;
  }

  const positions = this._positions;
  if (positions.length < 3) {
    this._primitive = this._primitive && this._primitive.destroy();
    return;
  }

  if (this._update) {
    this._update = false;

    this._primitive = this._primitive && this._primitive.destroy();
    this._primitive = this._clampToGround
      ? this._createGroundPolygon()
      : this._createPolygon();
    this._boundingSphere = BoundingSphere.fromPoints(
      positions,
      this._boundingSphere,
    );
  }

  this._primitive.update(frameState);
};

PolygonPrimitive.prototype._createPolygon = function () {
  return new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: CoplanarPolygonGeometry.fromPositions({
        positions: this._positions.map(function (position) {
          return Cartesian3.clone(position);
        }),
        vertexFormat: PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
        ellipsoid: this._ellipsoid,
      }),
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(this._color),
        depthFailColor: ColorGeometryInstanceAttribute.fromColor(
          this._depthFailColor,
        ),
      },
      id: this._id,
    }),
    appearance: createAppearance(this._color),
    depthFailAppearance: createAppearance(this._color),
    allowPicking: this._allowPicking,
    asynchronous: false,
  });
};

PolygonPrimitive.prototype._createGroundPolygon = function () {
  return new GroundPrimitive({
    geometryInstances: new GeometryInstance({
      geometry: PolygonGeometry.fromPositions({
        positions: this._positions.map(function (position) {
          return Cartesian3.clone(position);
        }),
        vertexFormat: PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
        ellipsoid: this._ellipsoid,
      }),
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(this._color),
      },
      id: this._id,
    }),
    appearance: createAppearance(this._color),
    allowPicking: this._allowPicking,
    asynchronous: false,
    classificationType: this._classificationType,
  });
};

PolygonPrimitive.prototype.isDestroyed = function () {
  return false;
};

PolygonPrimitive.prototype.destroy = function () {
  this._primitive = this._primitive && this._primitive.destroy();
  return destroyObject(this);
};

export default PolygonPrimitive;
