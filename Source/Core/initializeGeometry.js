import {
  CzmlDataSource,
  DataSourceDisplay,
  Entity,
  GeometryVisualizer,
  DeveloperError,
} from "@cesium/engine";
import FanGeometryUpdater from "../DataSources/FanGeometryUpdater.js";
import FanGraphics from "../DataSources/FanGraphics.js";
import processFan from "../DataSources/processFan.js";
import VectorGraphics from "../DataSources/VectorGraphics.js";
import processVector from "../DataSources/processVector.js";
import VectorVisualizer from "../DataSources/VectorVisualizer.js";

export default function initializeGeometry() {
  if (DataSourceDisplay && CzmlDataSource && Entity && GeometryVisualizer) {
    DataSourceDisplay.registerVisualizer(VectorVisualizer);

    CzmlDataSource.registerUpdater(processFan);
    CzmlDataSource.registerUpdater(processVector);

    Entity.registerEntityType("fan", FanGraphics);
    Entity.registerEntityType("vector", VectorGraphics);

    GeometryVisualizer.registerUpdater(FanGeometryUpdater);
  } else {
    throw new DeveloperError(
      "attempted to initialize sensors code before CesiumJS core",
    );
  }
}

initializeGeometry();
