import {
  Cartesian2,
  Cartesian3,
  Check,
  Color,
  ColorGeometryInstanceAttribute,
  createGuid,
  defined,
  destroyObject,
  Frozen,
  GeometryInstance,
  Matrix4,
  Plane,
  PlaneGeometry,
  PlaneOutlineGeometry,
  WebGLConstants,
  PlaneGeometryUpdater,
  PerInstanceColorAppearance,
  Primitive,
} from "@cesium/engine";
import getScreenSpaceScalingMatrix from "../getScreenSpaceScalingMatrix.js";

const defaultOutlineColor = Color.WHITE;
const defaultFrontColor = Color.RED.withAlpha(0.2);
const defaultBackColor = Color.CYAN.withAlpha(0.2);
const defaultHighlightColor = Color.WHITE.withAlpha(0.2);
const defaultPixelSize = new Cartesian2(100, 100);
const defaultMaximumMeterSize = new Cartesian2(Infinity, Infinity);
const defaultSize = new Cartesian2(50, 50);

function updateModelMatrix(clippingPlane, transform, frameState) {
  let modelMatrix;
  if (Matrix4.equals(transform, Matrix4.IDENTITY)) {
    modelMatrix = Matrix4.clone(Matrix4.IDENTITY, clippingPlane._modelMatrix);
  } else {
    modelMatrix = PlaneGeometryUpdater.createPrimitiveMatrix(
      clippingPlane._initialPlane,
      clippingPlane._dimensions,
      transform,
      clippingPlane._modelMatrix,
    );
  }

  if (clippingPlane._pixelSize.x > 0 || clippingPlane._pixelSize.y > 0) {
    modelMatrix = getScreenSpaceScalingMatrix(
      clippingPlane._pixelSize,
      clippingPlane._maximumSizeInMeters,
      frameState,
      modelMatrix,
      modelMatrix,
    );
  }
  return modelMatrix;
}

const scratchPlane = new Plane(new Cartesian3(1.0, 0.0, 0.0), 0.0);
function updateClippingPlane(clippingPlane) {
  const updatedPlane = Plane.transform(
    clippingPlane._initialPlane,
    clippingPlane._localTransform,
    scratchPlane,
  );
  clippingPlane._clippingPlane.normal = updatedPlane.normal;
  clippingPlane._clippingPlane.distance = updatedPlane.distance;
}

/**
 * @private
 * @ionsdk
 */
function ClippingPlanePrimitive(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  const clippingPlane = options.clippingPlane;
  const transform = options.transform;
  const size = Cartesian2.clone(options.size ?? defaultSize);

  //>>includeStart('debug', pragmas.debug);
  Check.defined("options.clippingPlane", clippingPlane);
  Check.defined("options.transform", transform);
  //>>includeEnd('debug');

  const localTransform =
    options.localTransform ?? Matrix4.clone(Matrix4.IDENTITY);
  this._worldTransform = Matrix4.multiplyTransformation(
    transform,
    localTransform,
    new Matrix4(),
  );
  this._worldNormalTransform = Matrix4.inverseTranspose(
    this._worldTransform,
    new Matrix4(),
  );
  this._normalWC = Matrix4.multiplyByPointAsVector(
    this._worldNormalTransform,
    clippingPlane.normal,
    new Cartesian3(),
  );
  this._normalWC = Cartesian3.normalize(this._normalWC, this._normalWC);

  this.show = options.show ?? true;

  this._disableDepthFail = options.disableDepthFail ?? false;
  this._outlineColor = options.outlineColor ?? defaultOutlineColor;
  this._frontColor = options.frontColor ?? defaultFrontColor;
  this._backColor = options.backColor ?? defaultBackColor;
  this._highlightColor = options.highlightColor ?? defaultHighlightColor;
  this._pixelSize = Cartesian2.clone(options.pixelSize ?? defaultPixelSize);
  this._maximumSizeInMeters = Cartesian2.clone(
    options.maximumSizeInMeters ?? defaultMaximumMeterSize,
  );

  this._initialPlane = new Plane(clippingPlane.normal, clippingPlane.distance);
  this._clippingPlane = clippingPlane;

  this._backPrimitiveId = {
    name: "back",
    plane: this,
  };
  this._frontPrimitiveId = {
    name: "front",
    plane: this,
  };
  this._primitiveOutlineId = createGuid();

  this._modelMatrix = Matrix4.IDENTITY.clone();
  this._originalDistance = clippingPlane.distance;

  // Tileset/reference transform is shallow copied so that when the tileset or the reference
  // object is changed, the clipping plane geometry will change/move with them.
  this._transform = transform;
  this._initialLocalTransform = Matrix4.clone(localTransform);
  this._localTransform = localTransform;

  this._centerPositionScratch = new Cartesian3();
  this._highlighted = false;
  this._dimensions = size;

  this._backPrimitive = undefined;
  this._frontPrimitive = undefined;
  this._outlinePrimitive = undefined;

  this._update = true;
}

Object.defineProperties(ClippingPlanePrimitive.prototype, {
  size: {
    get: function () {
      return this._dimensions;
    },
  },
  clippingPlane: {
    get: function () {
      return this._clippingPlane;
    },
  },
  transform: {
    get: function () {
      return this._transform;
    },
  },
  localTransform: {
    get: function () {
      return this._localTransform;
    },
  },
  centerPosition: {
    get: function () {
      const point = this._centerPositionScratch;
      Cartesian3.clone(Cartesian3.ZERO, point);
      return Matrix4.multiplyByPoint(this._modelMatrix, point, point);
    },
  },
  frontColor: {
    get: function () {
      return this._highlighted ? this._highlightColor : this._frontColor;
    },
  },
  backColor: {
    get: function () {
      return this._highlighted ? this._highlightColor : this._backColor;
    },
  },
  pixelSize: {
    get: function () {
      return this._pixelSize;
    },
  },
  maximumSizeInMeters: {
    get: function () {
      return this._maximumSizeInMeters;
    },
  },
});

ClippingPlanePrimitive.prototype.highlight = function (highlight) {
  this._highlighted = highlight;

  if (defined(this._backPrimitive)) {
    let depthFailColor;

    let newColor = this.backColor;
    let color = this._backPrimitive.getGeometryInstanceAttributes(
      this._backPrimitiveId,
    ).color;
    color[0] = Color.floatToByte(newColor.red);
    color[1] = Color.floatToByte(newColor.green);
    color[2] = Color.floatToByte(newColor.blue);
    color[3] = Color.floatToByte(newColor.alpha);
    this._backPrimitive.getGeometryInstanceAttributes(
      this._backPrimitiveId,
    ).color = color;

    if (!this._disableDepthFail) {
      depthFailColor = this._backPrimitive.getGeometryInstanceAttributes(
        this._backPrimitiveId,
      ).depthFailColor;
      depthFailColor[0] = Color.floatToByte(newColor.red);
      depthFailColor[1] = Color.floatToByte(newColor.green);
      depthFailColor[2] = Color.floatToByte(newColor.blue);
      depthFailColor[3] = Color.floatToByte(newColor.alpha);
      this._backPrimitive.getGeometryInstanceAttributes(
        this._backPrimitiveId,
      ).depthFailColor = depthFailColor;
    }

    newColor = this.frontColor;
    color = this._frontPrimitive.getGeometryInstanceAttributes(
      this._frontPrimitiveId,
    ).color;
    color[0] = Color.floatToByte(newColor.red);
    color[1] = Color.floatToByte(newColor.green);
    color[2] = Color.floatToByte(newColor.blue);
    color[3] = Color.floatToByte(newColor.alpha);
    this._frontPrimitive.getGeometryInstanceAttributes(
      this._frontPrimitiveId,
    ).color = color;

    if (!this._disableDepthFail) {
      depthFailColor = this._frontPrimitive.getGeometryInstanceAttributes(
        this._frontPrimitiveId,
      ).depthFailColor;
      depthFailColor[0] = Color.floatToByte(newColor.red);
      depthFailColor[1] = Color.floatToByte(newColor.green);
      depthFailColor[2] = Color.floatToByte(newColor.blue);
      depthFailColor[3] = Color.floatToByte(newColor.alpha);
      this._frontPrimitive.getGeometryInstanceAttributes(
        this._frontPrimitiveId,
      ).depthFailColor = depthFailColor;
    }
  }
};

ClippingPlanePrimitive.prototype.reset = function () {
  this._clippingPlane.normal = Cartesian3.clone(
    this._initialPlane.normal,
    this._clippingPlane.normal,
  );
  this._clippingPlane.distance = this._initialPlane.distance;
  this._localTransform = Matrix4.clone(
    this._initialLocalTransform,
    this._localTransform,
  );
  this._update = true;
};

ClippingPlanePrimitive.prototype.update = function (frameState) {
  if (!this.show) {
    return;
  }

  const clippingPlane = this._clippingPlane;

  // update world and normal transform
  this._worldTransform = Matrix4.multiplyTransformation(
    this._transform,
    this._localTransform,
    this._worldTransform,
  );
  this._worldNormalTransform = Matrix4.inverseTranspose(
    this._worldTransform,
    this._worldNormalTransform,
  );

  // update normal world vector
  this._normalWC = Matrix4.multiplyByPointAsVector(
    this._worldNormalTransform,
    clippingPlane.normal,
    this._normalWC,
  );
  Cartesian3.normalize(this._normalWC, this._normalWC);

  // update model transform
  const modelMatrix = updateModelMatrix(this, this._worldTransform, frameState);

  // update clipping plane
  updateClippingPlane(this);

  if (this._update) {
    this._update = false;

    this._frontPrimitive =
      this._frontPrimitive && this._frontPrimitive.destroy();
    this._backPrimitive = this._backPrimitive && this._backPrimitive.destroy();
    this._outlinePrimitive =
      this._outlinePrimitive && this._outlinePrimitive.destroy();

    let backPrimitiveGeometryDepthFailColor;
    let backPrimitiveDepthFailAppearance;

    let frontPrimitiveGeometryDepthFailColor;
    let frontPrimitiveDepthFailAppearance;

    if (!this._disableDepthFail) {
      backPrimitiveGeometryDepthFailColor =
        ColorGeometryInstanceAttribute.fromColor(this.backColor);
      backPrimitiveDepthFailAppearance = new PerInstanceColorAppearance({
        flat: true,
        closed: false,
        translucent: true,
        renderState: {
          cull: {
            enabled: true,
          },
        },
      });

      frontPrimitiveGeometryDepthFailColor =
        ColorGeometryInstanceAttribute.fromColor(this.frontColor);
      frontPrimitiveDepthFailAppearance = new PerInstanceColorAppearance({
        flat: true,
        closed: false,
        translucent: true,
        renderState: {
          cull: {
            enabled: true,
            face: WebGLConstants.FRONT,
          },
        },
      });
    }

    this._backPrimitive = new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: PlaneGeometry.createGeometry(new PlaneGeometry()),
        attributes: {
          color: ColorGeometryInstanceAttribute.fromColor(this.backColor),
          depthFailColor: backPrimitiveGeometryDepthFailColor,
        },
        id: this._backPrimitiveId,
      }),
      appearance: new PerInstanceColorAppearance({
        flat: true,
        closed: false,
        translucent: true,
        renderState: {
          cull: {
            enabled: true,
          },
        },
      }),
      depthFailAppearance: backPrimitiveDepthFailAppearance,
      asynchronous: false,
    });

    this._frontPrimitive = new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: PlaneGeometry.createGeometry(new PlaneGeometry()),
        attributes: {
          color: ColorGeometryInstanceAttribute.fromColor(this.frontColor),
          depthFailColor: frontPrimitiveGeometryDepthFailColor,
        },
        id: this._frontPrimitiveId,
      }),
      appearance: new PerInstanceColorAppearance({
        flat: true,
        closed: false,
        translucent: true,
        renderState: {
          cull: {
            enabled: true,
            face: WebGLConstants.FRONT,
          },
        },
      }),
      depthFailAppearance: frontPrimitiveDepthFailAppearance,
      asynchronous: false,
    });

    this._outlinePrimitive = new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: PlaneOutlineGeometry.createGeometry(
          new PlaneOutlineGeometry(),
        ),
        attributes: {
          color: ColorGeometryInstanceAttribute.fromColor(this._outlineColor),
        },
        id: this._primitiveOutlineId,
      }),
      appearance: new PerInstanceColorAppearance({
        flat: true,
        translucent: false,
        renderState: {
          lineWidth: 1.0,
        },
      }),
      asynchronous: false,
    });
  }

  this._backPrimitive.modelMatrix = modelMatrix;
  this._frontPrimitive.modelMatrix = modelMatrix;
  this._outlinePrimitive.modelMatrix = modelMatrix;

  this._backPrimitive.update(frameState);
  this._frontPrimitive.update(frameState);
  this._outlinePrimitive.update(frameState);
};

ClippingPlanePrimitive.prototype.isDestroyed = function () {
  return false;
};

ClippingPlanePrimitive.prototype.destroy = function () {
  if (defined(this._backPrimitive)) {
    this._backPrimitive.destroy();
  }
  if (defined(this._frontPrimitive)) {
    this._frontPrimitive.destroy();
  }
  if (defined(this._outlinePrimitive)) {
    this._outlinePrimitive.destroy();
  }

  return destroyObject(this);
};
export default ClippingPlanePrimitive;
