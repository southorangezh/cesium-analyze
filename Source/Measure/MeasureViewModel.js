import {
  clone,
  defined,
  destroyObject,
  Check,
  Frozen,
  LabelCollection,
  PointPrimitiveCollection,
  PrimitiveCollection,
} from "@cesium/engine";
import knockout from "../ThirdParty/knockout.js";
import AreaMeasurement from "./AreaMeasurement.js";
import DistanceMeasurement from "./DistanceMeasurement.js";
import HeightMeasurement from "./HeightMeasurement.js";
import HorizontalMeasurement from "./HorizontalMeasurement.js";
import MeasurementMouseHandler from "./MeasurementMouseHandler.js";
import MeasureUnits from "./MeasureUnits.js";
import PointMeasurement from "./PointMeasurement.js";
import PolylineMeasurement from "./PolylineMeasurement.js";
import VerticalMeasurement from "./VerticalMeasurement.js";

/**
 * A widget for making ephemeral measurements.
 * @alias MeasureViewModel
 * @ionsdk
 *
 * @param {Object} options An object with the following properties:
 * @param {Scene} options.scene The scene
 * @param {MeasureUnits} [options.units] The units of measurement
 * @param {String} [options.locale] The {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag} string customizing language-sensitive number formatting. If <code>undefined</code>, the runtime's default locale is used. See the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation|Intl page on MDN}
 * @param {PrimitiveCollection} [options.primitives] A collection in which to store the measurement primitives
 *
 * @constructor
 */
function MeasureViewModel(options) {
  options = options ?? Frozen.EMPTY_OBJECT;

  const scene = options.scene;
  //>>includeStart('debug', pragmas.debug);
  Check.defined("options.scene", scene);
  //>>includeEnd('debug');

  const units = defined(options.units) ? options.units : new MeasureUnits();
  const primitives = defined(options.primitives)
    ? options.primitives
    : scene.primitives.add(new PrimitiveCollection());
  const points = primitives.add(new PointPrimitiveCollection());
  const labels = primitives.add(new LabelCollection());

  const mouseHandler = new MeasurementMouseHandler(scene);
  const measurementOptions = {
    scene: scene,
    units: units,
    locale: options.locale,
    points: points,
    labels: labels,
    primitives: primitives,
  };
  const componentOptions = clone(measurementOptions);
  componentOptions.showComponentLines = true;

  const measurements = [
    new DistanceMeasurement(measurementOptions),
    new DistanceMeasurement(componentOptions),
    new PolylineMeasurement(measurementOptions),
    new HorizontalMeasurement(measurementOptions),
    new VerticalMeasurement(measurementOptions),
    new HeightMeasurement(measurementOptions),
    new AreaMeasurement(measurementOptions),
    new PointMeasurement(measurementOptions),
  ];

  /**
   * Gets and sets whether the measurement toolbar is expanded.
   * @type {Boolean}
   * @default false
   */
  this.expanded = false;
  const expanded = knockout.observable(false);
  knockout.defineProperty(this, "expanded", {
    get: function () {
      return expanded();
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Check.typeOf.bool("expanded", value);
      //>>includeEnd('debug');
      if (value === expanded()) {
        return;
      }
      expanded(value);
      if (value) {
        this._activate();
      } else {
        this._deactivate();
      }
    },
  });

  /**
   * Gets and sets whether the instructions are visible.
   * @type {Boolean}
   * @default false
   */
  this.instructionsVisible = false;

  /**
   * Gets or sets the currently selected measurement.  This property is observable.
   * @type {Measurement}
   * @default undefined
   */
  this.selectedMeasurement = undefined;
  const selectedMeasurement = knockout.observable();
  knockout.defineProperty(this, "selectedMeasurement", {
    get: function () {
      return selectedMeasurement();
    },
    set: function (value) {
      const old = selectedMeasurement();
      if (defined(old)) {
        old.reset();
      }
      selectedMeasurement(value);
      mouseHandler.selectedMeasurement = value;
      if (scene.requestRenderMode) {
        scene.requestRender();
      }
    },
  });

  knockout.track(this, ["expanded", "instructionsVisible"]);

  this._measurements = measurements;
  this._units = units;
  this._mouseHandler = mouseHandler;
  this._primitives = primitives;

  this._scene = scene;

  this._removeListener = scene.morphStart.addEventListener(
    MeasureViewModel.prototype.onMorph,
    this,
  );
}

Object.defineProperties(MeasureViewModel.prototype, {
  /**
   * Gets the scene.
   * @type {Scene}
   * @memberof MeasureViewModel.prototype
   * @readonly
   */
  scene: {
    get: function () {
      return this._scene;
    },
  },
  /**
   * Gets the array of available measurement types.
   * @type {Measurement[]}
   * @memberof MeasureViewModel.prototype
   * @readonly
   */
  measurements: {
    get: function () {
      return this._measurements;
    },
  },
  /**
   * Gets the selected unit of measurement.
   * @type {MeasureUnits}
   * @memberof MeasureViewModel.prototype
   */
  units: {
    get: function () {
      return this._units;
    },
    set: function (value) {
      this._units = value;
      this.selectedMeasurement.selectedUnits = value;
    },
  },
});

/**
 * Toggles the state of the toolbar.
 */
MeasureViewModel.prototype.toggleActive = function () {
  this.expanded = !this.expanded;
};

/**
 * Toggles the visibility of the instructions panel.
 */
MeasureViewModel.prototype.toggleInstructions = function () {
  this.instructionsVisible = !this.instructionsVisible;
};

/**
 * @private
 */
MeasureViewModel.prototype._activate = function () {
  this._mouseHandler.activate();
  this.selectedMeasurement = this._measurements[0];
};

/**
 * @private
 */
MeasureViewModel.prototype._deactivate = function () {
  this._mouseHandler.deactivate();
  this.selectedMeasurement = undefined;
  this.reset();
};

MeasureViewModel.prototype.onMorph = function (
  transitioner,
  oldMode,
  newMode,
  isMorphing,
) {
  this.reset();
};

/**
 * Resets the widget.
 */
MeasureViewModel.prototype.reset = function () {
  this.instructionsVisible = false;
  this._measurements.forEach(function (measurement) {
    measurement.reset();
  });
};

/**
 * @returns {Boolean} true if the object has been destroyed, false otherwise.
 */
MeasureViewModel.prototype.isDestroyed = function () {
  return false;
};

/**
 * Destroys the widget view model.
 */
MeasureViewModel.prototype.destroy = function () {
  this._deactivate();
  this._mouseHandler.destroy();
  this._measurements.forEach(function (measurement) {
    measurement.destroy();
  });
  this._scene.primitives.remove(this._primitives);
  return destroyObject(this);
};
export default MeasureViewModel;
