import {
  ArcType,
  BoundingSphere,
  ClassificationType,
  Color,
  ColorGeometryInstanceAttribute,
  Ellipsoid,
  Frozen,
  GeometryInstance,
  GroundPolylineGeometry,
  GroundPolylinePrimitive,
  Material,
  PolylineColorAppearance,
  PolylineGeometry,
  PolylineMaterialAppearance,
  Primitive,
  createGuid,
  defined,
  destroyObject,
} from "@cesium/engine";

function createAppearance(materialType, color, uniforms) {
  if (defined(materialType)) {
    uniforms = defined(uniforms) ? uniforms : {};
    uniforms.color = color;
    return new PolylineMaterialAppearance({
      material: Material.fromType(materialType, uniforms),
    });
  }
  return new PolylineColorAppearance();
}

/**
 * @private
 * @ionsdk
 *
 * note: this contains functionality used by cesium-earthworks and smart-construction
 * that is not used by cesium-analytics.
 */
function PolylinePrimitive(options) {
  options = options ?? Frozen.EMPTY_OBJECT;

  this.show = options.show ?? true;

  this._id = defined(options.id) ? options.id : createGuid();
  this._ellipsoid = options.ellipsoid ?? Ellipsoid.WGS84;
  this._width = options.width ?? 3;
  this._color = Color.clone(options.color ?? Color.WHITE);
  this._depthFailColor = Color.clone(options.depthFailColor ?? this._color);

  this._positions = options.positions ?? [];
  this._materialType = options.materialType;
  this._depthFailMaterialType =
    options.depthFailMaterialType ?? this._materialType;

  this._uniforms = options.uniforms ?? undefined;
  this._depthFailUniforms = options.depthFailUniforms ?? this._uniforms;

  this._loop = options.loop ?? false;
  this._clampToGround = options.clampToGround ?? false;
  this._classificationType =
    options.classificationType ?? ClassificationType.BOTH;
  this._allowPicking = options.allowPicking ?? true;

  this._boundingSphere = new BoundingSphere();
  this._primitive = undefined;
  this._update = true;
}

Object.defineProperties(PolylinePrimitive.prototype, {
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
  materialType: {
    get: function () {
      return this._materialType;
    },
    set: function (value) {
      if (value !== this._materialType) {
        this._materialType = value;
        this._update = true;
      }
    },
  },
  depthFailMaterialType: {
    get: function () {
      return this._depthFailMaterialType;
    },
    set: function (value) {
      if (value !== this._depthFailMaterialType) {
        this._depthFailMaterialType = value;
        this._update = true;
      }
    },
  },
  uniforms: {
    get: function () {
      return this._uniforms;
    },
    set: function (value) {
      if (value === this._uniforms) {
        return;
      }

      this._uniforms = value;

      if (!defined(value) || !defined(this._primitive)) {
        return;
      }

      const materialUniforms = this._primitive.appearance.material.uniforms;
      for (const name in value) {
        if (value.hasOwnProperty(name)) {
          materialUniforms[name] = value[name];
        }
      }
    },
  },
  depthFailUniforms: {
    get: function () {
      return this._depthFailUniforms;
    },
    set: function (value) {
      if (value === this._depthFailUniforms) {
        return;
      }

      this._depthFailUniforms = value;

      if (!defined(value) || !defined(this._primitive)) {
        return;
      }

      const materialUniforms =
        this._primitive.depthFailAppearance.material.uniforms;
      for (const name in value) {
        if (value.hasOwnProperty(name)) {
          materialUniforms[name] = value[name];
        }
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
  width: {
    get: function () {
      return this._width;
    },
  },
  ellipsoid: {
    get: function () {
      return this._ellipsoid;
    },
  },
  loop: {
    get: function () {
      return this._loop;
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

PolylinePrimitive.prototype.update = function (frameState) {
  if (!this.show) {
    return;
  }

  const positions = this._positions;
  if (!defined(positions) || positions.length < 2) {
    this._primitive = this._primitive && this._primitive.destroy();
    return;
  }

  if (this._update) {
    this._update = false;

    this._primitive = this._primitive && this._primitive.destroy();
    this._primitive = this._clampToGround
      ? this._createGroundPolyline()
      : this._createPolyline();
    this._boundingSphere = BoundingSphere.fromPoints(
      positions,
      this._boundingSphere,
    );
  }

  this._primitive.update(frameState);
};

PolylinePrimitive.prototype._createPolyline = function () {
  let positions = this._positions;
  if (this._loop && positions.length > 2) {
    positions = positions.slice();
    positions.push(positions[0]);
  }

  return new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: new PolylineGeometry({
        positions: positions,
        width: this._width,
        vertexFormat: PolylineMaterialAppearance.VERTEX_FORMAT,
        ellipsoid: this._ellipsoid,
        arcType: ArcType.NONE,
      }),
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(this._color),
        depthFailColor: ColorGeometryInstanceAttribute.fromColor(
          this._depthFailColor,
        ),
      },
      id: this._id,
    }),
    appearance: createAppearance(
      this._materialType,
      this._color,
      this._uniforms,
    ),
    depthFailAppearance: createAppearance(
      this._depthFailMaterialType,
      this._depthFailColor,
      this._depthFailUniforms,
    ),
    asynchronous: false,
    allowPicking: this._allowPicking,
  });
};

PolylinePrimitive.prototype._createGroundPolyline = function () {
  let positions = this._positions;
  if (this._loop && positions.length > 2) {
    positions = positions.slice();
    positions.push(positions[0]);
  }

  const geometry = new GroundPolylineGeometry({
    positions: positions,
    width: this._width,
    vertexFormat: PolylineMaterialAppearance.VERTEX_FORMAT,
    ellipsoid: this._ellipsoid,
    arcType: ArcType.GEODESIC,
  });
  return new GroundPolylinePrimitive({
    geometryInstances: new GeometryInstance({
      geometry: geometry,
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(this._color),
      },
      id: this._id,
    }),
    appearance: createAppearance(
      this._materialType,
      this._color,
      this._uniforms,
    ),
    asynchronous: false,
    allowPicking: this._allowPicking,
    classificationType: this._classificationType,
  });
};

PolylinePrimitive.prototype.isDestroyed = function () {
  return false;
};

PolylinePrimitive.prototype.destroy = function () {
  this._primitive = this._primitive && this._primitive.destroy();
  return destroyObject(this);
};

export default PolylinePrimitive;
