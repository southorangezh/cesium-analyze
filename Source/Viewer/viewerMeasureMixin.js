import {
  clone,
  defined,
  DeveloperError,
  Frozen,
  wrapFunction,
} from "@cesium/engine";
import Measure from "../Measure/Measure.js";

/**
 * A mixin which adds the Measure widget to the Viewer widget.
 * Rather than being called directly, this function is normally passed as
 * a parameter to {@link Viewer#extend}, as shown in the example below.
 * @function
 * @ionsdk
 *
 * @param {Viewer} viewer The viewer instance.
 * @param {Object} [options] An object with the following properties:
 * @param {MeasureUnits} [options.units=MeasureUnits.METERS] The default unit of measurement
 * @param {String} [options.locale] The {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag} string customizing language-sensitive number formatting. If <code>undefined</code>, the runtime's default locale is used. See the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation|Intl page on MDN}
 *
 * @exception {DeveloperError} viewer is required.
 *
 * @example
 * var viewer = new Cesium.Viewer('cesiumContainer');
 * viewer.extend(IonSdkMeasurements.viewerMeasureMixin);
 */
function viewerMeasureMixin(viewer, options) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(viewer)) {
    throw new DeveloperError("viewer is required.");
  }
  //>>includeEnd('debug');

  options = options ?? Frozen.EMPTY_OBJECT;
  const scene = viewer.scene;
  const cesiumMeasureContainer = document.createElement("div");
  cesiumMeasureContainer.className = "cesium-viewer-measureContainer";
  viewer._toolbar.insertBefore(
    cesiumMeasureContainer,
    viewer._toolbar.firstChild,
  );
  options = clone(options);
  options.container = cesiumMeasureContainer;
  options.scene = scene;
  const measure = new Measure(options);

  const removeListener = scene.postUpdate.addEventListener(function () {
    const panelMaxHeight = viewer._container.clientHeight - 125;
    measure._dropdown.style.maxHeight = `${panelMaxHeight}px`;
  });

  viewer.destroy = wrapFunction(viewer, viewer.destroy, function () {
    removeListener();
    measure.destroy();
  });

  Object.defineProperties(viewer, {
    measure: {
      get: function () {
        return measure;
      },
    },
  });
}
export default viewerMeasureMixin;
