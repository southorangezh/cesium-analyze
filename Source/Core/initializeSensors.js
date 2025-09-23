import {
  CzmlDataSource,
  DataSourceDisplay,
  Entity,
  Scene,
  DeveloperError,
} from "@cesium/engine";
import ConicSensorVisualizer from "../DataSources/ConicSensorVisualizer.js";
import CustomPatternSensorVisualizer from "../DataSources/CustomPatternSensorVisualizer.js";
import RectangularSensorVisualizer from "../DataSources/RectangularSensorVisualizer.js";
import processRectangularSensor from "../DataSources/processRectangularSensor.js";
import processConicSensor from "../DataSources/processConicSensor.js";
import processCustomPatternSensor from "../DataSources/processCustomPatternSensor.js";
import ConicSensorGraphics from "../DataSources/ConicSensorGraphics.js";
import CustomPatternSensorGraphics from "../DataSources/CustomPatternSensorGraphics.js";
import RectangularSensorGraphics from "../DataSources/RectangularSensorGraphics.js";

export default function initializeSensors() {
  if (DataSourceDisplay && CzmlDataSource && Entity && Scene) {
    DataSourceDisplay.registerVisualizer(ConicSensorVisualizer);
    DataSourceDisplay.registerVisualizer(CustomPatternSensorVisualizer);
    DataSourceDisplay.registerVisualizer(RectangularSensorVisualizer);

    CzmlDataSource.registerUpdater(processRectangularSensor);
    CzmlDataSource.registerUpdater(processConicSensor);
    CzmlDataSource.registerUpdater(processCustomPatternSensor);

    Entity.registerEntityType("conicSensor", ConicSensorGraphics);
    Entity.registerEntityType(
      "customPatternSensor",
      CustomPatternSensorGraphics,
    );
    Entity.registerEntityType("rectangularSensor", RectangularSensorGraphics);

    // https://github.com/CesiumGS/cesium-analytics/issues/454
    Scene.defaultLogDepthBuffer = false;
  } else {
    throw new DeveloperError(
      "attempted to initialize sensors code before CesiumJS core",
    );
  }
}

initializeSensors();
