import {
  Cartesian2,
  Cartesian3,
  Check,
  defined,
  destroyObject,
  DeveloperError,
  Frozen,
  HeadingPitchRoll,
  Math as CesiumMath,
  Matrix3,
  Matrix4,
  Quaternion,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Transforms,
  SceneTransforms,
} from "@cesium/engine";
import knockout from "../ThirdParty/knockout.js";

import getWidgetOrigin from "./getWidgetOrigin.js";
import RotationEditor from "./RotationEditor.js";
import ScaleEditor from "./ScaleEditor.js";
import TranslationEditor from "./TranslationEditor.js";
import EditorMode from "./EditorMode.js";

const widgetPosition = new Cartesian3();
const screenPosition = new Cartesian2();

const noScale = new Cartesian3(1.0, 1.0, 1.0);
const transformScratch = new Matrix4();
const vectorScratch = new Cartesian3();
const scaleScratch = new Cartesian3();
const defaultPixelSize = 100;
const defaultMaximumMeterSize = Infinity;

const setHprQuaternion = new Quaternion();
const setHprQuaternion2 = new Quaternion();
const setHprTranslation = new Cartesian3();
const setHprScale = new Cartesian3();
const setHprCenter = new Cartesian3();
const setHprTransform = new Matrix4();
const setHprRotation = new Matrix3();

function setHeadingPitchRoll(transform, headingPitchRoll) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("transform", transform);
  Check.defined("headingPitchRoll", headingPitchRoll);
  //>>includeEnd('debug');

  const rotationQuaternion = Quaternion.fromHeadingPitchRoll(
    headingPitchRoll,
    setHprQuaternion,
  );
  const translation = Matrix4.getTranslation(transform, setHprTranslation);
  const scale = Matrix4.getScale(transform, setHprScale);
  const center = Matrix4.multiplyByPoint(
    transform,
    Cartesian3.ZERO,
    setHprCenter,
  );
  const backTransform = Transforms.eastNorthUpToFixedFrame(
    center,
    undefined,
    setHprTransform,
  );

  const rotationFixed = Matrix4.getMatrix3(backTransform, setHprRotation);
  const quaternionFixed = Quaternion.fromRotationMatrix(
    rotationFixed,
    setHprQuaternion2,
  );
  const rotation = Quaternion.multiply(
    quaternionFixed,
    rotationQuaternion,
    rotationFixed,
  );

  return Matrix4.fromTranslationQuaternionRotationScale(
    translation,
    rotation,
    scale,
    transform,
  );
}

/**
 * Creates an interactive transform editor
 * @alias TransformEditorViewModel
 * @ionsdk
 * @constructor
 *
 * @param {Object} options An object with the following properties
 * @param {Scene} options.scene The scene
 * @param {Matrix4} options.transform The transform of the primitive that needs positioning
 * @param {BoundingSphere} options.boundingSphere The bounding sphere of the primitive that needs positioning
 * @param {Cartesian3} [options.originOffset] A offset vector (in local coordinates) from the origin as defined by the transform translation.
 * @param {Number} [options.pixelSize=100] The desired size of the transformation widget in pixels. Set this to zero to disable screen space scaling.
 * @param {Number} [options.maximumSizeInMeters=Infinity] The maximum size of the transformation widget in meters. Set this to Infinity for no limit.
 */
function TransformEditorViewModel(options) {
  options = options ?? Frozen.EMPTY_OBJECT;

  //>>includeStart('debug', pragmas.debug);
  Check.defined("options.scene", options.scene);
  Check.defined("options.transform", options.transform);
  Check.defined("options.boundingSphere", options.boundingSphere);
  //>>includeEnd('debug');

  const scene = options.scene;
  let transform = options.transform;
  const boundingSphere = options.boundingSphere.clone();

  const originOffset = options.originOffset ?? Cartesian3.ZERO;

  let position = Matrix4.getTranslation(transform, new Cartesian3());
  const headingPitchRoll = Transforms.fixedFrameToHeadingPitchRoll(
    transform,
    scene.mapProjection.ellipsoid,
    undefined,
    new HeadingPitchRoll(),
  );
  const scale = Matrix4.getScale(transform, new Cartesian3());

  if (
    Cartesian3.equalsEpsilon(position, Cartesian3.ZERO, CesiumMath.EPSILON10)
  ) {
    position = Cartesian3.fromDegrees(
      0,
      0,
      0,
      scene.mapProjection.ellipsoid,
      position,
    );
    transform = Matrix4.setTranslation(transform, position, transform);
    setHeadingPitchRoll(transform, headingPitchRoll);
  }

  let nonUniformScaling = true;
  if (
    CesiumMath.equalsEpsilon(scale.x, scale.y, CesiumMath.EPSILON10) &&
    CesiumMath.equalsEpsilon(scale.x, scale.z, CesiumMath.EPSILON10)
  ) {
    nonUniformScaling = false;
    scale.y = scale.x;
    scale.z = scale.x;
  }

  const initialRadius =
    boundingSphere.radius / Cartesian3.maximumComponent(scale);

  this._pixelSize = options.pixelSize ?? defaultPixelSize;
  this._maximumSizeInMeters =
    options.maximumSizeInMeters ?? defaultMaximumMeterSize;

  //>>includeStart('debug', pragmas.debug);
  if (this._pixelSize < 0) {
    throw new DeveloperError(`pixelSize = ${this._pixelSize}, must be >= 0`);
  }

  if (this._maximumSizeInMeters < 0) {
    throw new DeveloperError(
      `maximumSizeInMeters = ${this._maximumSizeInMeters}, must be >= 0`,
    );
  }
  //>>includeEnd('debug');

  /**
   * Gets and sets the selected interactive mode.
   * @type {EditorMode}
   */
  this.editorMode = undefined;
  const editorMode = knockout.observable();
  knockout.defineProperty(this, "editorMode", {
    get: function () {
      return editorMode();
    },
    set: function (value) {
      editorMode(value);
      if (defined(this._activeEditor)) {
        this._activeEditor.active = false;
      }
      let activeEditor;
      if (value === EditorMode.ROTATION) {
        activeEditor = this._rotationEditor;
      } else if (value === EditorMode.TRANSLATION) {
        activeEditor = this._translationEditor;
      } else if (value === EditorMode.SCALE) {
        activeEditor = this._scaleEditor;
      }
      activeEditor.update();
      activeEditor.active = true;
      this._activeEditor = activeEditor;
    },
  });

  /**
   * Gets and sets whether non-uniform scaling is enabled
   * @type {Boolean}
   */
  this.enableNonUniformScaling = nonUniformScaling;
  const enableNonUniformScaling = knockout.observable(
    this.enableNonUniformScaling,
  );
  knockout.defineProperty(this, "enableNonUniformScaling", {
    get: function () {
      return enableNonUniformScaling();
    },
    set: function (value) {
      if (value === enableNonUniformScaling()) {
        return;
      }
      enableNonUniformScaling(value);
      if (!value) {
        this.scale = new Cartesian3(scale.x, scale.x, scale.x);
        if (scene.requestRenderMode) {
          scene.requestRender();
        }
      }
    },
  });

  /**
   * Gets and sets the position
   * @type {Cartesian3}
   */
  this.position = position;
  const positionObservable = knockout.observable(this.position);
  knockout.defineProperty(this, "position", {
    get: function () {
      return positionObservable();
    },
    set: function (value) {
      if (Cartesian3.equals(value, this.position)) {
        return;
      }
      const position = Cartesian3.clone(value, this.position);
      positionObservable(position);
      let transform = this._transform;
      transform = Matrix4.setTranslation(transform, position, transform);
      setHeadingPitchRoll(transform, this.headingPitchRoll);
      if (scene.requestRenderMode) {
        scene.requestRender();
      }
    },
  });

  /**
   * Gets and sets the heading pitch roll
   * @type {HeadingPitchRoll}
   */
  this.headingPitchRoll = headingPitchRoll;
  const headingPitchRollObservable = knockout.observable(this.headingPitchRoll);
  knockout.defineProperty(this, "headingPitchRoll", {
    get: function () {
      return headingPitchRollObservable();
    },
    set: function (value) {
      if (HeadingPitchRoll.equals(value, this.headingPitchRoll)) {
        return;
      }
      const hpr = HeadingPitchRoll.clone(value, this.headingPitchRoll);
      headingPitchRollObservable(hpr);
      setHeadingPitchRoll(this._transform, hpr);
      if (scene.requestRenderMode) {
        scene.requestRender();
      }
    },
  });

  /**
   * Gets and sets the scale
   * @type {Cartesian3}
   */
  this.scale = scale;
  const scaleObservable = knockout.observable(this.scale);
  knockout.defineProperty(this, "scale", {
    get: function () {
      return scaleObservable();
    },
    set: function (value) {
      if (Cartesian3.equals(value, this.scale)) {
        return;
      }
      const scale = Cartesian3.clone(value, this.scale);
      scaleObservable(scale);
      Matrix4.setScale(this._transform, scale, this._transform);
      this._translationEditor.update(); //applies the scale to the editing primitives
      this._rotationEditor.update();
      if (scene.requestRenderMode) {
        scene.requestRender();
      }
    },
  });

  /**
   * Gets and sets whether the menu is expanded
   * @type {Boolean}
   */
  this.menuExpanded = false;

  /**
   * Gets the x screen coordinate of the widget menu
   * @type {String}
   * @readonly
   */
  this.left = "0";

  /**
   * Gets the y screen coordinate of the widget menu
   * @type {String}
   * @readonly
   */
  this.top = "0";

  /**
   * Gets whether the widget is active.  Use the activate and deactivate functions to set this value.
   * @type {Boolean}
   * @readonly
   */
  this.active = false;

  knockout.track(this, ["menuExpanded", "left", "top", "active"]);

  const that = this;
  this._rotationEditor = new RotationEditor({
    scene: scene,
    transform: transform,
    radius: initialRadius,
    pixelSize: this._pixelSize,
    maximumSizeInMeters: this._maximumSizeInMeters,
    originOffset: originOffset,
    setPosition: function (value) {
      that.position = value;
    },
    setHeadingPitchRoll: function (value) {
      that.headingPitchRoll = value;
    },
  });
  this._translationEditor = new TranslationEditor({
    scene: scene,
    transform: transform,
    radius: initialRadius,
    pixelSize: this._pixelSize,
    maximumSizeInMeters: this._maximumSizeInMeters,
    originOffset: originOffset,
    setPosition: function (value) {
      that.position = value;
    },
  });
  this._scaleEditor = new ScaleEditor({
    scene: scene,
    transform: transform,
    enableNonUniformScaling: enableNonUniformScaling,
    radius: initialRadius,
    pixelSize: this._pixelSize,
    maximumSizeInMeters: this._maximumSizeInMeters,
    originOffset: originOffset,
    setScale: function (value) {
      that.scale = value;
    },
    setPosition: function (value) {
      that.position = value;
    },
  });

  this._sseh = new ScreenSpaceEventHandler(scene.canvas);
  this._scene = scene;
  this._transform = transform;
  this._boundingSphere = boundingSphere;
  this._active = false;
  this._activeEditor = undefined;
  this._originOffset = originOffset;

  this.position = position;
  this.headingPitchRoll = headingPitchRoll;
  this.scale = scale;

  this._removePostUpdateEvent = this._scene.preUpdate.addEventListener(
    TransformEditorViewModel.prototype._update,
    this,
  );
}

Object.defineProperties(TransformEditorViewModel.prototype, {
  /**
   * Gets and sets the offset of the transform editor UI components from the origin as defined by the transform
   * @type {Cartesian3}
   * @memberof TransformEditorViewModel
   */
  originOffset: {
    get: function () {
      return this._originOffset;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Check.defined("value", value);
      //>>includeEnd('debug');
      this._originOffset = value;

      this._translationEditor.originOffset = value;
      this._rotationEditor.originOffset = value;
      this._scaleEditor.originOffset = value;
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

/**
 * Sets the originOffset based on the Cartesian3 position in world coordinates
 * @param {Cartesian3} position
 */
TransformEditorViewModel.prototype.setOriginPosition = function (position) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("position", position);
  //>>includeEnd('debug');
  const transform = Matrix4.setScale(
    this._transform,
    noScale,
    transformScratch,
  );
  const worldToLocalCoordinates = Matrix4.inverseTransformation(
    transform,
    transform,
  );
  const point = Matrix4.multiplyByPoint(
    worldToLocalCoordinates,
    position,
    vectorScratch,
  );
  const offset = Cartesian3.divideComponents(
    point,
    Matrix4.getScale(this._transform, scaleScratch),
    point,
  );

  this.originOffset = offset;
};

/**
 * Activates the widget by showing the primitives and enabling mouse handlers
 */
TransformEditorViewModel.prototype.activate = function () {
  const sseh = this._sseh;
  const scene = this._scene;

  sseh.setInputAction(
    this._leftDown.bind(this),
    ScreenSpaceEventType.LEFT_DOWN,
  );
  sseh.setInputAction(this._leftUp.bind(this), ScreenSpaceEventType.LEFT_UP);
  sseh.setInputAction(
    this._mouseMove.bind(this),
    ScreenSpaceEventType.MOUSE_MOVE,
  );
  this.active = true;
  if (defined(this._activeEditor)) {
    this._activeEditor.active = true;
  } else {
    this.setModeTranslation();
  }
  if (scene.requestRenderMode) {
    scene.requestRender();
  }
};

/**
 * Deactivates the widget by disabling mouse handlers and hiding the primitives
 */
TransformEditorViewModel.prototype.deactivate = function () {
  const sseh = this._sseh;
  const scene = this._scene;

  sseh.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
  sseh.removeInputAction(ScreenSpaceEventType.LEFT_UP);
  sseh.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
  this.active = false;
  if (defined(this._activeEditor)) {
    this._activeEditor.active = false;
  }
  if (scene.requestRenderMode) {
    scene.requestRender();
  }
};

/**
 * Expands the widget menu
 */
TransformEditorViewModel.prototype.expandMenu = function () {
  this.menuExpanded = true;
};

/**
 * Activates the translation interactive mode
 */
TransformEditorViewModel.prototype.setModeTranslation = function () {
  this.editorMode = EditorMode.TRANSLATION;
  this.menuExpanded = false;
};

/**
 * Activates the rotation interactive mode
 */
TransformEditorViewModel.prototype.setModeRotation = function () {
  this.editorMode = EditorMode.ROTATION;
  this.menuExpanded = false;
};

/**
 * Activates the scale interactive mode
 */
TransformEditorViewModel.prototype.setModeScale = function () {
  this.editorMode = EditorMode.SCALE;
  this.menuExpanded = false;
};

/**
 * Toggles whether non-uniform scaling is enabled
 */
TransformEditorViewModel.prototype.toggleNonUniformScaling = function () {
  this.enableNonUniformScaling = !this.enableNonUniformScaling;
};

/**
 * @private
 */
TransformEditorViewModel.prototype._leftDown = function (click) {
  this._activeEditor.handleLeftDown(click.position);
  const scene = this._scene;
  if (scene.requestRenderMode) {
    scene.requestRender();
  }
};

/**
 * @private
 */
TransformEditorViewModel.prototype._mouseMove = function (movement) {
  this._activeEditor.handleMouseMove(movement.endPosition);
  const scene = this._scene;
  if (scene.requestRenderMode) {
    scene.requestRender();
  }
};

/**
 * @private
 */
TransformEditorViewModel.prototype._leftUp = function (click) {
  this.menuExpanded = false;
  this._activeEditor.handleLeftUp(click.position);
  const scene = this._scene;
  if (scene.requestRenderMode) {
    scene.requestRender();
  }
};

/**
 * Updates the active editor
 * @private
 */
TransformEditorViewModel.prototype._update = function () {
  if (!this.active) {
    return;
  }
  this._activeEditor.update();
  const scene = this._scene;
  const position = getWidgetOrigin(
    this._transform,
    this._originOffset,
    widgetPosition,
  );
  const newPos = SceneTransforms.worldToWindowCoordinates(
    scene,
    position,
    screenPosition,
  );
  if (defined(newPos)) {
    this.left = `${Math.floor(newPos.x - 13)}px`;
    this.top = `${Math.floor(newPos.y)}px`;
  }
};

/**
 * @returns {Boolean} true if the object has been destroyed, false otherwise.
 */
TransformEditorViewModel.prototype.isDestroyed = function () {
  return false;
};

/**
 * Destroys the view model.
 */
TransformEditorViewModel.prototype.destroy = function () {
  this.deactivate();
  this._sseh.destroy();
  this._rotationEditor.destroy();
  this._translationEditor.destroy();
  this._scaleEditor.destroy();
  this._removePostUpdateEvent();
  destroyObject(this);
};

TransformEditorViewModel.EditorMode = EditorMode;
export default TransformEditorViewModel;
